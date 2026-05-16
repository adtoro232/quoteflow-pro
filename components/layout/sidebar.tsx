"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  LayoutDashboard,
  Users,
  Package,
  FileStack,
  Settings,
  Mail,
  LogOut,
  ChevronRight,
  Building2,
} from "lucide-react";
import type { Profile } from "@/types";
import type { Branding } from "@/lib/utils/branding";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Offertes",
    href: "/quotes",
    icon: FileText,
  },
  {
    title: "Klanten",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Producten",
    href: "/products",
    icon: Package,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileStack,
  },
  {
    title: "E-mailinstellingen",
    href: "/email-instellingen",
    icon: Mail,
  },
];

const adminItems = [
  {
    title: "Mijn bedrijf",
    href: "/settings/bedrijf",
    icon: Building2,
  },
  {
    title: "Instellingen",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  profile: Profile;
  branding: Branding;
}

export function Sidebar({ profile, branding }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full bg-sidebar w-64 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={branding.companyName}
            className="h-8 w-auto object-contain shrink-0"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-bold text-sidebar-primary text-lg truncate">{branding.companyName}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-2">
          Navigatie
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.title}</span>
            {isActive(item.href, item.exact) && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
            )}
          </Link>
        ))}

        {profile.role === "admin" && (
          <>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mt-4 mb-2">
              Beheer
            </p>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
                {isActive(item.href) && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                )}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {profile.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-primary truncate">{profile.full_name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{profile.role === "admin" ? "Administrator" : "Medewerker"}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title="Uitloggen"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
