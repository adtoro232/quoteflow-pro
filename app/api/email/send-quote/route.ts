import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import type { Quote, QuoteItem } from "@/types";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "E-mail is niet geconfigureerd. Voeg een RESEND_API_KEY toe in .env.local." }, { status: 503 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { quoteId } = await req.json();
  if (!quoteId) return NextResponse.json({ error: "quoteId required" }, { status: 400 });

  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, customer:customers(*), user:profiles(*), template:quote_templates(*)")
    .eq("id", quoteId)
    .single();

  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const customer = quote.customer as Record<string, string | null>;
  if (!customer?.email) {
    return NextResponse.json({ error: "Klant heeft geen e-mailadres" }, { status: 400 });
  }

  const { data: items = [] } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", quoteId)
    .order("sort_order");

  const q = quote as Quote;
  const safeItems = (items ?? []) as QuoteItem[];

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Ons Bedrijf";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "";
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "";
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const publicUrl = `${appUrl}/quote/${q.public_token}`;

  // Load editable email settings from DB
  const { data: settingRows = [] } = await supabase.from("app_settings").select("key, value");
  const dbSettings: Record<string, string> = {};
  for (const row of settingRows ?? []) dbSettings[row.key] = row.value ?? "";

  const fromEmail = dbSettings.email_from || process.env.RESEND_FROM_EMAIL || "noreply@example.com";
  const customerName = (customer.company_name ?? customer.contact_name ?? "Klant") as string;

  // Replace placeholders in subject
  const subject = (dbSettings.email_subject || "Offerte {{quote_number}} van {{company_name}}")
    .replaceAll("{{quote_number}}", q.quote_number)
    .replaceAll("{{company_name}}", companyName)
    .replaceAll("{{customer_name}}", customerName);

  const emailIntro = (dbSettings.email_intro || "Hierbij ontvangt u onze offerte. Via de knop hieronder kunt u de offerte bekijken en direct accepteren of afwijzen.")
    .replaceAll("{{quote_number}}", q.quote_number)
    .replaceAll("{{company_name}}", companyName)
    .replaceAll("{{customer_name}}", customerName);

  const emailClosing = (dbSettings.email_closing || "Heeft u vragen? Neem gerust contact met ons op.")
    .replaceAll("{{quote_number}}", q.quote_number)
    .replaceAll("{{company_name}}", companyName)
    .replaceAll("{{customer_name}}", customerName);

  const { error } = await resend.emails.send({
    from: `${companyName} <${fromEmail}>`,
    to: [customer.email as string],
    subject,
    html: buildEmailHtml({
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      customerName,
      emailIntro,
      emailClosing,
      quote: q,
      items: safeItems,
      publicUrl,
    }),
  });

  if (error) {
    console.error("[send-quote] Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity
  await supabase.from("quote_activity").insert({
    quote_id: q.id,
    user_id: null,
    action: "sent",
    description: `E-mail verstuurd naar ${customer.email}`,
  });

  return NextResponse.json({ success: true });
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

interface EmailOptions {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  customerName: string;
  emailIntro: string;
  emailClosing: string;
  quote: Quote;
  items: QuoteItem[];
  publicUrl: string;
}

function buildEmailHtml(opts: EmailOptions): string {
  const { companyName, companyEmail, companyPhone, companyAddress, customerName, emailIntro, emailClosing, quote, items, publicUrl } = opts;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;">${item.description}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px;text-align:center;">${item.quantity} ${item.unit}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:right;font-weight:600;">${formatEuro(item.line_total)}</td>
    </tr>
  `).join("");

  const messageBlock = quote.customer_message
    ? `<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;padding:16px;margin:24px 0;">
        <p style="margin:0;color:#1e40af;font-size:14px;white-space:pre-wrap;">${quote.customer_message}</p>
       </div>`
    : "";

  const expiryBlock = quote.expiry_date
    ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Geldig tot</td><td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${formatDate(quote.expiry_date)}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

        <!-- Header -->
        <tr>
          <td style="background:#1b2b4b;padding:32px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${companyName}</h1>
            <p style="margin:8px 0 0;color:#93c5fd;font-size:14px;">Offerte ${quote.quote_number}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;color:#374151;font-size:16px;">Geachte ${customerName},</p>
            <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">${emailIntro}</p>

            ${messageBlock}

            <!-- Items table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e5e7eb;">Omschrijving</th>
                  <th style="padding:10px 8px;text-align:center;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e5e7eb;">Aantal</th>
                  <th style="padding:10px 16px;text-align:right;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e5e7eb;">Totaal</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Subtotaal excl. BTW</td><td style="padding:6px 0;color:#111827;font-size:14px;text-align:right;">${formatEuro(quote.subtotal)}</td></tr>
              ${quote.discount_amount > 0 ? `<tr><td style="padding:6px 0;color:#ef4444;font-size:14px;">Korting</td><td style="padding:6px 0;color:#ef4444;font-size:14px;text-align:right;">-${formatEuro(quote.discount_amount)}</td></tr>` : ""}
              <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">BTW</td><td style="padding:6px 0;color:#111827;font-size:14px;text-align:right;">${formatEuro(quote.vat_amount)}</td></tr>
              <tr style="border-top:2px solid #e5e7eb;">
                <td style="padding:12px 0 6px;color:#111827;font-size:16px;font-weight:700;">Totaal incl. BTW</td>
                <td style="padding:12px 0 6px;color:#1b2b4b;font-size:18px;font-weight:700;text-align:right;">${formatEuro(quote.total)}</td>
              </tr>
              ${expiryBlock}
            </table>

            <!-- CTA button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:8px 0 32px;">
                  <a href="${publicUrl}" style="display:inline-block;background:#1b2b4b;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;">
                    Bekijk &amp; accepteer offerte
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
              ${emailClosing}${companyEmail ? ` ${companyEmail}` : ""}${companyPhone ? ` | ${companyPhone}` : ""}
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              ${companyName}${companyAddress ? ` · ${companyAddress}` : ""}
            </p>
            <p style="margin:8px 0 0;color:#d1d5db;font-size:11px;text-align:center;">
              U ontvangt dit bericht omdat er een offerte voor u is aangemaakt.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
