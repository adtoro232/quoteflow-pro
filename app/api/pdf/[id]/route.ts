import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { QuotePDF } from "@/lib/pdf/QuotePDF";
import type { Quote, QuoteItem } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Support public token access
  const token = request.nextUrl.searchParams.get("token");

  let query = supabase
    .from("quotes")
    .select("*, customer:customers(*), user:profiles(*)")
    .eq("id", id);

  const { data: quote, error } = await query.single();

  if (error || !quote) {
    return new NextResponse("Quote not found", { status: 404 });
  }

  // If accessed via token, verify it matches
  if (token && (quote as Quote).public_token !== token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // If no token, require auth
  if (!token) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const { data: items = [] } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", id)
    .order("sort_order");

  const q = quote as Quote;
  const safeItems = (items ?? []) as QuoteItem[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(QuotePDF, { quote: q, items: safeItems }) as any;
  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${q.quote_number}.pdf"`,
    },
  });
}
