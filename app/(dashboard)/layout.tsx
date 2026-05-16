import { redirect } from "next/navigation";
import { createClient, getProfile } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getBrandingStyles, type Branding } from "@/lib/utils/branding";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Env vars zijn de primaire bron voor branding
  let branding: Branding = {
    primaryColor: process.env.NEXT_PUBLIC_COMPANY_PRIMARY_COLOR || "#1e3a5f",
    logoUrl: process.env.NEXT_PUBLIC_COMPANY_LOGO_URL || null,
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "QuoteFlow Pro",
  };

  // Database company overschrijft env vars indien gekoppeld
  if (profile.company_id) {
    const { data: company } = await supabase
      .from("companies")
      .select("name, primary_color, logo_url")
      .eq("id", profile.company_id)
      .single();
    if (company) {
      branding = {
        primaryColor: company.primary_color || branding.primaryColor,
        logoUrl: company.logo_url || branding.logoUrl,
        companyName: company.name,
      };
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: getBrandingStyles(branding) }} />
      <DashboardShell profile={profile} branding={branding}>
        {children}
      </DashboardShell>
    </>
  );
}
