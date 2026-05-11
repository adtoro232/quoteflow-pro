import { createClient, getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/settings/UserManagement";
import type { Profile } from "@/types";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data: users = [] } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Instellingen</h2>
          <p className="text-sm text-slate-500">Beheer gebruikers en platforminstellingen</p>
        </div>
        <UserManagement currentUserId={profile.id} users={(users ?? []) as Profile[]} />
      </div>
    </div>
  );
}
