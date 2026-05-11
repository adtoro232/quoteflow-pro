"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy, Send, Trash2, Loader2, Settings2, Mail } from "lucide-react";
import type { Quote, QuoteStatus } from "@/types";

const statusOptions: { value: QuoteStatus; label: string }[] = [
  { value: "concept", label: "Concept" },
  { value: "verzonden", label: "Verzonden" },
  { value: "geopend", label: "Geopend" },
  { value: "bekeken", label: "Bekeken" },
  { value: "geaccepteerd", label: "Geaccepteerd" },
  { value: "afgewezen", label: "Afgewezen" },
  { value: "verlopen", label: "Verlopen" },
];

interface QuoteActionsProps {
  quote: Quote;
  userId: string;
  isAdmin: boolean;
}

export function QuoteActions({ quote, userId, isAdmin }: QuoteActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<QuoteStatus>(quote.status);

  async function handleMarkSent() {
    setLoading("sent");
    await supabase.from("quotes").update({ status: "verzonden" }).eq("id", quote.id);
    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: userId,
      action: "sent",
      description: "Offerte gemarkeerd als verzonden",
    });
    toast({ title: "Status bijgewerkt", description: "Offerte is gemarkeerd als verzonden" });
    setLoading(null);
    router.refresh();
  }

  async function handleSendEmail() {
    setLoading("email");
    try {
      const res = await fetch("/api/email/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "E-mail mislukt", description: data.error ?? "Onbekende fout", variant: "destructive" });
      } else {
        // Also mark as verzonden if it was still concept
        if (quote.status === "concept") {
          await supabase.from("quotes").update({ status: "verzonden" }).eq("id", quote.id);
        }
        toast({ title: "E-mail verstuurd", description: `Offerte ${quote.quote_number} is verstuurd naar de klant.` });
        router.refresh();
      }
    } catch {
      toast({ title: "E-mail mislukt", description: "Onverwachte fout", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  }

  async function handleStatusChange() {
    setLoading("status");
    await supabase.from("quotes").update({ status: newStatus }).eq("id", quote.id);
    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: userId,
      action: "updated",
      description: `Status gewijzigd naar: ${newStatus}`,
    });
    toast({ title: "Status bijgewerkt" });
    setStatusOpen(false);
    setLoading(null);
    router.refresh();
  }

  async function handleDuplicate() {
    setLoading("dup");
    // Get items
    const { data: items } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quote.id);

    // Create new quote
    const { data: newQuote, error } = await supabase
      .from("quotes")
      .insert({
        customer_id: quote.customer_id,
        user_id: userId,
        template_id: quote.template_id,
        status: "concept",
        subtotal: quote.subtotal,
        discount_amount: quote.discount_amount,
        vat_amount: quote.vat_amount,
        total: quote.total,
        internal_notes: quote.internal_notes,
        customer_message: quote.customer_message,
      })
      .select()
      .single();

    if (error || !newQuote) {
      toast({ title: "Fout bij dupliceren", variant: "destructive" });
      setLoading(null);
      return;
    }

    // Copy items
    if (items && items.length > 0) {
      await supabase.from("quote_items").insert(
        items.map(({ id: _, quote_id: __, ...item }) => ({
          ...item,
          quote_id: newQuote.id,
        }))
      );
    }

    await supabase.from("quote_activity").insert({
      quote_id: newQuote.id,
      user_id: userId,
      action: "duplicated",
      description: `Gedupliceerd van ${quote.quote_number}`,
    });

    toast({ title: "Offerte gedupliceerd", description: `${newQuote.quote_number} aangemaakt` });
    setLoading(null);
    router.push(`/quotes/${newQuote.quote_number}`);
  }

  async function handleDelete() {
    setLoading("del");
    await supabase.from("quotes").delete().eq("id", quote.id);
    toast({ title: "Offerte verwijderd" });
    setDeleteOpen(false);
    setLoading(null);
    router.push("/quotes");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {/* PDF download */}
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <a href={`/api/pdf/${quote.id}`} target="_blank" rel="noopener noreferrer">
          <Download className="w-4 h-4" />
          PDF
        </a>
      </Button>

      {/* Duplicate */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDuplicate}
        disabled={loading === "dup"}
      >
        {loading === "dup" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
        Dupliceren
      </Button>

      {/* Send email */}
      {!["geaccepteerd", "afgewezen", "verlopen"].includes(quote.status) && (
        <Button
          size="sm"
          onClick={handleSendEmail}
          disabled={loading === "email"}
        >
          {loading === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Stuur e-mail
        </Button>
      )}

      {/* Mark as sent (manual, no email) */}
      {quote.status === "concept" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkSent}
          disabled={loading === "sent"}
        >
          {loading === "sent" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Markeer verzonden
        </Button>
      )}

      {/* Status change (admin only) */}
      {isAdmin && (
        <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4" />
              Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Status aanpassen</DialogTitle>
            </DialogHeader>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as QuoteStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>Annuleren</Button>
              <Button onClick={handleStatusChange} disabled={loading === "status"}>
                {loading === "status" && <Loader2 className="w-4 h-4 animate-spin" />}
                Opslaan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offerte verwijderen</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u <strong>{quote.quote_number}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Annuleren</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading === "del"}>
              {loading === "del" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
