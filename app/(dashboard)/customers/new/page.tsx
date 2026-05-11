import { getProfile } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { redirect } from "next/navigation";

export default async function NewCustomerPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
        <CustomerForm userId={profile.id} />
      </div>
    </div>
  );
}
