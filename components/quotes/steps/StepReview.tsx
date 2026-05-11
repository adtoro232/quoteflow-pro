"use client";

import { useQuoteBuilder } from "@/hooks/use-quote-builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Building2, FileStack, Package, CalendarDays } from "lucide-react";
import type { Customer, QuoteTemplate } from "@/types";

interface StepReviewProps {
  customers: Customer[];
  templates: QuoteTemplate[];
}

export function StepReview({ customers, templates }: StepReviewProps) {
  const {
    customer_id, template_id, items, totals,
    discount_amount, internal_notes, customer_message, expiry_date,
    setNotes, setMessage, setExpiryDate,
  } = useQuoteBuilder();

  const customer = customers.find((c) => c.id === customer_id);
  const template = templates.find((t) => t.id === template_id);

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Review &amp; opties</h2>
        <p className="text-sm text-slate-500">Controleer de offerte en stel aanvullende opties in</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Klant
          </div>
          <p className="font-medium text-slate-900">{customer?.company_name ?? "—"}</p>
          <p className="text-sm text-slate-500">{customer?.contact_name ?? ""}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <FileStack className="w-3.5 h-3.5" />
            Template
          </div>
          <p className="font-medium text-slate-900">{template?.name ?? "Standaard"}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <Package className="w-3.5 h-3.5" />
            Regels
          </div>
          <p className="font-medium text-slate-900">{items.length} regel{items.length !== 1 ? "s" : ""}</p>
          <p className="text-sm font-semibold text-blue-700">{formatCurrency(totals.total)}</p>
        </div>
      </div>

      {/* Items preview */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-slate-50">
          <p className="text-sm font-medium text-slate-700">Offerteregels</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50/50">
              <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">Omschrijving</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-slate-500">Qty</th>
              <th className="text-right px-3 py-2 text-xs font-medium text-slate-500">Prijs</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-slate-500">BTW</th>
              <th className="text-right px-5 py-2 text-xs font-medium text-slate-500">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-5 py-2.5 font-medium text-slate-800">{item.description}</td>
                <td className="px-3 py-2.5 text-center text-slate-600">{item.quantity} {item.unit}</td>
                <td className="px-3 py-2.5 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                <td className="px-3 py-2.5 text-center text-slate-600">{item.vat_percentage}%</td>
                <td className="px-5 py-2.5 text-right font-medium">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-slate-50/50">
              <td colSpan={4} className="px-5 py-2.5 text-sm text-slate-600 text-right">Subtotaal</td>
              <td className="px-5 py-2.5 text-right font-medium">{formatCurrency(totals.subtotal)}</td>
            </tr>
            {discount_amount > 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-2 text-sm text-slate-600 text-right">Korting</td>
                <td className="px-5 py-2 text-right text-red-600 font-medium">-{formatCurrency(discount_amount)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={4} className="px-5 py-2 text-sm text-slate-600 text-right">BTW</td>
              <td className="px-5 py-2 text-right font-medium">{formatCurrency(totals.vat_amount)}</td>
            </tr>
            <tr className="border-t">
              <td colSpan={4} className="px-5 py-3 font-bold text-slate-900 text-right">Totaal incl. BTW</td>
              <td className="px-5 py-3 text-right font-bold text-xl text-blue-800">{formatCurrency(totals.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <h3 className="font-medium text-slate-900">Instellingen</h3>
        <div>
          <Label htmlFor="expiry_date" className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Geldig tot
          </Label>
          <Input
            id="expiry_date"
            type="date"
            value={expiry_date}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 max-w-xs"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <Label htmlFor="customer_message">Bericht aan klant</Label>
          <Textarea
            id="customer_message"
            value={customer_message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1"
            placeholder="Geachte klant, hierbij sturen wij u onze offerte..."
          />
        </div>
        <div>
          <Label htmlFor="internal_notes">Interne notities (niet zichtbaar voor klant)</Label>
          <Textarea
            id="internal_notes"
            value={internal_notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1"
            placeholder="Interne opmerkingen..."
          />
        </div>
      </div>
    </div>
  );
}
