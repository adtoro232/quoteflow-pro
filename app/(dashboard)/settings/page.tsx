import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/settings/UserManagement";
import { CompanyManagement } from "@/components/settings/CompanyManagement";
import type { Profile, Company } from "@/types";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: users = [] }, { data: companies = [] }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase.from("companies").select("*").order("name"),
  ]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Instellingen</h2>
          <p className="text-sm text-slate-500">Beheer bedrijven, gebruikers en platforminstellingen</p>
        </div>
        <CompanyManagement
          companies={(companies ?? []) as Company[]}
          users={(users ?? []) as Profile[]}
        />
        <UserManagement currentUserId={profile.id} users={(users ?? []) as Profile[]} />
      </div>
    </div>
  );
}
