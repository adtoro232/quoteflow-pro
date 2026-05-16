"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import type { Profile } from "@/types";
import type { Branding } from "@/lib/utils/branding";

interface DashboardShellProps {
  profile: Profile;
  branding: Branding;
  children: React.ReactNode;
}

function ShellInner({ profile, branding, children }: DashboardShellProps) {
  const { open, setOpen } = useSidebar();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display: "flex", height: "100svh", overflow: "hidden" }}>

      {/* Desktop sidebar — only rendered in DOM when screen >= 768px */}
      {isDesktop && (
        <div style={{ flexShrink: 0 }}>
          <Sidebar profile={profile} branding={branding} />
        </div>
      )}

      {/* Mobile overlay — only when hamburger is tapped */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}>
          <div style={{ position: "relative", width: 272, maxWidth: "85vw", height: "100%", flexShrink: 0, boxShadow: "0 25px 50px rgba(0,0,0,.4)", overflow: "hidden" }}>
            <button
              style={{ position: "absolute", top: 12, right: 8, zIndex: 10, background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: "rgba(255,255,255,.5)", lineHeight: 1 }}
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
            <Sidebar profile={profile} branding={branding} />
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,.5)" }} onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </div>

    </div>
  );
}

export function DashboardShell({ profile, branding, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <ShellInner profile={profile} branding={branding}>
        {children}
      </ShellInner>
    </SidebarProvider>
  );
}
