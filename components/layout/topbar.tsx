"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quotes": "Offertes",
  "/quotes/new": "Nieuwe offerte",
  "/customers": "Klanten",
  "/customers/new": "Nieuwe klant",
  "/products": "Producten & diensten",
  "/products/new": "Nieuw product",
  "/templates": "Templates",
  "/templates/new": "Nieuwe template",
  "/settings": "Instellingen",
};

export function Topbar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = routeTitles[href] ?? (seg.length > 20 ? seg.slice(0, 8) + "…" : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  const title = routeTitles[pathname] ?? breadcrumbs[breadcrumbs.length - 1]?.label ?? "Pagina";

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        <nav className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              {crumb.isLast ? (
                <span className="text-slate-500">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
