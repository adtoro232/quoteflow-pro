"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, FileDown, Clock } from "lucide-react";
import type { QuoteTemplate } from "@/types";

interface TemplateFormProps {
  template?: QuoteTemplate;
}

export function TemplateForm({ template }: TemplateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [gdocUrl, setGdocUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const [form, setForm] = useState({
    name: template?.name ?? "",
    description: template?.description ?? "",
    html_content: template?.html_content ?? "",
    is_default: template?.is_default ?? false,
    is_active: template?.is_active ?? true,
    auto_expiry: template?.auto_expiry ?? true,
    validity_days: template?.validity_days ?? 30,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? parseInt(value) || 1
        : value,
    }));
  }

  async function handleImportGdoc() {
    if (!gdocUrl.trim()) return;
    setImporting(true);
    try {
      const res = await fetch("/api/import-gdoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: gdocUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Import mislukt", description: data.error, variant: "destructive" });
        return;
      }
      setForm((prev) => ({ ...prev, html_content: data.html }));
      setGdocUrl("");
      setPreview(false);
      toast({ title: "Google Doc geïmporteerd", description: "De inhoud is ingeladen in de editor. Controleer en sla op." });
    } catch {
      toast({ title: "Import mislukt", description: "Kan de server niet bereiken.", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let error;
    if (template) {
      const res = await supabase.from("quote_templates").update(form).eq("id", template.id);
      error = res.error;
    } else {
      const res = await supabase.from("quote_templates").insert(form);
      error = res.error;
    }

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: template ? "Template bijgewerkt" : "Template aangemaakt" });
    router.push("/templates");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Google Doc import */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900">Importeren vanuit Google Docs</h2>
          <p className="text-sm text-slate-500 mt-1">
            Plak de link van een Google Doc. Het document moet gedeeld zijn op{" "}
            <span className="font-medium text-slate-700">"Iedereen met de link kan bekijken"</span>.
          </p>
        </div>

        {/* Instructie stappen */}
        <ol className="text-sm text-slate-600 space-y-1.5 pl-4 list-decimal">
          <li>Open je Google Doc</li>
          <li>Klik rechtsboven op <strong>Delen</strong> → stel in op <strong>Iedereen met de link</strong></li>
          <li>Kopieer de URL uit de adresbalk en plak hem hieronder</li>
        </ol>

        <div className="flex gap-2">
          <Input
            type="url"
            value={gdocUrl}
            onChange={(e) => setGdocUrl(e.target.value)}
            placeholder="https://docs.google.com/document/d/..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleImportGdoc}
            disabled={importing || !gdocUrl.trim()}
          >
            {importing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Importeren...</>
            ) : (
              <><FileDown className="w-4 h-4" />Importeren</>
            )}
          </Button>
        </div>
      </div>

      {/* Template details */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Template details</h2>
        <div>
          <Label htmlFor="name">Naam *</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">Omschrijving</Label>
          <Input id="description" name="description" value={form.description} onChange={handleChange} className="mt-1" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm font-medium text-slate-700">Standaard template</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm font-medium text-slate-700">Actief</span>
          </label>
        </div>

        {/* Geldigheid */}
        <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Geldigheid offerte</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="auto_expiry" checked={form.auto_expiry} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm text-slate-700">Automatisch vervaldatum instellen</span>
          </label>
          {form.auto_expiry && (
            <div className="flex items-center gap-3 pl-6">
              <span className="text-sm text-slate-600">Geldig voor</span>
              <Input
                type="number"
                name="validity_days"
                value={form.validity_days}
                onChange={handleChange}
                min={1}
                max={365}
                className="w-20 text-center"
              />
              <span className="text-sm text-slate-600">dagen na aanmaakdatum</span>
            </div>
          )}
          {!form.auto_expiry && (
            <p className="text-xs text-slate-400 pl-6">Geen vervaldatum — medewerker kan dit handmatig instellen bij de offerte.</p>
          )}
        </div>
      </div>

      {/* HTML editor + preview */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">HTML inhoud</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setPreview(!preview)}>
            <Eye className="w-4 h-4" />
            {preview ? "Bewerken" : "Preview"}
          </Button>
        </div>
        <div className="p-6">
          {preview ? (
            <div className="border rounded-xl overflow-hidden bg-slate-100 p-4">
              <div
                className={form.html_content.includes("gdoc-import") ? undefined : "quote-template"}
                dangerouslySetInnerHTML={{ __html: form.html_content }}
              />
            </div>
          ) : (
            <Textarea
              id="html_content"
              name="html_content"
              value={form.html_content}
              onChange={handleChange}
              rows={24}
              required
              className="font-mono text-xs"
              placeholder="Voer hier uw HTML template in met placeholders zoals {{customer_name}}, {{quote_items}}, etc. Of importeer via Google Docs hierboven."
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuleren</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</> : <><Save className="w-4 h-4" />{template ? "Bijwerken" : "Template aanmaken"}</>}
        </Button>
      </div>
    </form>
  );
}
