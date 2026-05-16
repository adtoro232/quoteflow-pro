"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { renderTemplate } from "@/lib/utils/renderTemplate";
import {
  CheckCircle2, XCircle, Download, Building2, CalendarDays,
  FileText, User, Loader2, MessageSquare,
} from "lucide-react";
import type { Quote, QuoteItem } from "@/types";

interface CustomerQuoteViewProps {
  quote: Quote;
  items: QuoteItem[];
  token: string;
}

export function CustomerQuoteView({ quote, items, token }: CustomerQuoteViewProps) {
  const supabase = createClient();
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [commentForm, setCommentForm] = useState({ name: "", email: "", body: "" });
  const [done, setDone] = useState<"accepted" | "rejected" | null>(null);

  const customer = quote.customer as ReturnType<typeof Object.assign>;
  const user = quote.user as ReturnType<typeof Object.assign>;
  const isFinalized = ["geaccepteerd", "afgewezen", "verlopen"].includes(quote.status);

  // Mark as 'bekeken' after 5 seconds
  useEffect(() => {
    if (quote.status === "geopend") {
      const timer = setTimeout(async () => {
        await supabase.from("quotes").update({ status: "bekeken" }).eq("id", quote.id);
        await supabase.from("quote_activity").insert({
          quote_id: quote.id,
          user_id: null,
          action: "viewed",
          description: "Offerte volledig bekeken door klant",
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function handleAccept() {
    setLoading("accept");
    await supabase.from("quotes").update({ status: "geaccepteerd" }).eq("id", quote.id);
    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: null,
      action: "accepted",
      description: "Offerte geaccepteerd door klant",
    });
    setLoading(null);
    setAcceptOpen(false);
    setDone("accepted");
  }

  async function handleReject() {
    setLoading("reject");
    await supabase.from("quotes").update({ status: "afgewezen" }).eq("id", quote.id);
    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: null,
      action: "rejected",
      description: rejectReason ? `Reden: ${rejectReason}` : "Offerte afgewezen door klant",
    });
    if (rejectReason) {
      await supabase.from("quote_comments").insert({
        quote_id: quote.id,
        author_name: customer?.contact_name ?? "Klant",
        body: `Reden voor afwijzing: ${rejectReason}`,
      });
    }
    setLoading(null);
    setRejectOpen(false);
    setDone("rejected");
  }

  async function handleComment() {
    if (!commentForm.name || !commentForm.body) return;
    setLoading("comment");
    await supabase.from("quote_comments").insert({
      quote_id: quote.id,
      author_name: commentForm.name,
      author_email: commentForm.email || null,
      body: commentForm.body,
    });
    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: null,
      action: "commented",
      description: `Opmerking van ${commentForm.name}`,
    });
    setLoading(null);
    setCommentOpen(false);
    setCommentForm({ name: "", email: "", body: "" });
  }

  // Success screens
  if (done === "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Offerte geaccepteerd</h1>
          <p className="text-slate-600 mb-6">
            Bedankt! Uw akkoord voor offerte <strong>{quote.quote_number}</strong> is ontvangen.
            Wij nemen zo spoedig mogelijk contact met u op.
          </p>
          <Button asChild variant="outline">
            <a href={`/api/pdf/${quote.id}?token=${token}`}>
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (done === "rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Offerte afgewezen</h1>
          <p className="text-slate-600">
            Wij hebben uw reactie ontvangen. Mocht u vragen hebben, neem dan gerust contact met ons op.
          </p>
        </div>
      </div>
    );
  }

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Ons Bedrijf";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">{companyName}</p>
              <p className="text-xs text-slate-500">Offerte {quote.quote_number}</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <a href={`/api/pdf/${quote.id}?token=${token}`}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Status banner */}
        {quote.status === "geaccepteerd" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-emerald-800 font-medium">Deze offerte is geaccepteerd</p>
          </div>
        )}
        {quote.status === "afgewezen" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-800 font-medium">Deze offerte is afgewezen</p>
          </div>
        )}
        {quote.status === "verlopen" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-orange-800 font-medium">Deze offerte is verlopen</p>
          </div>
        )}

        {/* Quote body — template or fallback hardcoded layout */}
        {quote.template?.html_content ? (
          <div className="overflow-x-auto -mx-1 px-1">
            <div
              className={quote.template.html_content.includes("gdoc-import") ? "shadow-sm" : "quote-template shadow-sm"}
              dangerouslySetInnerHTML={{
                __html: renderTemplate(quote.template.html_content, { quote, items }),
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-8 text-white">
              <p className="text-blue-200 text-sm mb-1">Offerte</p>
              <h1 className="text-3xl font-bold mb-1">{quote.quote_number}</h1>
              <div className="flex items-center gap-4 mt-4 text-blue-100 text-sm">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  Datum: {formatDateLong(quote.quote_date)}
                </span>
                {quote.expiry_date && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    Geldig tot: {formatDateLong(quote.expiry_date)}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-8">
              {/* Customer + sender grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    Aan
                  </div>
                  <p className="font-bold text-slate-900 text-lg">{customer?.company_name ?? "—"}</p>
                  {customer?.address && <p className="text-slate-500 text-sm mt-1">{customer.address}</p>}
                  {customer?.postal_code && customer?.city && (
                    <p className="text-slate-500 text-sm">{customer.postal_code} {customer.city}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <User className="w-3.5 h-3.5" />
                    Van
                  </div>
                  <p className="font-bold text-slate-900">{companyName}</p>
                  <p className="text-slate-600 text-sm">{user?.full_name ?? ""}</p>
                </div>
              </div>

              {/* Customer message */}
              {quote.customer_message && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-8">
                  <p className="text-slate-700 whitespace-pre-wrap">{quote.customer_message}</p>
                </div>
              )}

              {/* Items table */}
              <div className="overflow-x-auto rounded-xl border -mx-1 sm:mx-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Omschrijving</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aantal</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prijs</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Korting</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">BTW</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Totaal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="px-5 py-4 font-medium text-slate-800">{item.description}</td>
                        <td className="px-4 py-4 text-right text-slate-600">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-4 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          {item.discount_percentage > 0 ? `${item.discount_percentage}%` : "—"}
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">{item.vat_percentage}%</td>
                        <td className="px-5 py-4 text-right font-semibold">{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-6">
                <div className="w-full sm:w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotaal excl. BTW</span>
                    <span>{formatCurrency(quote.subtotal)}</span>
                  </div>
                  {quote.discount_amount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Korting</span>
                      <span>-{formatCurrency(quote.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>BTW</span>
                    <span>{formatCurrency(quote.vat_amount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-slate-900 border-t pt-3 mt-2">
                    <span>Totaal</span>
                    <span className="text-blue-900">{formatCurrency(quote.total)}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-8 pt-6 border-t text-xs text-slate-400">
                <p>Betaling binnen 30 dagen na factuurdatum. Prijzen zijn exclusief BTW tenzij anders vermeld.</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {!isFinalized && (
          <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Uw reactie</h2>
            <p className="text-slate-500 text-sm mb-6">
              Bekijk de offerte en geef uw akkoord of wijs deze af. U kunt ook een opmerking achterlaten.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Accept */}
              <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    Offerte accepteren
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Offerte accepteren</DialogTitle>
                    <DialogDescription>
                      U staat op het punt om offerte <strong>{quote.quote_number}</strong> te accepteren
                      voor een bedrag van <strong>{formatCurrency(quote.total)}</strong>.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAcceptOpen(false)}>Annuleren</Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleAccept}
                      disabled={loading === "accept"}
                    >
                      {loading === "accept" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Accepteren
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Reject */}
              <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 h-12 text-base border-red-200 text-red-700 hover:bg-red-50">
                    <XCircle className="w-5 h-5" />
                    Offerte afwijzen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Offerte afwijzen</DialogTitle>
                    <DialogDescription>Wilt u een reden opgeven voor het afwijzen?</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Optionele reden..."
                    rows={3}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRejectOpen(false)}>Annuleren</Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={loading === "reject"}
                    >
                      {loading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Afwijzen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Comment */}
              <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <MessageSquare className="w-4 h-4" />
                    Opmerking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Opmerking achterlaten</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Uw naam *</Label>
                      <Input
                        value={commentForm.name}
                        onChange={(e) => setCommentForm((p) => ({ ...p, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm((p) => ({ ...p, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Opmerking *</Label>
                      <Textarea
                        value={commentForm.body}
                        onChange={(e) => setCommentForm((p) => ({ ...p, body: e.target.value }))}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCommentOpen(false)}>Annuleren</Button>
                    <Button
                      onClick={handleComment}
                      disabled={!commentForm.name || !commentForm.body || loading === "comment"}
                    >
                      {loading === "comment" ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      Versturen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-8 py-6">
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {companyName} · Offerte {quote.quote_number}
        </p>
      </div>
    </div>
  );
}
