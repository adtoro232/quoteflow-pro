import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomerQuoteView } from "@/components/quotes/CustomerQuoteView";
import type { Quote, QuoteItem } from "@/types";

export default async function CustomerQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { token } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "1";

  // Use service role bypass — RLS doesn't apply to public token access
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, customer:customers(*), user:profiles(*), template:quote_templates(*)")
    .eq("public_token", token)
    .single();

  if (!quote) notFound();

  // Fetch items — anon client works after RLS policy allows public token access
  const { data: items } = await supabase
    .from("quote_items")
    .select("*, product:products(id,name,image_url)")
    .eq("quote_id", quote.id)
    .order("sort_order");

  // Track opening — skip if preview mode (viewed by staff)
  if (!isPreview && quote.status === "verzonden") {
    await supabase
      .from("quotes")
      .update({ status: "geopend" })
      .eq("id", quote.id);

    await supabase.from("quote_activity").insert({
      quote_id: quote.id,
      user_id: null,
      action: "opened",
      description: "Offerte geopend door klant",
    });
  }

  const q = quote as Quote;
  const safeItems = (items ?? []) as QuoteItem[];

  return (
    <CustomerQuoteView
      quote={q}
      items={safeItems}
      token={token}
    />
  );
}
