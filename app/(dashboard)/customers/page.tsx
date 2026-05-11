import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, User, Mail, Phone, ChevronRight } from "lucide-react";
import type { Customer } from "@/types";

export default async function CustomersPage() {
  const supabase = await createClient();
  const profile = await getProfile();

  let query = supabase
    .from("customers")
    .select("*")
    .order("company_name", { ascending: true });

  if (profile?.role !== "admin") {
    query = query.eq("created_by", profile!.id);
  }

  const { data: customers = [] } = await query;
  const safeCustomers = (customers ?? []) as Customer[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <Button asChild size="sm">
          <Link href="/customers/new">
            <Plus className="w-4 h-4" />
            Nieuwe klant
          </Link>
        </Button>
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6">
        {safeCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <User className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nog geen klanten</p>
            <p className="text-slate-400 text-sm mb-4">Voeg uw eerste klant toe om te beginnen</p>
            <Button asChild size="sm">
              <Link href="/customers/new">
                <Plus className="w-4 h-4" />
                Nieuwe klant
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50/50">
              <p className="text-sm text-slate-500">{safeCustomers.length} klant{safeCustomers.length !== 1 ? "en" : ""}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Naam</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">E-mail</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Telefoon</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Plaats</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {safeCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/customers/${customer.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                        {customer.company_name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      {customer.email ? (
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {customer.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{customer.city ?? "—"}</td>
                    <td className="px-4 py-4">
                      <Link href={`/customers/${customer.id}`} className="text-slate-400 hover:text-slate-600">
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
