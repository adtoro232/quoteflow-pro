"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quotes": "Offertes",
  "/quotes/new": "Nieuwe offerte",
  "/customers": "Klanten",
  "/customers/new": "Nieuwe klant",
  "/products": "Producten",
  "/products/new": "Nieuw product",
  "/templates": "Templates",
  "/templates/new": "Nieuwe template",
  "/settings": "Instellingen",
  "/email-instellingen": "E-mailinstellingen",
};

export function Topbar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = routeTitles[href] ?? (seg.length > 16 ? seg.slice(0, 8) + "…" : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  const title = routeTitles[pathname] ?? breadcrumbs[breadcrumbs.length - 1]?.label ?? "";

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-3 sm:px-6 shrink-0 gap-2">

      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Hamburger — alleen mobiel */}
        <button
          className="p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 active:bg-slate-200 md:hidden shrink-0"
          onClick={() => setOpen(true)}
          aria-label="Menu openen"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{title}</p>
          {/* Breadcrumbs — alleen desktop */}
          <nav className="hidden md:flex items-center gap-1 mt-0.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1 text-xs text-slate-400">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {crumb.isLast
                  ? <span className="text-slate-500">{crumb.label}</span>
                  : <Link href={crumb.href} className="hover:text-slate-600">{crumb.label}</Link>
                }
              </span>
            ))}
          </nav>
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  );
}
