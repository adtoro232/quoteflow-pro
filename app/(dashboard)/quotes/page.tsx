import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";
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
            Nieuwe offerte
          </Link>
        </Button>
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6">
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
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
              <p className="text-sm text-slate-500">{safeQuotes.length} offerte{safeQuotes.length !== 1 ? "s" : ""}</p>
            </div>
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
                      <Link href={`/quotes/${quote.quote_number}`} className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
