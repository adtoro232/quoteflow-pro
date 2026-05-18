"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, X, Zap, Check, Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductPickerProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onSelectMultiSplit: (item: { description: string; unit_price: number; purchase_price: number }) => void;
  onClose: () => void;
}

// Parse merk, serie en kW uit productnaam
function parseProduct(product: Product) {
  const name = product.name;
  const brand = name.split(" ")[0] ?? "Overig";
  const kwMatch = name.match(/(\d+[,.]?\d*)\s*kW/i);
  const kw = kwMatch ? parseFloat(kwMatch[1].replace(",", ".")) : 0;
  const lower = name.toLowerCase();

  let series = "Overig";
  if (lower.includes("artcool") || lower.includes("mirror")) series = "Artcool Black Mirror";
  else if (lower.includes("deluxe")) series = "Deluxe";
  else if (lower.includes("ai air special") || lower.includes("special")) series = "AI AIR Special";
  else if (lower.includes("diamond natural white zubadan")) series = "Diamond Natural White Zubadan";
  else if (lower.includes("diamond pearl white zubadan")) series = "Diamond Pearl White Zubadan";
  else if (lower.includes("diamond black zubadan")) series = "Diamond Black Zubadan";
  else if (lower.includes("diamond ruby red zubadan")) series = "Diamond Ruby Red Zubadan";
  else if (lower.includes("diamond onyx black")) series = "Diamond Onyx Black";
  else if (lower.includes("diamond ruby red")) series = "Diamond Ruby Red";
  else if (lower.includes("diamond pearl")) series = "Diamond Pearl White";
  else if (lower.includes("diamond natural")) series = "Diamond Natural White";
  else if (lower.includes("vloermodel")) series = "Vloermodel";
  else if (lower.includes("diamond")) series = "Diamond";
  else if (lower.includes("premium onyx") || lower.includes("onyx black")) series = "Premium Onyx Black";
  else if (lower.includes("premium silver") || lower.includes("silver")) series = "Premium Silver";
  else if (lower.includes("premium natural") || lower.includes("natural white")) series = "Premium Natural White";
  else if (lower.includes("compact")) series = "Compact";
  else if (lower.includes("msz-hr") || lower.includes("msz hr")) series = "MSZ-HR";

  // Type: single split of multi split onderdeel
  const isBuitenunit = lower.includes("buitenunit");
  const isBinnendeel = lower.includes("binnendeel") || lower.includes("binnenunit");
  const isMultiSplit = isBuitenunit || isBinnendeel;
  const isSingleSplit = !isMultiSplit;

  return { brand, kw, series, isBuitenunit, isBinnendeel, isMultiSplit, isSingleSplit };
}

function kwLabel(kw: number) {
  return `${kw.toString().replace(".", ",")} kW`;
}

// Winst per binnendeel op basis van aantal
function winstPerDeel(aantalBinnendelen: number): number {
  if (aantalBinnendelen >= 4) return 850;
  if (aantalBinnendelen === 3) return 900;
  if (aantalBinnendelen === 2) return 950;
  return 1100; // 1 binnendeel = single split logica
}

function seriesStyle(series: string) {
  switch (series) {
    case "Artcool Black Mirror": return { bg: "bg-slate-900", text: "text-white" };
    case "Deluxe": return { bg: "bg-blue-700", text: "text-white" };
    case "AI AIR Special": return { bg: "bg-orange-500", text: "text-white" };
    case "MSZ-HR": return { bg: "bg-red-700", text: "text-white" };
    case "Compact": return { bg: "bg-red-500", text: "text-white" };
    case "Premium Natural White": return { bg: "bg-stone-100", text: "text-stone-900" };
    case "Premium Silver": return { bg: "bg-slate-400", text: "text-white" };
    case "Premium Onyx Black": return { bg: "bg-zinc-900", text: "text-white" };
    case "Diamond Natural White": return { bg: "bg-sky-600", text: "text-white" };
    case "Diamond Pearl White": return { bg: "bg-sky-800", text: "text-white" };
    case "Diamond Onyx Black": return { bg: "bg-neutral-900", text: "text-white" };
    case "Diamond Ruby Red": return { bg: "bg-red-700", text: "text-white" };
    case "Diamond Natural White Zubadan": return { bg: "bg-teal-600", text: "text-white" };
    case "Diamond Pearl White Zubadan": return { bg: "bg-teal-800", text: "text-white" };
    case "Diamond Black Zubadan": return { bg: "bg-stone-800", text: "text-white" };
    case "Diamond Ruby Red Zubadan": return { bg: "bg-rose-700", text: "text-white" };
    case "Vloermodel": return { bg: "bg-amber-700", text: "text-white" };
    default: return { bg: "bg-slate-100", text: "text-slate-900" };
  }
}

