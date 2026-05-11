"use client";

import { useQuoteBuilder } from "@/hooks/use-quote-builder";
import { cn } from "@/lib/utils";
import { FileStack, Star } from "lucide-react";
import type { QuoteTemplate } from "@/types";

export function StepTemplate({ templates }: { templates: QuoteTemplate[] }) {
  const { template_id, setTemplate, setExpiryDate } = useQuoteBuilder();

  const activeTemplates = templates.filter((t) => t.is_active);

  function selectTemplate(tpl: QuoteTemplate) {
    setTemplate(tpl.id);
    if (tpl.auto_expiry && tpl.validity_days > 0) {
      const d = new Date();
      d.setDate(d.getDate() + tpl.validity_days);
      setExpiryDate(d.toISOString().split("T")[0]);
    } else {
      setExpiryDate("");
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Kies een template</h2>
        <p className="text-sm text-slate-500">Selecteer een opmaaktemplate voor de offerte (optioneel)</p>
      </div>

      {/* No template option */}
      <button
        onClick={() => { setTemplate(""); setExpiryDate(""); }}
        className={cn(
          "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3",
          template_id === ""
            ? "border-primary bg-primary/5"
            : "border-transparent bg-white hover:border-slate-200"
        )}
      >
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
          <span className="text-slate-400 text-xs font-bold">—</span>
        </div>
        <div>
          <p className="font-medium text-slate-700">Geen template</p>
          <p className="text-sm text-slate-400">Standaard opmaak gebruiken</p>
        </div>
        {template_id === "" && (
          <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => selectTemplate(tpl)}
            className={cn(
              "text-left p-5 rounded-xl border-2 transition-all",
              template_id === tpl.id
                ? "border-primary bg-primary/5"
                : "border-transparent bg-white hover:border-slate-200"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileStack className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center gap-1">
                {tpl.is_default && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                {template_id === tpl.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <p className="font-medium text-slate-900">{tpl.name}</p>
            {tpl.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
            )}
            {tpl.auto_expiry && (
              <p className="text-xs text-blue-600 mt-2 font-medium">Geldig {tpl.validity_days} dagen</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
