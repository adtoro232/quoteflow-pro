"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Globe, X, Check } from "lucide-react";
import type { Company, Profile } from "@/types";

interface CompanyManagementProps {
  companies: Company[];
  users: Profile[];
}

const EMPTY_FORM = {
  name: "",
  website_url: "",
  primary_color: "#1e3a5f",
  logo_url: "",
};

export function CompanyManagement({ companies: initial, users }: CompanyManagementProps) {
  const [companies, setCompanies] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [fetchingLogo, setFetchingLogo] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(company: Company) {
    setEditing(company);
    setForm({
      name: company.name,
      website_url: company.website_url || "",
      primary_color: company.primary_color,
      logo_url: company.logo_url || "",
    });
    setShowForm(true);
  }

  async function fetchLogoFromUrl() {
    if (!form.website_url) return;
    setFetchingLogo(true);
    try {
      const url = new URL(form.website_url);
      const faviconUrl = `${url.protocol}//${url.hostname}/favicon.ico`;
      setForm((f) => ({ ...f, logo_url: faviconUrl }));
      toast({ title: "Favicon opgehaald", description: "Controleer de preview en pas aan indien nodig." });
    } catch {
      toast({ title: "Ongeldige URL", description: "Voer een geldige website URL in." });
    } finally {
      setFetchingLogo(false);
    }
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      website_url: form.website_url || null,
      primary_color: form.primary_color,
      logo_url: form.logo_url || null,
    };

    if (editing) {
      const { data, error } = await supabase
        .from("companies")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (error) {
        toast({ title: "Fout", description: error.message });
      } else {
        setCompanies((c) => c.map((co) => (co.id === editing.id ? data : co)));
        toast({ title: "Bedrijf bijgewerkt" });
        setShowForm(false);
      }
    } else {
      const { data, error } = await supabase
        .from("companies")
        .insert(payload)
        .select()
        .single();
      if (error) {
        toast({ title: "Fout", description: error.message });
      } else {
        setCompanies((c) => [...c, data]);
        toast({ title: "Bedrijf toegevoegd" });
        setShowForm(false);
      }
    }
    setSaving(false);
  }

  async function remove(company: Company) {
    if (!confirm(`Verwijder "${company.name}"? Gebruikers worden losgekoppeld.`)) return;
    const { error } = await supabase.from("companies").delete().eq("id", company.id);
    if (error) {
      toast({ title: "Fout", description: error.message });
    } else {
      setCompanies((c) => c.filter((co) => co.id !== company.id));
      toast({ title: "Bedrijf verwijderd" });
    }
  }

  async function assignUser(userId: string, companyId: string | null) {
    await supabase.from("profiles").update({ company_id: companyId }).eq("id", userId);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Bedrijven</h3>
          <p className="text-sm text-slate-500 mt-0.5">Beheer bedrijven en hun huisstijl</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Bedrijf toevoegen
        </button>
      </div>

      {/* Company list */}
      <div className="space-y-3">
        {companies.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">Nog geen bedrijven toegevoegd</p>
        )}
        {companies.map((company) => {
          const companyUsers = users.filter((u) => u.company_id === company.id);
          return (
            <div key={company.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: company.primary_color }}
                >
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{company.name}</p>
                  {company.website_url && (
                    <a
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-primary flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      {company.website_url}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(company)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(company)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* User assignment */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Gebruikers ({companyUsers.length})
                </p>
                <div className="space-y-1">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={user.company_id === company.id}
                        onChange={(e) =>
                          assignUser(user.id, e.target.checked ? company.id : null)
                        }
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs text-slate-700 group-hover:text-slate-900">
                        {user.full_name}
                        <span className="text-slate-400 ml-1">
                          ({user.role === "admin" ? "Admin" : "Medewerker"})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                {editing ? "Bedrijf bewerken" : "Nieuw bedrijf"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Naam van het bedrijf"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="https://www.bedrijf.nl"
                  />
                  <button
                    onClick={fetchLogoFromUrl}
                    disabled={fetchingLogo || !form.website_url}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    {fetchingLogo ? "..." : "Haal logo op"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="https://bedrijf.nl/logo.png"
                />
                {form.logo_url && (
                  <div className="mt-2 p-2 bg-slate-100 rounded-lg inline-block">
                    <img src={form.logo_url} alt="Preview" className="h-8 w-auto object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primaire kleur</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={form.primary_color}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <div
                    className="flex-1 h-10 rounded-lg border border-slate-200"
                    style={{ backgroundColor: form.primary_color }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name.trim()}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {saving ? "Opslaan..." : <><Check className="w-4 h-4" /> Opslaan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
