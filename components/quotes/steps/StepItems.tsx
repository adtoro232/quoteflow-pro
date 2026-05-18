"use client";

import { useState } from "react";
import { useQuoteBuilder } from "@/hooks/use-quote-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { ProductPicker } from "@/components/quotes/ProductPicker";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Package, LayoutGrid
} from "lucide-react";
import type { Product } from "@/types";

export function StepItems({ products }: { products: Product[] }) {
  const { items, addItem, updateItem, removeItem, moveItem, discount_amount, setDiscount, totals } = useQuoteBuilder();
  const [showPicker, setShowPicker] = useState(false);

  function addFromProduct(product: Product) {
    addItem({
      product_id: product.id,
      description: product.name,
      quantity: 1,
      unit: product.unit,
      unit_price: product.sale_price,
      discount_percentage: 0,
      vat_percentage: product.vat_percentage,
    });
  }

  function addMultiSplit(item: { description: string; unit_price: number; purchase_price: number }) {
    addItem({
      product_id: null,
      description: item.description,
      quantity: 1,
      unit: "set",
      unit_price: item.unit_price,
      discount_percentage: 0,
      vat_percentage: 21,
    });
  }

  function addCustomLine() {
    addItem({
      product_id: null,
      description: "Nieuwe regel",
      quantity: 1,
      unit: "stuks",
      unit_price: 0,
      discount_percentage: 0,
      vat_percentage: 21,
    });
  }

  return (
    <div className="space-y-4">
      {showPicker && (
        <ProductPicker
          products={products}
          onSelect={addFromProduct}
          onSelectMultiSplit={addMultiSplit}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Producten &amp; diensten</h2>
          <p className="text-sm text-slate-500">Kies een product uit de catalogus of maak een losse regel aan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addCustomLine}>
            <Plus className="w-4 h-4" />
            Losse regel
          </Button>
          <Button size="sm" onClick={() => setShowPicker(true)}>
            <LayoutGrid className="w-4 h-4" />
            Kies product
          </Button>
        </div>
      </div>

      {/* Items table */}
      {items.length > 0 ? (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-8">#</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-slate-500">Omschrijving</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-slate-500 w-20">Aantal</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-slate-500 w-20">Eenheid</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-slate-500 w-28">Prijs</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-slate-500 w-20">Korting%</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-slate-500 w-20">BTW%</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 w-28">Totaal</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-2 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="h-8 text-sm border-0 bg-transparent focus-visible:bg-white focus-visible:border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm text-center border-0 bg-transparent focus-visible:bg-white focus-visible:border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                      className="h-8 text-sm text-center border-0 bg-transparent focus-visible:bg-white focus-visible:border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, { unit_price: parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm text-right border-0 bg-transparent focus-visible:bg-white focus-visible:border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.discount_percentage}
                      onChange={(e) => updateItem(item.id, { discount_percentage: parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm text-center border-0 bg-transparent focus-visible:bg-white focus-visible:border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.vat_percentage}
                      onChange={(e) => updateItem(item.id, { vat_percentage: parseFloat(e.target.value) })}
                      className="h-8 w-full text-sm text-center bg-transparent border-0 focus:outline-none focus:bg-white focus:border focus:border-input rounded"
                    >
                      <option value="0">0%</option>
                      <option value="9">9%</option>
                      <option value="21">21%</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-slate-900">
                    {formatCurrency(item.line_total)}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveItem(item.id, "up")} disabled={idx === 0} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => moveItem(item.id, "down")} disabled={idx === items.length - 1} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-slate-300 hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t bg-slate-50 px-6 py-4">
            <div className="flex justify-end">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotaal (excl. BTW)</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Extra korting (€)</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount_amount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="h-7 w-28 text-right text-sm"
                  />
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>BTW</span>
                  <span>{formatCurrency(totals.vat_amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base border-t pt-2">
                  <span>Totaal incl. BTW</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 py-16 flex flex-col items-center text-center">
          <Package className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Geen regels</p>
          <p className="text-slate-400 text-sm">Voeg producten toe via de catalogus of maak een losse regel aan</p>
        </div>
      )}
    </div>
  );
}
