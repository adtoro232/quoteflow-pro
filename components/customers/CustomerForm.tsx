"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import type { Customer } from "@/types";

interface CustomerFormProps {
  customer?: Customer;
  userId: string;
}

export function CustomerForm({ customer, userId }: CustomerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: customer?.company_name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    postal_code: customer?.postal_code ?? "",
    city: customer?.city ?? "",
    country: customer?.country ?? "Nederland",
    notes: customer?.notes ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    console.log("[CustomerForm] submit", { userId, form });

    try {
      const payload = { ...form, created_by: userId };

      let error;
      if (customer) {
        console.log("[CustomerForm] update", customer.id);
        const res = await supabase.from("customers").update(form).eq("id", customer.id);
        error = res.error;
      } else {
        console.log("[CustomerForm] insert", payload);
        const res = await supabase.from("customers").insert(payload);
        error = res.error;
      }

      console.log("[CustomerForm] supabase result error:", error);

      if (error) {
        console.error("[CustomerForm] error:", error.message);
        setFormError(error.message);
        return;
      }

      toast({
        title: customer ? "Klant bijgewerkt" : "Klant aangemaakt",
        description: `${form.company_name} is succesvol ${customer ? "bijgewerkt" : "aangemaakt"}.`,
      });
      router.push("/customers");
      router.refresh();
    } catch (err) {
      console.error("[CustomerForm] unexpected error:", err);
      setFormError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Persoonsgegevens */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Persoonsgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="company_name">Naam *</Label>
            <Input
              id="company_name"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Contactgegevens */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Contactgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Adresgegevens */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Adresgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Postcode</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">Plaats</Label>
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="country">Land</Label>
            <Input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Notities */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Notities</h2>
        <Textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Interne notities over deze klant..."
        />
      </div>

      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Fout bij opslaan:</strong> {formError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuleren
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Opslaan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {customer ? "Bijwerken" : "Klant aanmaken"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
