import { createClient, getProfile } from "@/lib/supabase/server";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";
import { redirect } from "next/navigation";
import type { Customer, QuoteTemplate, Product } from "@/types";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  const [
    { data: customers = [] },
    { data: templates = [] },
    { data: products = [] },
  ] = await Promise.all([
    isAdmin
      ? supabase.from("customers").select("*").order("company_name")
      : supabase.from("customers").select("*").eq("created_by", profile.id).order("company_name"),
    supabase.from("quote_templates").select("*").eq("is_active", true).order("name"),
    supabase.from("products").select("*, category:product_categories(name)").eq("is_active", true).order("name"),
  ]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <QuoteBuilder
        customers={(customers ?? []) as Customer[]}
        templates={(templates ?? []) as QuoteTemplate[]}
        products={(products ?? []) as Product[]}
        userId={profile.id}
        defaultCustomerId={params.customer}
      />
    </div>
  );
}
