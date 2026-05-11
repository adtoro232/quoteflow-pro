"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, X, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductPickerProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onClose: () => void;
}

// Parse merk, serie en kW uit productnaam
function parseProduct(product: Product) {
  const name = product.name;

  // Merk: eerste woord
  const brand = name.split(" ")[0] ?? "Overig";

  // kW: zoek "X,X kW" of "X kW"
  const kwMatch = name.match(/(\d+[,.]?\d*)\s*kW/i);
  const kw = kwMatch ? parseFloat(kwMatch[1].replace(",", ".")) : 0;

  // Serie: detecteer op sleutelwoorden
  let series = "Overig";
  const lower = name.toLowerCase();
  if (lower.includes("artcool") || lower.includes("mirror")) {
    series = "Artcool Black Mirror";
  } else if (lower.includes("deluxe")) {
    series = "Deluxe";
  } else if (lower.includes("ai air special") || lower.includes("special")) {
    series = "AI AIR Special";
  } else if (lower.includes("diamond natural white zubadan") || lower.includes("diamond natural white zubadan")) {
    series = "Diamond Natural White Zubadan";
  } else if (lower.includes("diamond pearl white zubadan")) {
    series = "Diamond Pearl White Zubadan";
  } else if (lower.includes("diamond black zubadan")) {
    series = "Diamond Black Zubadan";
  } else if (lower.includes("diamond ruby red zubadan")) {
    series = "Diamond Ruby Red Zubadan";
  } else if (lower.includes("diamond onyx black")) {
    series = "Diamond Onyx Black";
  } else if (lower.includes("diamond ruby red")) {
    series = "Diamond Ruby Red";
  } else if (lower.includes("diamond pearl")) {
    series = "Diamond Pearl White";
  } else if (lower.includes("diamond natural")) {
    series = "Diamond Natural White";
  } else if (lower.includes("vloermodel")) {
    series = "Vloermodel";
  } else if (lower.includes("diamond")) {
    series = "Diamond";
  } else if (lower.includes("premium onyx") || lower.includes("onyx black")) {
    series = "Premium Onyx Black";
  } else if (lower.includes("premium silver") || lower.includes("silver")) {
    series = "Premium Silver";
  } else if (lower.includes("premium natural") || lower.includes("natural white")) {
    series = "Premium Natural White";
  } else if (lower.includes("compact")) {
    series = "Compact";
  } else if (lower.includes("msz-hr") || lower.includes("msz hr")) {
    series = "MSZ-HR";
  }

  return { brand, kw, series };
}

function kwLabel(kw: number) {
  return `${kw.toString().replace(".", ",")} kW`;
}

