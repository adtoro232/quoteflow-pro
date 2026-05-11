"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Mail, Info } from "lucide-react";

interface EmailSettingsProps {
  settings: Record<string, string>;
}

export function EmailSettings({ settings }: EmailSettingsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email_from:    settings.email_from    ?? "",
    email_subject: settings.email_subject ?? "",
    email_intro:   settings.email_intro   ?? "",
    email_closing: settings.email_closing ?? "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const entries = Object.entries(form).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase
        .from("app_settings")
        .upsert(entries, { onConflict: "key" });
      if (error) throw error;
      toast({ title: "Instellingen opgeslagen" });
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? String(err);
      toast({ title: "Opslaan mislukt", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Afzender */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 border-b pb-4">
          <Mail className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-900">Afzender</h3>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email_from">Afzender e-mailadres</Label>
          <Input
            id="email_from"
            type="email"
            value={form.email_from}
            onChange={(e) => update("email_from", e.target.value)}
            placeholder="info@jouwbedrijf.nl"
          />
          <p className="text-xs text-slate-400">
            Dit adres moet geverifieerd zijn in Resend (resend.com → Domains). Voor testen gebruik <code className="bg-slate-100 px-1 rounded">onboarding@resend.dev</code>.
          </p>
        </div>
      </div>

      {/* E-mail inhoud */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 border-b pb-4">
          <Mail className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-900">E-mail inhoud</h3>
        </div>

        {/* Placeholders uitleg */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700 space-y-0.5">
            <p className="font-semibold mb-1">Beschikbare variabelen:</p>
            <p><code className="bg-blue-100 px-1 rounded">{"{{quote_number}}"}</code> — offertenummer (bijv. OFF-2026-0001)</p>
            <p><code className="bg-blue-100 px-1 rounded">{"{{company_name}}"}</code> — naam van uw bedrijf</p>
            <p><code className="bg-blue-100 px-1 rounded">{"{{customer_name}}"}</code> — naam van de klant</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email_subject">Onderwerp</Label>
          <Input
            id="email_subject"
            value={form.email_subject}
            onChange={(e) => update("email_subject", e.target.value)}
            placeholder="Offerte {{quote_number}} van {{company_name}}"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email_intro">Openingstekst</Label>
          <Textarea
            id="email_intro"
            value={form.email_intro}
            onChange={(e) => update("email_intro", e.target.value)}
            rows={4}
            placeholder="Geachte {{customer_name}}, hierbij ontvangt u onze offerte..."
          />
          <p className="text-xs text-slate-400">Verschijnt bovenaan de e-mail, direct na de aanhef.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email_closing">Slottekst</Label>
          <Textarea
            id="email_closing"
            value={form.email_closing}
            onChange={(e) => update("email_closing", e.target.value)}
            rows={2}
            placeholder="Heeft u vragen? Neem gerust contact met ons op."
          />
          <p className="text-xs text-slate-400">Verschijnt onderaan de e-mail, boven de bedrijfsgegevens.</p>
        </div>
      </div>

      {/* Preview hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Let op:</strong> het afzender e-mailadres (<code className="bg-amber-100 px-1 rounded">RESEND_FROM_EMAIL</code> in .env.local) wordt overschreven door het adres dat u hier invult.
        Zorg dat dit domein geverifieerd is in Resend.
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Instellingen opslaan
      </Button>
    </div>
  );
}
