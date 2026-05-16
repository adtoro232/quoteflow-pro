import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { QuoteDeleteButton } from "@/components/quotes/QuoteDeleteButton";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Quote } from "@/types";

export default async function QuotesPage() {
  const supabase = await createClient();
  const profile = await getProfile();

  let query = supabase
    .from("quotes")
    .select("*, customer:customers(company_name, contact_name), user:profiles(full_name)")
    .order("created_at", { ascending: false });

  if (profile?.role !== "admin") {
    query = query.eq("user_id", profile!.id);
  }

  const { data: quotes = [] } = await query;
  const safeQuotes = (quotes ?? []) as Quote[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <Button asChild size="sm">
          <Link href="/quotes/new">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nieuwe offerte</span>
            <span className="sm:hidden">Nieuw</span>
          </Link>
        </Button>
      </Topbar>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {safeQuotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nog geen offertes</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/quotes/new"><Plus className="w-4 h-4" />Eerste offerte maken</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-slate-50/50 flex items-center justify-between">
              <p className="text-sm text-slate-500">{safeQuotes.length} offerte{safeQuotes.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Desktop tabel */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Nummer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Klant</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Datum</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Vervalt</th>
                    {profile?.role === "admin" && (
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Medewerker</th>
                    )}
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Bedrag</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {safeQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/quotes/${quote.quote_number}`} className="font-medium text-blue-700 hover:underline">
                          {quote.quote_number}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">
                          {(quote.customer as { company_name?: string } | undefined)?.company_name ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(quote.customer as { contact_name?: string } | undefined)?.contact_name ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <QuoteStatusBadge status={quote.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(quote.quote_date)}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {quote.expiry_date ? formatDate(quote.expiry_date) : "—"}
                      </td>
                      {profile?.role === "admin" && (
                        <td className="px-4 py-4 text-slate-600">
                          {(quote.user as { full_name?: string } | undefined)?.full_name ?? "—"}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right font-medium">{formatCurrency(quote.total)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <QuoteDeleteButton quoteId={quote.id} quoteNumber={quote.quote_number} />
                          <Link href={`/quotes/${quote.quote_number}`} className="p-1.5 text-slate-400 hover:text-slate-600">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobiele kaartweergave */}
            <div className="sm:hidden divide-y">
              {safeQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center px-4 py-3.5 gap-2">
                  <Link
                    href={`/quotes/${quote.quote_number}`}
                    className="flex items-center justify-between flex-1 min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-700 text-sm">{quote.quote_number}</span>
                        <QuoteStatusBadge status={quote.status} />
                      </div>
                      <p className="text-sm text-slate-700 truncate">
                        {(quote.customer as { company_name?: string } | undefined)?.company_name ?? "—"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(quote.quote_date)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span className="font-semibold text-slate-800 text-sm">{formatCurrency(quote.total)}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </Link>
                  <QuoteDeleteButton quoteId={quote.id} quoteNumber={quote.quote_number} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
