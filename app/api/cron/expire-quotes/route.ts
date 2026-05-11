import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// This endpoint should be called daily via a cron job or Supabase scheduled function
// Protect with a secret header: Authorization: Bearer CRON_SECRET

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Only validate secret if one is configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Find quotes that should expire
  const { data: expiredQuotes, error } = await supabase
    .from("quotes")
    .select("id, quote_number")
    .in("status", ["verzonden", "geopend", "bekeken"])
    .lt("expiry_date", today)
    .not("expiry_date", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!expiredQuotes || expiredQuotes.length === 0) {
    return NextResponse.json({ message: "No quotes to expire", count: 0 });
  }

  const ids = expiredQuotes.map((q) => q.id);

  // Update status
  await supabase.from("quotes").update({ status: "verlopen" }).in("id", ids);

  // Add activity logs
  const activityRows = expiredQuotes.map((q) => ({
    quote_id: q.id,
    user_id: null,
    action: "expired" as const,
    description: "Offerte automatisch verlopen",
  }));

  await supabase.from("quote_activity").insert(activityRows);

  return NextResponse.json({
    message: `${expiredQuotes.length} offerte(s) verlopen`,
    count: expiredQuotes.length,
    quotes: expiredQuotes.map((q) => q.quote_number),
  });
}
