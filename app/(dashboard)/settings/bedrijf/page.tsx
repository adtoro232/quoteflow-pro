import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { redirect } from "next/navigation";
import { CompanyProfileForm } from "@/components/settings/CompanyProfileForm";
import type { Company } from "@/types";

export default async function BedrijfPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  if (!profile.company_id) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-2xl">
          <p className="text-sm text-slate-500">
            Geen bedrijf gekoppeld aan uw account. Ga naar Instellingen om een bedrijf toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .single();

  if (!company) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-2xl">
          <p className="text-sm text-slate-500">
            Geen bedrijf gekoppeld aan uw account. Ga naar Instellingen om een bedrijf toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Mijn bedrijf</h2>
          <p className="text-sm text-slate-500">Beheer de gegevens van uw bedrijf</p>
        </div>
        <CompanyProfileForm company={company as Company} />
      </div>
    </div>
  );
}
