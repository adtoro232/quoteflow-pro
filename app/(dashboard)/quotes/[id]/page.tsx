import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import { ActivityTimeline } from "@/components/quotes/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft, Download, Copy, Eye, Send, Trash2, User,
  CalendarDays, FileText, StickyNote, ExternalLink,
} from "lucide-react";
import type { Quote, QuoteItem, QuoteActivity, QuoteComment } from "@/types";
import { QuoteActions } from "@/components/quotes/QuoteActions";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quoteNumber } = await params;
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, customer:customers(*), user:profiles(*), template:quote_templates(name)")
    .eq("quote_number", quoteNumber)
    .single();

  if (!quote) notFound();

  const [{ data: items = [] }, { data: activities = [] }, { data: comments = [] }] = await Promise.all([
    supabase.from("quote_items").select("*, product:products(id, name, image_url)").eq("quote_id", quote.id).order("sort_order"),
    supabase.from("quote_activity").select("*, user:profiles(full_name)").eq("quote_id", quote.id).order("created_at", { ascending: false }),
    supabase.from("quote_comments").select("*").eq("quote_id", quote.id).order("created_at", { ascending: false }),
  ]);

  const q = quote as Quote;
  const safeItems = (items ?? []) as QuoteItem[];
  const safeActivities = (activities ?? []) as QuoteActivity[];
  const safeComments = (comments ?? []) as QuoteComment[];
  const customer = q.customer as ReturnType<typeof Object.assign>;
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${q.public_token}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <QuoteActions quote={q} userId={profile.id} isAdmin={profile.role === "admin"} />
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/quotes" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{q.quote_number}</h2>
              <QuoteStatusBadge status={q.status} />
            </div>
            {q.expiry_date && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                Geldig tot {formatDate(q.expiry_date)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Customer */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                <User className="w-3.5 h-3.5" />
                KLANTGEGEVENS
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{customer?.company_name ?? "—"}</p>
                  {customer?.email && <p className="text-blue-600 mt-1">{customer.email}</p>}
                  {customer?.phone && <p className="text-slate-500">{customer.phone}</p>}
                </div>
                <div className="text-slate-500">
                  {customer?.address && <p>{customer.address}</p>}
                  {customer?.postal_code && customer?.city && (
                    <p>{customer.postal_code} {customer.city}</p>
                  )}
                  {customer?.vat_number && <p className="mt-1 text-xs">BTW: {customer.vat_number}</p>}
                  {customer?.kvk_number && <p className="text-xs">KvK: {customer.kvk_number}</p>}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b bg-slate-50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">Offerteregels</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">Omschrijving</th>
                    <th className="text-center px-3 py-2 text-xs font-medium text-slate-500">Qty</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-slate-500">Prijs</th>
                    <th className="text-center px-3 py-2 text-xs font-medium text-slate-500">Korting</th>
                    <th className="text-center px-3 py-2 text-xs font-medium text-slate-500">BTW</th>
                    <th className="text-right px-5 py-2 text-xs font-medium text-slate-500">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {safeItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-5 py-3 font-medium text-slate-800">{item.description}</td>
                      <td className="px-3 py-3 text-center text-slate-600">{item.quantity} {item.unit}</td>
                      <td className="px-3 py-3 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                      <td className="px-3 py-3 text-center text-slate-600">
                        {item.discount_percentage > 0 ? `${item.discount_percentage}%` : "—"}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600">{item.vat_percentage}%</td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-slate-50/50">
                    <td colSpan={5} className="px-5 py-2 text-right text-sm text-slate-600">Subtotaal</td>
                    <td className="px-5 py-2 text-right font-medium">{formatCurrency(q.subtotal)}</td>
                  </tr>
                  {q.discount_amount > 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-2 text-right text-sm text-slate-600">Korting</td>
                      <td className="px-5 py-2 text-right font-medium text-red-600">-{formatCurrency(q.discount_amount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={5} className="px-5 py-2 text-right text-sm text-slate-600">BTW</td>
                    <td className="px-5 py-2 text-right font-medium">{formatCurrency(q.vat_amount)}</td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={5} className="px-5 py-3 text-right font-bold text-slate-900">Totaal incl. BTW</td>
                    <td className="px-5 py-3 text-right font-bold text-xl text-blue-800">{formatCurrency(q.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Internal notes */}
            {q.internal_notes && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 text-amber-700 text-xs mb-2">
                  <StickyNote className="w-3.5 h-3.5" />
                  INTERNE NOTITIES
                </div>
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{q.internal_notes}</p>
              </div>
            )}

            {/* Comments */}
            {safeComments.length > 0 && (
              <div className="bg-white rounded-xl border shadow-sm p-5">
                <h3 className="font-medium text-slate-900 mb-4">Opmerkingen van klant</h3>
                <div className="space-y-3">
                  {safeComments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-900">{comment.author_name}</p>
                        <p className="text-xs text-slate-400">{formatDate(comment.created_at)}</p>
                      </div>
                      <p className="text-sm text-slate-600">{comment.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quote meta */}
            <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3 text-sm">
              <h3 className="font-medium text-slate-900">Offerte info</h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Datum</span>
                  <span className="font-medium text-slate-800">{formatDate(q.quote_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geldig tot</span>
                  <span className="font-medium text-slate-800">{q.expiry_date ? formatDate(q.expiry_date) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Template</span>
                  <span className="font-medium text-slate-800">{(q.template as { name?: string } | undefined)?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aangemaakt door</span>
                  <span className="font-medium text-slate-800">{(q.user as { full_name?: string } | undefined)?.full_name ?? "—"}</span>
                </div>
              </div>
            </div>

            {/* Public link */}
            {q.status !== "concept" && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                <p className="text-xs font-medium text-blue-700 mb-2">KLANTLINK</p>
                <p className="text-xs text-blue-600 break-all mb-3 font-mono">{publicUrl}</p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Bekijken als klant
                  </a>
                </Button>
              </div>
            )}

            {/* Activity */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h3 className="font-medium text-slate-900 mb-4">Activiteit</h3>
              <ActivityTimeline activities={safeActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
