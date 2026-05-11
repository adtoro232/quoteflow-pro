import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileStack, Star, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { QuoteTemplate } from "@/types";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: templates = [] } = await supabase
    .from("quote_templates")
    .select("*")
    .order("created_at", { ascending: false });

  const safeTemplates = (templates ?? []) as QuoteTemplate[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <Button asChild size="sm">
          <Link href="/templates/new">
            <Plus className="w-4 h-4" />
            Nieuwe template
          </Link>
        </Button>
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6">
        {safeTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileStack className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nog geen templates</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/templates/new"><Plus className="w-4 h-4" />Nieuwe template</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeTemplates.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/templates/${tpl.id}/edit`}
                className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileStack className="w-4 h-4 text-blue-600" />
                    </div>
                    {tpl.is_default && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <Badge variant={tpl.is_active ? "success" : "secondary"}>
                    {tpl.is_active ? "Actief" : "Inactief"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {tpl.name}
                </h3>
                {tpl.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-3">
                  Aangemaakt {formatDate(tpl.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Placeholder reference */}
        <div className="mt-8 bg-slate-50 rounded-xl border p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Beschikbare placeholders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "{{customer_name}}", "{{company_name}}", "{{quote_number}}", "{{quote_date}}",
              "{{expiry_date}}", "{{quote_items}}", "{{subtotal}}", "{{discount}}",
              "{{vat_amount}}", "{{total}}", "{{terms}}", "{{user_name}}",
              "{{company_logo}}", "{{company_details}}",
            ].map((ph) => (
              <code key={ph} className="text-xs bg-white border rounded px-2 py-1 text-blue-700 font-mono">
                {ph}
              </code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
