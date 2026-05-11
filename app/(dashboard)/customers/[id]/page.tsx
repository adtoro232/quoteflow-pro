import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";
import type { Customer, Quote } from "@/types";
import { DeleteCustomerButton } from "@/components/customers/DeleteCustomerButton";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) notFound();

  const { data: quotes = [] } = await supabase
    .from("quotes")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  const safeQuotes = (quotes ?? []) as Quote[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <DeleteCustomerButton customerId={id} companyName={(customer as Customer).company_name} />
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl">
        <div className="flex items-center gap-3">
          <Link href="/customers" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="text-lg font-semibold text-slate-900">{(customer as Customer).company_name}</h2>
        </div>

        {/* Edit form */}
        <CustomerForm customer={customer as Customer} userId={profile.id} />

        {/* Quote history */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Offertehistorie</h3>
            <Button asChild size="sm" variant="outline">
              <Link href={`/quotes/new?customer=${id}`}>
                <FileText className="w-4 h-4" />
                Nieuwe offerte
              </Link>
            </Button>
          </div>
          {safeQuotes.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">Geen offertes voor deze klant</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Nummer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Datum</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500">Bedrag</th>
                </tr>
              </thead>
              <tbody>
                {safeQuotes.map((q) => (
                  <tr key={q.id} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-3">
                      <Link href={`/quotes/${q.quote_number}`} className="font-medium text-blue-700 hover:underline">
                        {q.quote_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(q.quote_date)}</td>
                    <td className="px-4 py-3"><QuoteStatusBadge status={q.status} /></td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(q.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
