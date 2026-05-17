"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuoteBuilder } from "@/hooks/use-quote-builder";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { StepCustomer } from "./steps/StepCustomer";
import { StepTemplate } from "./steps/StepTemplate";
import { StepItems } from "./steps/StepItems";
import { StepReview } from "./steps/StepReview";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Loader2, Save, Send } from "lucide-react";
import type { Customer, QuoteTemplate, Product } from "@/types";

const steps = [
  { number: 1, title: "Klant" },
  { number: 2, title: "Template" },
  { number: 3, title: "Producten" },
  { number: 4, title: "Review" },
];

interface QuoteBuilderProps {
  customers: Customer[];
  templates: QuoteTemplate[];
  products: Product[];
  userId: string;
  defaultCustomerId?: string;
}

export function QuoteBuilder({
  customers,
  templates,
  products,
  userId,
  defaultCustomerId,
}: QuoteBuilderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    step, setStep, customer_id, template_id, items, discount_amount,
    internal_notes, customer_message, expiry_date, totals, reset,
  } = useQuoteBuilder();

  // Pre-select customer from URL param
  useEffect(() => {
    if (defaultCustomerId) {
      useQuoteBuilder.getState().setCustomer(defaultCustomerId);
    }
    return () => reset();
  }, []);

  async function saveQuote(status: "concept" | "verzonden") {
    if (!customer_id) {
      toast({ title: "Selecteer eerst een klant", variant: "destructive" });
      setStep(1);
      return;
    }
    if (items.length === 0) {
      toast({ title: "Voeg minimaal één product toe", variant: "destructive" });
      setStep(3);
      return;
    }

    setSaving(true);

    try {
      // Create quote via server API (service role bypasses RLS)
      const res = await fetch("/api/quotes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: {
            customer_id,
            template_id: template_id || null,
            status,
            quote_date: new Date().toISOString().split("T")[0],
            expiry_date: expiry_date || null,
            subtotal: totals.subtotal,
            discount_amount: totals.discount_amount,
            vat_amount: totals.vat_amount,
            total: totals.total,
            internal_notes: internal_notes || null,
            customer_message: customer_message || null,
          },
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.quote) {
        toast({ title: "Fout bij aanmaken offerte", description: data.error ?? "Onbekende fout", variant: "destructive" });
        return;
      }

      const quote = data.quote;

      // 4. Send email to customer if verzonden
      if (status === "verzonden") {
        const emailRes = await fetch("/api/email/send-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteId: quote.id }),
        });
        const emailData = emailRes.headers.get("content-type")?.includes("application/json")
          ? await emailRes.json()
          : { error: "Onbekende serverfout bij verzenden e-mail." };
        if (!emailRes.ok) {
          toast({
            title: "Offerte opgeslagen, e-mail mislukt",
            description: emailData.error ?? "Controleer het e-mailadres van de klant en uw Resend instellingen.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Offerte verzonden",
            description: `${quote.quote_number} is opgeslagen en de e-mail is verstuurd.`,
          });
        }
      } else {
        toast({
          title: "Concept opgeslagen",
          description: `${quote.quote_number} is opgeslagen als concept.`,
        });
      }

      reset();
      router.push(`/quotes/${quote.quote_number}`);
      router.refresh();
    } catch (err) {
      console.error("[QuoteBuilder] unexpected error:", err);
      toast({ title: "Onverwachte fout", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const canProceed = () => {
    if (step === 1) return !!customer_id;
    if (step === 2) return true; // template is optional
    if (step === 3) return items.length > 0;
    return true;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <button
                onClick={() => s.number < step && setStep(s.number)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  step === s.number
                    ? "bg-primary text-primary-foreground"
                    : s.number < step
                    ? "text-primary hover:bg-primary/10 cursor-pointer"
                    : "text-muted-foreground cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  step === s.number ? "bg-white/20" : s.number < step ? "bg-primary text-white" : "bg-muted"
                )}>
                  {s.number}
                </span>
                {s.title}
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}

          {/* Live totaal */}
          <div className="ml-auto bg-slate-50 rounded-lg px-4 py-2 text-right">
            <p className="text-xs text-slate-500">Totaal incl. BTW</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totals.total)}</p>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && <StepCustomer customers={customers} />}
        {step === 2 && <StepTemplate templates={templates} />}
        {step === 3 && <StepItems products={products} />}
        {step === 4 && <StepReview customers={customers} templates={templates} />}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Annuleren" : "Vorige"}
        </Button>

        <div className="flex gap-3">
          {step === 4 ? (
            <>
              <Button
                variant="outline"
                onClick={() => saveQuote("concept")}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Opslaan als concept
              </Button>
              <Button
                onClick={() => saveQuote("verzonden")}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Opslaan &amp; verzenden
              </Button>
            </>
          ) : (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Volgende
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
