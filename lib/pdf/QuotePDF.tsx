import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import type { Quote, QuoteItem } from "@/types";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#ffffff",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
  },
  companyBlock: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.5,
  },
  titleBlock: {
    marginBottom: 24,
  },
  quoteTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 4,
  },
  quoteNumber: {
    fontSize: 12,
    color: "#64748b",
  },
  metaGrid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  metaBlock: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 12,
  },
  metaLabel: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.5,
  },
  metaValueBold: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
    padding: "8 12",
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: "8 12",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.2, textAlign: "right" },
  colDiscount: { flex: 0.8, textAlign: "center" },
  colVat: { flex: 0.8, textAlign: "center" },
  colTotal: { flex: 1.2, textAlign: "right" },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  totalsTable: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4 0",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  totalsLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  totalsValue: {
    fontSize: 9,
    color: "#0f172a",
  },
  totalsFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "8 0",
    borderTopWidth: 2,
    borderTopColor: "#1e3a5f",
    marginTop: 4,
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  totalsFinalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  terms: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 8,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#cbd5e1",
  },
});

interface QuotePDFProps {
  quote: Quote;
  items: QuoteItem[];
}

export function QuotePDF({ quote, items }: QuotePDFProps) {
  const customer = quote.customer as ReturnType<typeof Object.assign>;
  const user = quote.user as ReturnType<typeof Object.assign>;
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Ons Bedrijf";
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "";
  const companyKvk = process.env.NEXT_PUBLIC_COMPANY_KVK ?? "";
  const companyVat = process.env.NEXT_PUBLIC_COMPANY_VAT ?? "";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "";
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1e3a5f" }}>
              {companyName}
            </Text>
          </View>
          <View style={styles.companyBlock}>
            <Text style={styles.companyInfo}>{companyAddress}</Text>
            <Text style={styles.companyInfo}>{companyEmail} | {companyPhone}</Text>
            <Text style={styles.companyInfo}>KvK: {companyKvk} | BTW: {companyVat}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.quoteTitle}>Offerte</Text>
          <Text style={styles.quoteNumber}>{quote.quote_number}</Text>
        </View>

        {/* Meta */}
        <View style={styles.metaGrid}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Klant</Text>
            <Text style={styles.metaValueBold}>{customer?.company_name ?? "—"}</Text>
            {customer?.contact_name && <Text style={styles.metaValue}>t.a.v. {customer.contact_name}</Text>}
            {customer?.address && <Text style={styles.metaValue}>{customer.address}</Text>}
            {customer?.postal_code && customer?.city && (
              <Text style={styles.metaValue}>{customer.postal_code} {customer.city}</Text>
            )}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Offerte details</Text>
            <Text style={styles.metaValue}>Nummer: {quote.quote_number}</Text>
            <Text style={styles.metaValue}>Datum: {formatDateLong(quote.quote_date)}</Text>
            {quote.expiry_date && (
              <Text style={styles.metaValue}>Geldig tot: {formatDateLong(quote.expiry_date)}</Text>
            )}
            <Text style={styles.metaValue}>Opgesteld door: {user?.full_name ?? ""}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>Omschrijving</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Aantal</Text>
          <Text style={[styles.tableHeaderText, styles.colPrice]}>Prijs</Text>
          <Text style={[styles.tableHeaderText, styles.colDiscount]}>Korting</Text>
          <Text style={[styles.tableHeaderText, styles.colVat]}>BTW</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Totaal</Text>
        </View>

        {items.map((item, idx) => (
          <View key={item.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={[{ fontSize: 9, color: "#0f172a" }, styles.colDesc]}>{item.description}</Text>
            <Text style={[{ fontSize: 9, textAlign: "center", color: "#64748b" }, styles.colQty]}>
              {item.quantity} {item.unit}
            </Text>
            <Text style={[{ fontSize: 9, textAlign: "right", color: "#64748b" }, styles.colPrice]}>
              {formatCurrency(item.unit_price)}
            </Text>
            <Text style={[{ fontSize: 9, textAlign: "center", color: "#64748b" }, styles.colDiscount]}>
              {item.discount_percentage > 0 ? `${item.discount_percentage}%` : "—"}
            </Text>
            <Text style={[{ fontSize: 9, textAlign: "center", color: "#64748b" }, styles.colVat]}>
              {item.vat_percentage}%
            </Text>
            <Text style={[{ fontSize: 9, textAlign: "right", fontFamily: "Helvetica-Bold" }, styles.colTotal]}>
              {formatCurrency(item.line_total)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotaal excl. BTW</Text>
              <Text style={styles.totalsValue}>{formatCurrency(quote.subtotal)}</Text>
            </View>
            {quote.discount_amount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Korting</Text>
                <Text style={[styles.totalsValue, { color: "#dc2626" }]}>-{formatCurrency(quote.discount_amount)}</Text>
              </View>
            )}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>BTW</Text>
              <Text style={styles.totalsValue}>{formatCurrency(quote.vat_amount)}</Text>
            </View>
            <View style={styles.totalsFinalRow}>
              <Text style={styles.totalsFinalLabel}>Totaal incl. BTW</Text>
              <Text style={styles.totalsFinalValue}>{formatCurrency(quote.total)}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          Betaling binnen 30 dagen na factuurdatum. Prijzen zijn exclusief BTW tenzij anders vermeld.{"\n"}
          Deze offerte is geldig tot {quote.expiry_date ? formatDateLong(quote.expiry_date) : "nader order"}.
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>
          {companyName} · {companyEmail} · {companyPhone} · KvK: {companyKvk}
        </Text>
      </Page>
    </Document>
  );
}
