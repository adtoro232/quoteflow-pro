import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomerQuoteView } from "@/components/quotes/CustomerQuoteView";
import type { Quote, QuoteItem } from "@/types";

export default async function CustomerQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Use service role bypass — RLS doesn't apply to public token access
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, customer:customers(*), user:profiles(*), template:quote_templates(*)")
    .eq("public_token", token)
    .single();

  if (!quote) notFound();

  // Fetch items via direct REST with service key (bypasses RLS)
  const itemsRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quote_items?quote_id=eq.${quote.id}&select=*,product:products(id,name,image_url)&order=sort_order`,
    {
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY!}`,
      },
      cache: "no-store",
    }
  );
  const items = itemsRes.ok ? await itemsRes.json() : [];

  // Track opening — update status to 'geopend' if still 'verzonden'
  if (quote.status === "verzonden") {
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
