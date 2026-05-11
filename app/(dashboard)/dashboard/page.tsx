import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  CalendarDays,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quote } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getProfile();

  const isAdmin = profile?.role === "admin";

  // Base query — admin sees all, employee sees own
  let quotesQuery = supabase
    .from("quotes")
    .select("*, customer:customers(company_name, contact_name)");

  if (!isAdmin) {
    quotesQuery = quotesQuery.eq("user_id", profile!.id);
  }

  const { data: quotes = [] } = await quotesQuery;
  const safeQuotes = (quotes ?? []) as Quote[];

  // KPI calculations
  const activeStatuses = ["verzonden", "geopend", "bekeken", "geaccepteerd", "afgewezen"];
  const totalValue = safeQuotes
    .filter((q) => !["verlopen"].includes(q.status))
    .reduce((sum, q) => sum + q.total, 0);

  const acceptedValue = safeQuotes
    .filter((q) => q.status === "geaccepteerd")
    .reduce((sum, q) => sum + q.total, 0);

  const openCount = safeQuotes.filter((q) =>
    ["verzonden", "geopend", "bekeken"].includes(q.status)
  ).length;

  const acceptedCount = safeQuotes.filter((q) => q.status === "geaccepteerd").length;
  const rejectedCount = safeQuotes.filter((q) => q.status === "afgewezen").length;
  const conversionRate =
    acceptedCount + rejectedCount > 0
      ? Math.round((acceptedCount / (acceptedCount + rejectedCount)) * 100)
      : 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthCount = safeQuotes.filter(
    (q) => new Date(q.created_at) >= startOfMonth
  ).length;

  const recentAccepted = safeQuotes
    .filter((q) => q.status === "geaccepteerd")
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const recentQuotes = safeQuotes
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const kpis = [
    {
      title: "Totale offertewaarde",
      value: formatCurrency(totalValue),
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Geaccepteerde waarde",
      value: formatCurrency(acceptedValue),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Openstaande offertes",
      value: openCount.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Conversiepercentage",
      value: `${conversionRate}%`,
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Offertes deze maand",
      value: monthCount.toString(),
      icon: CalendarDays,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
  ];

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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Goedemiddag, {profile?.full_name.split(" ")[0]}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Hier is een overzicht van uw offertes
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent quotes */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recente offertes</CardTitle>
                <Link href="/quotes" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Alle offertes <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Nummer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Klant</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500">Bedrag</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                        Nog geen offertes. <Link href="/quotes/new" className="text-blue-600 hover:underline">Maak uw eerste offerte</Link>
                      </td>
                    </tr>
                  ) : (
                    recentQuotes.map((q) => (
                      <tr key={q.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <Link href={`/quotes/${q.quote_number}`} className="font-medium text-blue-700 hover:underline">
                            {q.quote_number}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {(q.customer as { company_name?: string } | undefined)?.company_name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <QuoteStatusBadge status={q.status} />
                        </td>
                        <td className="px-6 py-3 text-right font-medium">
                          {formatCurrency(q.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recently accepted */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent geaccepteerd</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAccepted.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Nog geen geaccepteerde offertes</p>
              ) : (
                recentAccepted.map((q) => (
                  <Link
                    key={q.id}
                    href={`/quotes/${q.quote_number}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{q.quote_number}</p>
                      <p className="text-xs text-slate-500">
                        {(q.customer as { company_name?: string } | undefined)?.company_name ?? "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-700">{formatCurrency(q.total)}</p>
                      <p className="text-xs text-slate-400">{formatDate(q.updated_at)}</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
