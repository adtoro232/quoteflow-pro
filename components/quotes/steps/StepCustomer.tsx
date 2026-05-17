"use client";

import { useState } from "react";
import { useQuoteBuilder } from "@/hooks/use-quote-builder";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, User, Plus, X, Loader2 } from "lucide-react";
import type { Customer } from "@/types";

export function StepCustomer({ customers }: { customers: Customer[] }) {
  const { customer_id, setCustomer } = useQuoteBuilder();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ company_name: "", email: "", phone: "", address: "", postal_code: "", city: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = customers.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreateQuick() {
    if (!newForm.company_name) return;
    setCreating(true);
    setCreateError(null);
    try {
      // Get current user so created_by is set — required by SELECT RLS policy
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCreateError("Niet ingelogd. Ververs de pagina en probeer opnieuw.");
        return;
      }
      const { data, error } = await supabase
        .from("customers")
        .insert({ ...newForm, created_by: user.id })
        .select()
        .single();
      console.log("[StepCustomer] insert result", { data, error });
      if (error || !data) {
        setCreateError(error?.message ?? "Klant aanmaken mislukt (onbekende fout)");
        return;
      }
      setCustomer(data.id);
      setShowNew(false);
    } catch (err) {
      console.error("[StepCustomer] unexpected error:", err);
      setCreateError(String(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Selecteer klant</h2>
        <p className="text-sm text-slate-500">Kies een bestaande klant of maak snel een nieuwe aan</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek op naam..."
          className="pl-9"
        />
      </div>

      {/* Customer list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.length === 0 && !showNew ? (
          <p className="text-sm text-slate-400 text-center py-6">Geen klanten gevonden</p>
        ) : (
          filtered.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setCustomer(customer_id === customer.id ? "" : customer.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                customer_id === customer.id
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-white hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{customer.company_name}</p>
                  <p className="text-sm text-slate-500">{customer.city ?? ""}</p>
                </div>
                {customer_id === customer.id && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Quick create */}
      {!showNew ? (
        <Button variant="outline" onClick={() => setShowNew(true)} className="w-full">
          <Plus className="w-4 h-4" />
          Snel nieuwe klant aanmaken
        </Button>
      ) : (
        <div className="bg-slate-50 rounded-xl border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">Nieuwe klant</h3>
            <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Naam *</Label>
              <Input
                value={newForm.company_name}
                onChange={(e) => setNewForm((p) => ({ ...p, company_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={newForm.email}
                onChange={(e) => setNewForm((p) => ({ ...p, email: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Telefoon</Label>
              <Input
                value={newForm.phone}
                onChange={(e) => setNewForm((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label>Adres</Label>
              <Input
                value={newForm.address}
                onChange={(e) => setNewForm((p) => ({ ...p, address: e.target.value }))}
                className="mt-1"
                placeholder="Straat en huisnummer"
              />
            </div>
            <div>
              <Label>Postcode</Label>
              <Input
                value={newForm.postal_code}
                onChange={(e) => setNewForm((p) => ({ ...p, postal_code: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Plaats</Label>
              <Input
                value={newForm.city}
                onChange={(e) => setNewForm((p) => ({ ...p, city: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          {createError && (
            <p className="text-sm text-red-600 rounded bg-red-50 border border-red-200 px-3 py-2">
              Fout: {createError}
            </p>
          )}
          <Button
            onClick={handleCreateQuick}
            disabled={!newForm.company_name || creating}
            size="sm"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Aanmaken &amp; selecteren
          </Button>
        </div>
      )}
    </div>
  );
}
