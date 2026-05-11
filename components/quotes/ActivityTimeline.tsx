import { formatCurrency } from "@/lib/utils";
import type { QuoteActivity } from "@/types";
import {
  FileText, Send, Eye, CheckCircle, XCircle, MessageSquare,
  AlertTriangle, Copy, Edit, Clock,
} from "lucide-react";

const actionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  created: { icon: FileText, color: "text-blue-600 bg-blue-50", label: "Offerte aangemaakt" },
  updated: { icon: Edit, color: "text-slate-600 bg-slate-100", label: "Offerte bijgewerkt" },
  sent: { icon: Send, color: "text-indigo-600 bg-indigo-50", label: "Offerte verzonden" },
  opened: { icon: Eye, color: "text-amber-600 bg-amber-50", label: "Offerte geopend" },
  viewed: { icon: Eye, color: "text-amber-600 bg-amber-50", label: "Offerte bekeken" },
  accepted: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50", label: "Offerte geaccepteerd" },
  rejected: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Offerte afgewezen" },
  commented: { icon: MessageSquare, color: "text-purple-600 bg-purple-50", label: "Opmerking toegevoegd" },
  expired: { icon: AlertTriangle, color: "text-orange-600 bg-orange-50", label: "Offerte verlopen" },
  duplicated: { icon: Copy, color: "text-slate-600 bg-slate-100", label: "Offerte gedupliceerd" },
};

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "zojuist";
  if (diffMins < 60) return `${diffMins} min geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? "en" : ""} geleden`;

  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

export function ActivityTimeline({ activities }: { activities: QuoteActivity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-6">Geen activiteit</p>;
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => {
        const config = actionConfig[activity.action] ?? {
          icon: Clock,
          color: "text-slate-600 bg-slate-100",
          label: activity.action,
        };
        const Icon = config.icon;
        const isLast = idx === activities.length - 1;

        return (
          <div key={activity.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && <div className="w-0.5 bg-slate-100 flex-1 mt-1 mb-1" />}
            </div>
            <div className={`pb-4 ${isLast ? "" : ""}`}>
              <p className="text-sm font-medium text-slate-900">{config.label}</p>
              {activity.description && (
                <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {activity.user
                  ? `${(activity.user as { full_name?: string }).full_name ?? "Gebruiker"} · `
                  : "Klant · "}
                {formatRelative(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
