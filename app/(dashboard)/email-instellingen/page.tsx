import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { EmailSettings } from "@/components/settings/EmailSettings";
import { redirect } from "next/navigation";

export default async function EmailInstellingenPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  let settings: Record<string, string> = {
    email_from: process.env.RESEND_FROM_EMAIL ?? "",
    email_subject: "Offerte {{quote_number}} van {{company_name}}",
    email_intro: "Hierbij ontvangt u onze offerte. Via de knop hieronder kunt u de offerte bekijken en direct accepteren of afwijzen.",
    email_closing: "Heeft u vragen? Neem gerust contact met ons op.",
  };

  try {
    const { data: rows } = await supabase.from("app_settings").select("key, value");
    for (const row of rows ?? []) {
      if (row.value !== null) settings[row.key] = row.value;
    }
  } catch {
    // Table doesn't exist yet — use defaults above
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-2">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">E-mailinstellingen</h2>
          <p className="text-sm text-slate-500">
            Pas het afzenderadres en de tekst van de offerte-e-mail aan.
          </p>
        </div>
        <EmailSettings settings={settings} />
      </div>
    </div>
  );
}