export function ProductPicker({ products, onSelect, onClose }: ProductPickerProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedKw, setSelectedKw] = useState<number | null>(null);

  const activeProducts = products.filter((p) => p.is_active);

  // Alle merken
  const brands = useMemo(() => {
    const set = new Set(activeProducts.map((p) => parseProduct(p).brand));
    return Array.from(set).sort();
  }, [activeProducts]);

  // kW opties voor geselecteerd merk
  const kwOptions = useMemo(() => {
    if (!selectedBrand) return [];
    const set = new Set(
      activeProducts
        .filter((p) => parseProduct(p).brand === selectedBrand)
        .map((p) => parseProduct(p).kw)
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [activeProducts, selectedBrand]);

  // Modellen voor geselecteerd merk + kW
  const models = useMemo(() => {
    if (!selectedBrand || selectedKw === null) return [];
    return activeProducts.filter((p) => {
      const parsed = parseProduct(p);
      return parsed.brand === selectedBrand && parsed.kw === selectedKw;
    });
  }, [activeProducts, selectedBrand, selectedKw]);

  // Stap bepalen
  const step = selectedBrand === null ? 1 : selectedKw === null ? 2 : 3;

  function goBack() {
    if (step === 3) setSelectedKw(null);
    else if (step === 2) setSelectedBrand(null);
  }

  // Serie kleur/stijl
  function seriesStyle(series: string) {
    switch (series) {
      case "Artcool Black Mirror":
        return { bg: "bg-slate-900", text: "text-white", accent: "border-slate-700" };
      case "Deluxe":
        return { bg: "bg-blue-700", text: "text-white", accent: "border-blue-500" };
      case "AI AIR Special":
        return { bg: "bg-orange-500", text: "text-white", accent: "border-orange-400" };
      case "MSZ-HR":
        return { bg: "bg-red-700", text: "text-white", accent: "border-red-500" };
      case "Compact":
        return { bg: "bg-red-500", text: "text-white", accent: "border-red-400" };
      case "Premium Natural White":
        return { bg: "bg-stone-100", text: "text-stone-900", accent: "border-stone-300" };
      case "Premium Silver":
        return { bg: "bg-slate-400", text: "text-white", accent: "border-slate-300" };
      case "Premium Onyx Black":
        return { bg: "bg-zinc-900", text: "text-white", accent: "border-zinc-700" };
      case "Diamond Natural White":
        return { bg: "bg-sky-600", text: "text-white", accent: "border-sky-400" };
      case "Diamond Pearl White":
        return { bg: "bg-sky-800", text: "text-white", accent: "border-sky-600" };
      case "Diamond Onyx Black":
        return { bg: "bg-neutral-900", text: "text-white", accent: "border-neutral-700" };
      case "Diamond Ruby Red":
        return { bg: "bg-red-700", text: "text-white", accent: "border-red-500" };
      case "Diamond Natural White Zubadan":
        return { bg: "bg-teal-600", text: "text-white", accent: "border-teal-400" };
      case "Diamond Pearl White Zubadan":
        return { bg: "bg-teal-800", text: "text-white", accent: "border-teal-600" };
      case "Diamond Black Zubadan":
        return { bg: "bg-stone-800", text: "text-white", accent: "border-stone-600" };
      case "Diamond Ruby Red Zubadan":
        return { bg: "bg-rose-700", text: "text-white", accent: "border-rose-500" };
      case "Vloermodel":
        return { bg: "bg-amber-700", text: "text-white", accent: "border-amber-500" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-900", accent: "border-slate-200" };
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {step === 1 && "Kies een merk"}
                {step === 2 && `${selectedBrand} — Kies vermogen`}
                {step === 3 && `${selectedBrand} · ${kwLabel(selectedKw!)} — Kies model`}
              </h2>
              {/* Breadcrumb */}
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span className={step === 1 ? "font-semibold text-slate-700" : "text-slate-400"}>Merk</span>
                <span className="text-slate-300">›</span>
                <span className={step === 2 ? "font-semibold text-slate-700" : step > 2 ? "text-slate-400" : "text-slate-300"}>Vermogen</span>
                <span className="text-slate-300">›</span>
                <span className={step === 3 ? "font-semibold text-slate-700" : "text-slate-300"}>Model</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Stap 1: Merk */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {brands.map((brand) => {
                const count = activeProducts.filter((p) => parseProduct(p).brand === brand).length;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-2xl font-black text-slate-700 group-hover:text-primary transition-colors">
                      {brand[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{brand}</p>
                      <p className="text-xs text-slate-400">{count} model{count !== 1 ? "len" : ""}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Stap 2: kW */}
          {step === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {kwOptions.map((kw) => {
                const count = activeProducts.filter((p) => {
                  const parsed = parseProduct(p);
                  return parsed.brand === selectedBrand && parsed.kw === kw;
                }).length;
                return (
                  <button
                    key={kw}
                    onClick={() => setSelectedKw(kw)}
                    className="group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center"
                  >
                    <div className="flex items-center gap-1 text-slate-700 group-hover:text-primary transition-colors">
                      <Zap className="w-6 h-6" />
                      <span className="text-3xl font-black">{kwLabel(kw)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{count} model{count !== 1 ? "len" : ""}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Stap 3: Model */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {models.map((product) => {
                const { series } = parseProduct(product);
                const style = seriesStyle(series);
                return (
                  <button
                    key={product.id}
                    onClick={() => { onSelect(product); onClose(); }}
                    className="group text-left rounded-2xl border-2 border-slate-200 hover:border-primary overflow-hidden transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Serie header */}
                    <div className={`${style.bg} ${style.text} px-4 py-3 flex items-center justify-between`}>
                      <span className="text-sm font-bold tracking-wide">{series}</span>
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Product info */}
                    <div className="p-4 bg-white">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-slate-500 mt-1">{product.description}</p>
                      )}
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Verkoopprijs</p>
                          <p className="text-xl font-black text-slate-900">{formatCurrency(product.sale_price)}</p>
                          <p className="text-xs text-slate-400">excl. {product.vat_percentage}% BTW</p>
                        </div>
                        <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Toevoegen
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
