"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Company } from "@/types";

interface CompanyProfileFormProps {
  company: Company;
}

export function CompanyProfileForm({ company }: CompanyProfileFormProps) {
  const [values, setValues] = useState({
    name: company.name ?? "",
    website_url: company.website_url ?? "",
    email: company.email ?? "",
    phone: company.phone ?? "",
    address: company.address ?? "",
    postal_code: company.postal_code ?? "",
    city: company.city ?? "",
    kvk_number: company.kvk_number ?? "",
    vat_number: company.vat_number ?? "",
    iban: company.iban ?? "",
    primary_color: company.primary_color ?? "#1e3a5f",
    logo_url: company.logo_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  function set(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("companies")
      .update({
        name: values.name,
        website_url: values.website_url || null,
        email: values.email || null,
        phone: values.phone || null,
        address: values.address || null,
        postal_code: values.postal_code || null,
        city: values.city || null,
        kvk_number: values.kvk_number || null,
        vat_number: values.vat_number || null,
        iban: values.iban || null,
        primary_color: values.primary_color,
        logo_url: values.logo_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id);

    setSaving(false);

    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bedrijfsprofiel opgeslagen", description: "De gegevens zijn bijgewerkt." });
    }
  }

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const sectionHeadingClass = "text-sm font-semibold text-slate-700 mb-3";
  const cardClass = "bg-white rounded-xl border border-slate-200 p-6 space-y-4";

  return (
    <div className="space-y-6">
      {/* Bedrijfsgegevens */}
      <div className={cardClass}>
        <h3 className={sectionHeadingClass}>Bedrijfsgegevens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bedrijfsnaam</label>
            <input
              type="text"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
              placeholder="Jouw bedrijfsnaam"
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              type="url"
              value={values.website_url}
              onChange={(e) => set("website_url", e.target.value)}
              className={inputClass}
              placeholder="https://jouwsite.nl"
            />
          </div>
          <div>
            <label className={labelClass}>E-mailadres</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass}
              placeholder="info@jouwbedrijf.nl"
            />
          </div>
          <div>
            <label className={labelClass}>Telefoonnummer</label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputClass}
              placeholder="+31 6 12345678"
            />
          </div>
        </div>
      </div>

      {/* Adres */}
      <div className={cardClass}>
        <h3 className={sectionHeadingClass}>Adres</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Straat en huisnummer</label>
            <input
              type="text"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputClass}
              placeholder="Voorbeeldstraat 12"
            />
          </div>
          <div>
            <label className={labelClass}>Postcode</label>
            <input
              type="text"
              value={values.postal_code}
              onChange={(e) => set("postal_code", e.target.value)}
              className={inputClass}
              placeholder="1234 AB"
            />
          </div>
          <div>
            <label className={labelClass}>Plaats</label>
            <input
              type="text"
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              className={inputClass}
              placeholder="Amsterdam"
            />
          </div>
        </div>
      </div>

      {/* Financieel */}
      <div className={cardClass}>
        <h3 className={sectionHeadingClass}>Financieel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>KVK-nummer</label>
            <input
              type="text"
              value={values.kvk_number}
              onChange={(e) => set("kvk_number", e.target.value)}
              className={inputClass}
              placeholder="12345678"
            />
          </div>
          <div>
            <label className={labelClass}>BTW-nummer</label>
            <input
              type="text"
              value={values.vat_number}
              onChange={(e) => set("vat_number", e.target.value)}
              className={inputClass}
              placeholder="NL123456789B01"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>IBAN</label>
            <input
              type="text"
              value={values.iban}
              onChange={(e) => set("iban", e.target.value)}
              className={inputClass}
              placeholder="NL00 BANK 0000 0000 00"
            />
          </div>
        </div>
      </div>

      {/* Huisstijl */}
      <div className={cardClass}>
        <h3 className={sectionHeadingClass}>Huisstijl</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Primaire kleur</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.primary_color}
                onChange={(e) => set("primary_color", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-slate-300"
              />
              <input
                type="text"
                value={values.primary_color}
                onChange={(e) => set("primary_color", e.target.value)}
                className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="#1e3a5f"
              />
              <div
                className="flex-1 h-10 rounded-lg border border-slate-200"
                style={{ backgroundColor: values.primary_color }}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Logo URL</label>
            <input
              type="url"
              value={values.logo_url}
              onChange={(e) => set("logo_url", e.target.value)}
              className={inputClass}
              placeholder="https://jouwsite.nl/logo.png"
            />
            {values.logo_url && (
              <div className="mt-2 p-3 bg-slate-100 rounded-lg inline-block">
                <img src={values.logo_url} alt="Logo preview" className="h-10 w-auto object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </div>
    </div>
  );
}