export function ProductPicker({ products, onSelect, onSelectMultiSplit, onClose }: ProductPickerProps) {
  // Single split state
  const [mode, setMode] = useState<"keuze" | "single" | "multi">("keuze");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedKw, setSelectedKw] = useState<number | null>(null);

  // Multi split state
  const [multiBrand, setMultiBrand] = useState<string | null>(null);
  const [multiStep, setMultiStep] = useState<"brand" | "buiten" | "binnen">("brand");
  const [selectedBuiten, setSelectedBuiten] = useState<Product | null>(null);
  const [selectedBinnendelen, setSelectedBinnendelen] = useState<Product[]>([]);

  const activeProducts = products.filter((p) => p.is_active);
  const singleProducts = activeProducts.filter((p) => parseProduct(p).isSingleSplit);
  const buitenProducts = activeProducts.filter((p) => parseProduct(p).isBuitenunit);
  const binnenProducts = activeProducts.filter((p) => parseProduct(p).isBinnendeel);

  // Single split: merken
  const singleBrands = useMemo(() => {
    const set = new Set(singleProducts.map((p) => parseProduct(p).brand));
    return Array.from(set).sort();
  }, [singleProducts]);

  // Single split: kW opties voor geselecteerd merk
  const kwOptions = useMemo(() => {
    if (!selectedBrand) return [];
    const set = new Set(
      singleProducts.filter((p) => parseProduct(p).brand === selectedBrand).map((p) => parseProduct(p).kw)
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [singleProducts, selectedBrand]);

  // Single split: modellen
  const singleModels = useMemo(() => {
    if (!selectedBrand || selectedKw === null) return [];
    return singleProducts.filter((p) => {
      const parsed = parseProduct(p);
      return parsed.brand === selectedBrand && parsed.kw === selectedKw;
    });
  }, [singleProducts, selectedBrand, selectedKw]);

  // Multi split: merken (op basisvan buitenunits)
  const multiBrands = useMemo(() => {
    const set = new Set(buitenProducts.map((p) => parseProduct(p).brand));
    return Array.from(set).sort();
  }, [buitenProducts]);

  // Multi split: buitenunits voor geselecteerd merk
  const buitenVoorMerk = useMemo(() => {
    if (!multiBrand) return [];
    return buitenProducts.filter((p) => parseProduct(p).brand === multiBrand);
  }, [buitenProducts, multiBrand]);

  // Multi split: binnendelen voor geselecteerd merk
  const binnenVoorMerk = useMemo(() => {
    if (!multiBrand) return [];
    return binnenProducts.filter((p) => parseProduct(p).brand === multiBrand);
  }, [binnenProducts, multiBrand]);

  // Multi split prijs berekening
  const multiPrijs = useMemo(() => {
    if (!selectedBuiten || selectedBinnendelen.length === 0) return null;
    const aantalBinnen = selectedBinnendelen.length;
    const inkoopTotaal =
      (selectedBuiten.purchase_price ?? 0) +
      selectedBinnendelen.reduce((sum, p) => sum + (p.purchase_price ?? 0), 0);
    const winst = winstPerDeel(aantalBinnen) * aantalBinnen;
    const verkoopprijs = inkoopTotaal + winst;
    return { inkoopTotaal, winst, verkoopprijs, aantalBinnen };
  }, [selectedBuiten, selectedBinnendelen]);

  function addBinnendeel(product: Product) {
    if (selectedBinnendelen.length < 4) {
      setSelectedBinnendelen((prev) => [...prev, product]);
    }
  }

  function removeBinnendeel(index: number) {
    setSelectedBinnendelen((prev) => prev.filter((_, i) => i !== index));
  }

  function handleMultiSplitToevoegen() {
    if (!selectedBuiten || selectedBinnendelen.length === 0 || !multiPrijs) return;
    const binnenNamen = selectedBinnendelen.map((p) => p.name).join(" + ");
    const description = `Multi-split systeem: ${selectedBuiten.name} + ${binnenNamen}`;
    onSelectMultiSplit({
      description,
      unit_price: multiPrijs.verkoopprijs,
      purchase_price: multiPrijs.inkoopTotaal,
    });
    onClose();
  }

  function goBack() {
    if (mode === "single") {
      if (selectedKw !== null) { setSelectedKw(null); return; }
      if (selectedBrand !== null) { setSelectedBrand(null); return; }
      setMode("keuze");
    } else if (mode === "multi") {
      if (multiStep === "binnen") { setMultiStep("buiten"); setSelectedBuiten(null); setSelectedBinnendelen([]); return; }
      if (multiStep === "buiten") { setMultiStep("brand"); setMultiBrand(null); return; }
      setMode("keuze");
    }
  }

  const singleStep = selectedBrand === null ? 1 : selectedKw === null ? 2 : 3;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            {mode !== "keuze" && (
              <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {mode === "keuze" && "Kies type systeem"}
                {mode === "single" && (
                  singleStep === 1 ? "Single Split — Kies merk" :
                  singleStep === 2 ? `${selectedBrand} — Kies vermogen` :
                  `${selectedBrand} · ${kwLabel(selectedKw!)} — Kies model`
                )}
                {mode === "multi" && (
                  multiStep === "brand" ? "Multi Split — Kies merk" :
                  multiStep === "buiten" ? `${multiBrand} — Kies buitenunit` :
                  `${multiBrand} — Stel systeem samen`
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                {mode === "single" && (
                  <>
                    <span className={singleStep === 1 ? "font-semibold text-slate-700" : "text-slate-400"}>Merk</span>
                    <span className="text-slate-300">›</span>
                    <span className={singleStep === 2 ? "font-semibold text-slate-700" : singleStep > 2 ? "text-slate-400" : "text-slate-300"}>Vermogen</span>
                    <span className="text-slate-300">›</span>
                    <span className={singleStep === 3 ? "font-semibold text-slate-700" : "text-slate-300"}>Model</span>
                  </>
                )}
                {mode === "multi" && (
                  <>
                    <span className={multiStep === "brand" ? "font-semibold text-slate-700" : "text-slate-400"}>Merk</span>
                    <span className="text-slate-300">›</span>
                    <span className={multiStep === "buiten" ? "font-semibold text-slate-700" : multiStep === "binnen" ? "text-slate-400" : "text-slate-300"}>Buitenunit</span>
                    <span className="text-slate-300">›</span>
                    <span className={multiStep === "binnen" ? "font-semibold text-slate-700" : "text-slate-300"}>Binnendelen</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Keuze: Single of Multi */}
          {mode === "keuze" && (
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setMode("single")}
                className="group flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Zap className="w-8 h-8 text-slate-600 group-hover:text-primary" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xl">Single Split</p>
                  <p className="text-sm text-slate-400 mt-1">1 buiten- en 1 binnenunit</p>
                </div>
              </button>
              <button
                onClick={() => setMode("multi")}
                className="group flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <div className="relative">
                    <Zap className="w-6 h-6 text-slate-600 group-hover:text-primary absolute -top-1 -left-3" />
                    <Zap className="w-6 h-6 text-slate-600 group-hover:text-primary absolute -top-1 left-1" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xl">Multi Split</p>
                  <p className="text-sm text-slate-400 mt-1">1 buitenunit, meerdere binnendelen</p>
                </div>
              </button>
            </div>
          )}

          {/* Single Split: Stap 1 Merk */}
          {mode === "single" && singleStep === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {singleBrands.map((brand) => {
                const count = singleProducts.filter((p) => parseProduct(p).brand === brand).length;
                return (
                  <button key={brand} onClick={() => setSelectedBrand(brand)}
                    className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center">
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

          {/* Single Split: Stap 2 kW */}
          {mode === "single" && singleStep === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {kwOptions.map((kw) => {
                const count = singleProducts.filter((p) => {
                  const parsed = parseProduct(p);
                  return parsed.brand === selectedBrand && parsed.kw === kw;
                }).length;
                return (
                  <button key={kw} onClick={() => setSelectedKw(kw)}
                    className="group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center">
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

          {/* Single Split: Stap 3 Model */}
          {mode === "single" && singleStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {singleModels.map((product) => {
                const { series } = parseProduct(product);
                const style = seriesStyle(series);
                return (
                  <button key={product.id} onClick={() => { onSelect(product); onClose(); }}
                    className="group text-left rounded-2xl border-2 border-slate-200 hover:border-primary overflow-hidden transition-all shadow-sm hover:shadow-md">
                    <div className={`${style.bg} ${style.text} px-4 py-3 flex items-center justify-between`}>
                      <span className="text-sm font-bold tracking-wide">{series}</span>
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{product.name}</p>
                      {product.description && <p className="text-xs text-slate-500 mt-1">{product.description}</p>}
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

          {/* Multi Split: Stap 1 Merk */}
          {mode === "multi" && multiStep === "brand" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {multiBrands.map((brand) => {
                const count = buitenProducts.filter((p) => parseProduct(p).brand === brand).length;
                return (
                  <button key={brand} onClick={() => { setMultiBrand(brand); setMultiStep("buiten"); }}
                    className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-2xl font-black text-slate-700 group-hover:text-primary transition-colors">
                      {brand[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{brand}</p>
                      <p className="text-xs text-slate-400">{count} buitenunit{count !== 1 ? "s" : ""}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi Split: Stap 2 Buitenunit */}
          {mode === "multi" && multiStep === "buiten" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buitenVoorMerk.map((product) => (
                <button key={product.id} onClick={() => { setSelectedBuiten(product); setMultiStep("binnen"); }}
                  className="group text-left rounded-2xl border-2 border-slate-200 hover:border-primary overflow-hidden transition-all shadow-sm hover:shadow-md">
                  <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-bold">Buitenunit</span>
                    <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 bg-white">
                    <p className="font-semibold text-slate-900 text-sm leading-snug">{product.name}</p>
                    {product.description && <p className="text-xs text-slate-500 mt-1">{product.description}</p>}
                    <div className="mt-3">
                      <p className="text-xs text-slate-400">Inkoopprijs</p>
                      <p className="text-lg font-black text-slate-900">{formatCurrency(product.purchase_price ?? 0)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Multi Split: Stap 3 Binnendelen samenstellen */}
          {mode === "multi" && multiStep === "binnen" && (
            <div className="space-y-6">
              {/* Geselecteerde binnendelen */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Geselecteerde binnendelen ({selectedBinnendelen.length}/4)
                </p>
                {selectedBinnendelen.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">
                    Voeg hieronder binnendelen toe
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedBinnendelen.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
                        <span className="text-sm font-medium text-slate-800">{p.name}</span>
                        <button onClick={() => removeBinnendeel(i)} className="text-slate-400 hover:text-red-500 ml-3">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Beschikbare binnendelen */}
              {selectedBinnendelen.length < 4 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Voeg binnendeel toe</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {binnenVoorMerk.map((product) => {
                      const { series } = parseProduct(product);
                      const style = seriesStyle(series);
                      return (
                        <button key={product.id} onClick={() => addBinnendeel(product)}
                          className="group text-left rounded-xl border-2 border-slate-200 hover:border-primary overflow-hidden transition-all">
                          <div className={`${style.bg} ${style.text} px-3 py-2 flex items-center justify-between`}>
                            <span className="text-xs font-bold">{series}</span>
                            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-3 bg-white">
                            <p className="font-medium text-slate-900 text-xs leading-snug">{product.name}</p>
                            <p className="text-xs text-slate-400 mt-1">Inkoop: {formatCurrency(product.purchase_price ?? 0)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prijsoverzicht */}
              {multiPrijs && (
                <div className="bg-slate-50 rounded-xl border p-4 space-y-2 text-sm">
                  <p className="font-semibold text-slate-700 mb-3">Prijsoverzicht</p>
                  <div className="flex justify-between text-slate-600">
                    <span>Buitenunit: {selectedBuiten?.name}</span>
                    <span>{formatCurrency(selectedBuiten?.purchase_price ?? 0)}</span>
                  </div>
                  {selectedBinnendelen.map((p, i) => (
                    <div key={i} className="flex justify-between text-slate-600">
                      <span>Binnendeel {i + 1}: {p.name}</span>
                      <span>{formatCurrency(p.purchase_price ?? 0)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-slate-600">
                    <span>Totaal inkoop</span>
                    <span>{formatCurrency(multiPrijs.inkoopTotaal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Winst ({multiPrijs.aantalBinnen}× €{winstPerDeel(multiPrijs.aantalBinnen)})</span>
                    <span>+ {formatCurrency(multiPrijs.winst)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-slate-900 text-base">
                    <span>Verkoopprijs excl. BTW</span>
                    <span>{formatCurrency(multiPrijs.verkoopprijs)}</span>
                  </div>
                </div>
              )}

              {/* Toevoegen knop */}
              <Button
                onClick={handleMultiSplitToevoegen}
                disabled={!selectedBuiten || selectedBinnendelen.length === 0}
                className="w-full"
                size="lg"
              >
                <Check className="w-4 h-4" />
                Multi-split toevoegen aan offerte
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
