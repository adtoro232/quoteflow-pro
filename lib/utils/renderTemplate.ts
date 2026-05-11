import { formatCurrency, formatDateLong } from "./index";
import type { Quote, QuoteItem } from "@/types";

interface TemplateData {
  quote: Quote;
  items: QuoteItem[];
}

function buildItemsTable(items: QuoteItem[]): string {
  const rows = items
    .map((item) => {
      const imageUrl = (item.product as { image_url?: string | null } | undefined)?.image_url;
      const imageCell = imageUrl
        ? `<img src="${imageUrl}" alt="${item.description}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;display:block;" />`
        : `<div style="width:48px;height:48px;border-radius:6px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;"></div>`;
      return `
    <tr style="border-bottom: 1px solid #dddddd;">
      <td style="padding: 8px 4px; width: 60px;">${imageCell}</td>
      <td style="padding: 10px 4px; color: #1b2b4b; font-size: 14px; font-weight: 600;">${item.description}</td>
      <td style="padding: 10px 4px; color: #555555; font-size: 13px; text-align: right; white-space: nowrap;">${item.quantity} ${item.unit}</td>
      <td style="padding: 10px 4px; color: #555555; font-size: 13px; text-align: right; white-space: nowrap;">${formatCurrency(item.unit_price)}</td>
      ${item.discount_percentage > 0 ? `<td style="padding: 10px 4px; color: #555555; font-size: 13px; text-align: right;">${item.discount_percentage}%</td>` : ""}
      <td style="padding: 10px 4px; color: #555555; font-size: 13px; text-align: right;">${item.vat_percentage}% btw</td>
      <td style="padding: 10px 4px; color: #1b2b4b; font-size: 14px; font-weight: 700; text-align: right; white-space: nowrap;">${formatCurrency(item.line_total)}</td>
    </tr>`;
    })
    .join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-top: 2px solid #1b2b4b; margin-bottom: 0;">
    <thead>
      <tr style="background: #1b2b4b;">
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: left; letter-spacing: 0.04em; text-transform: uppercase; width: 60px;"></th>
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: left; letter-spacing: 0.04em; text-transform: uppercase;">Omschrijving</th>
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: right; letter-spacing: 0.04em; text-transform: uppercase;">Aantal</th>
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: right; letter-spacing: 0.04em; text-transform: uppercase;">Prijs</th>
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: right; letter-spacing: 0.04em; text-transform: uppercase;">BTW</th>
        <th style="padding: 9px 4px; color: #ffffff; font-size: 11px; font-weight: 700; text-align: right; letter-spacing: 0.04em; text-transform: uppercase;">Totaal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function renderTemplate(html: string, data: TemplateData): string {
  const { quote, items } = data;
  const customer = quote.customer;
  const user = quote.user;

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "";
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "";
  const companyKvk = process.env.NEXT_PUBLIC_COMPANY_KVK ?? "";
  const companyVat = process.env.NEXT_PUBLIC_COMPANY_VAT ?? "";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "";
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "";

  const companyDetails = `${companyName}<br>${companyAddress}<br>KvK: ${companyKvk}<br>BTW: ${companyVat}<br>${companyEmail} | ${companyPhone}`;

  const customerAddress = [
    customer?.address,
    customer?.postal_code && customer?.city
      ? `${customer.postal_code} ${customer.city}`
      : customer?.city ?? customer?.postal_code ?? "",
  ]
    .filter(Boolean)
    .join(", ");

  const placeholders: Record<string, string> = {
    "{{customer_name}}": customer?.company_name ?? customer?.contact_name ?? "",
    "{{company_name}}": customer?.company_name ?? "",
    "{{customer_phone}}": customer?.phone ?? "—",
    "{{customer_email}}": customer?.email ?? "—",
    "{{customer_address}}": customerAddress || "—",
    "{{quote_number}}": quote.quote_number,
    "{{quote_date}}": formatDateLong(quote.quote_date),
    "{{expiry_date}}": quote.expiry_date
      ? formatDateLong(quote.expiry_date)
      : "-",
    "{{quote_items}}": buildItemsTable(items),
    "{{subtotal}}": formatCurrency(quote.subtotal),
    "{{discount}}":
      quote.discount_amount > 0
        ? formatCurrency(quote.discount_amount)
        : "-",
    "{{vat_amount}}": formatCurrency(quote.vat_amount),
    "{{total}}": formatCurrency(quote.total),
    "{{terms}}":
      "Betaling binnen 30 dagen na factuurdatum. Prijzen zijn exclusief BTW tenzij anders vermeld.",
    "{{user_name}}": user?.full_name ?? "",
    "{{company_logo}}": `<img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="${companyName}" style="height:48px;" />`,
    "{{company_details}}": companyDetails,
  };

  let result = html;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replaceAll(key, value);
  }
  return result;
}
