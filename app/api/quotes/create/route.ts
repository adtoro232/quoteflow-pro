import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, getUser } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { quote: quoteData, items } = body;

  if (!quoteData || !items) {
    return NextResponse.json({ error: "quote and items required" }, { status: 400 });
  }

  // Use service role — bypasses all RLS
  const supabase = createServiceClient();

  // 1. Insert quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({ ...quoteData, user_id: user.id })
    .select()
    .single();

  if (quoteError || !quote) {
    console.error("[create-quote] quote insert error:", quoteError);
    return NextResponse.json({ error: quoteError?.message ?? "Quote insert failed" }, { status: 500 });
  }

  // 2. Insert items
  const itemRows = items.map((item: Record<string, unknown>, i: number) => ({
    quote_id: quote.id,
    product_id: item.product_id || null,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unit_price: item.unit_price,
    discount_percentage: item.discount_percentage,
    vat_percentage: item.vat_percentage,
    line_total: item.line_total,
    sort_order: i,
  }));

  const { error: itemsError } = await supabase.from("quote_items").insert(itemRows);

  if (itemsError) {
    console.error("[create-quote] items insert error:", itemsError);
    // Rollback: delete the quote we just created
    await supabase.from("quotes").delete().eq("id", quote.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // 3. Activity log
  await supabase.from("quote_activity").insert({
    quote_id: quote.id,
    user_id: user.id,
    action: quoteData.status === "verzonden" ? "sent" : "created",
    description: quoteData.status === "verzonden"
      ? "Offerte aangemaakt en verzonden"
      : "Offerte aangemaakt als concept",
  });

  return NextResponse.json({ quote });
}
