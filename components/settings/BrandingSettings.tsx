"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Branding } from "@/lib/utils/branding";

interface BrandingSettingsProps {
  initial: Branding;
}

export function BrandingSettings({ initial }: BrandingSettingsProps) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  async function save() {
    setSaving(true);
    const entries = [
      { key: "brand_primary_color", value: values.primaryColor },
      { key: "brand_logo_url", value: values.logoUrl || "" },
      { key: "brand_company_name", value: values.companyName },
    ];

    for (const entry of entries) {
      await supabase.from("app_settings").upsert(entry, { onConflict: "key" });
    }

    setSaving(false);
    toast({ title: "Huisstijl opgeslagen", description: "Herlaad de pagina om het te zien." });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Huisstijl</h3>
        <p className="text-sm text-slate-500 mt-0.5">Logo, bedrijfsnaam en primaire kleur van de sidebar</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bedrijfsnaam</label>
          <input
            type="text"
            value={values.companyName}
            onChange={(e) => setValues({ ...values, companyName: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Jouw bedrijfsnaam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
          <input
            type="url"
            value={values.logoUrl || ""}
            onChange={(e) => setValues({ ...values, logoUrl: e.target.value || null })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="https://jouwsite.nl/logo.png"
          />
          {values.logoUrl && (
            <div className="mt-2 p-3 bg-slate-100 rounded-lg inline-block">
              <img src={values.logoUrl} alt="Logo preview" className="h-10 w-auto object-contain" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Primaire kleur</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={values.primaryColor}
              onChange={(e) => setValues({ ...values, primaryColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer border border-slate-300"
            />
            <input
              type="text"
              value={values.primaryColor}
              onChange={(e) => setValues({ ...values, primaryColor: e.target.value })}
              className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="#1e3a5f"
            />
            <div
              className="flex-1 h-10 rounded-lg border border-slate-200"
              style={{ backgroundColor: values.primaryColor }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? "Opslaan..." : "Opslaan"}
      </button>
    </div>
  );
}
