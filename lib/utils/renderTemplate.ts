import { formatCurrency, formatDateLong } from "./index";
import type { Quote, QuoteItem } from "@/types";

interface TemplateData {
  quote: Quote;
  items: QuoteItem[];
}

function buildItemsTable(items: QuoteItem[], discountAmount: number = 0): string {
  const rows = items
    .map((item) => {
      const imageUrl = (item.product as { image_url?: string | null } | undefined)?.image_url;
      const imageHtml = imageUrl
        ? `<img src="${imageUrl}" alt="${item.description}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0;" />`
        : `<div style="width:52px;height:52px;border-radius:8px;background:#f0f0f0;flex-shrink:0;"></div>`;
      const hasDiscount = item.discount_percentage > 0;
      const discountedUnitPrice = item.unit_price * (1 - item.discount_percentage / 100);
      const discountBadge = hasDiscount
        ? `<span style="background:#f07b00;color:#fff;font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:6px;">${item.discount_percentage}% korting</span>`
        : "";
      const priceHtml = hasDiscount
        ? `<span style="text-decoration:line-through;color:#aaa;margin-right:4px;">${formatCurrency(item.unit_price)}</span><span>${formatCurrency(discountedUnitPrice)}</span>/stuk`
        : `${formatCurrency(item.unit_price)}/stuk`;
      return `<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0;">
      ${imageHtml}
      <div style="flex:1;min-width:0;">
        <div style="color:#1b2b4b;font-size:14px;font-weight:700;margin-bottom:3px;line-height:1.3;">${item.description}${discountBadge}</div>
        <div style="color:#888888;font-size:12px;">${item.quantity} ${item.unit} &middot; ${priceHtml} &middot; ${item.vat_percentage}% btw</div>
      </div>
      <div style="color:#1b2b4b;font-size:15px;font-weight:800;white-space:nowrap;flex-shrink:0;padding-top:2px;">${formatCurrency(item.line_total)}</div>
    </div>`;
    })
    .join("");

  const discountRow = discountAmount > 0
    ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:52px;flex-shrink:0;"></div>
          <div style="color:#f07b00;font-size:13px;font-weight:700;">🎁 Korting</div>
        </div>
        <div style="color:#f07b00;font-size:15px;font-weight:800;white-space:nowrap;">- ${formatCurrency(discountAmount)}</div>
      </div>`
    : "";

  return `<div style="border-top:2px solid #1b2b4b;margin-bottom:0;">${rows}${discountRow}</div>`;
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
    "{{quote_items}}": buildItemsTable(items, quote.discount_amount),
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
