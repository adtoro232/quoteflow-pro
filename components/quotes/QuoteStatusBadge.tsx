import { Badge } from "@/components/ui/badge";
import type { QuoteStatus } from "@/types";

const statusConfig: Record<
  QuoteStatus,
  { label: string; variant: "slate" | "info" | "warning" | "success" | "destructive" | "purple" | "secondary" }
> = {
  concept: { label: "Concept", variant: "slate" },
  verzonden: { label: "Verzonden", variant: "info" },
  geopend: { label: "Geopend", variant: "info" },
  bekeken: { label: "Bekeken", variant: "warning" },
  geaccepteerd: { label: "Geaccepteerd", variant: "success" },
  afgewezen: { label: "Afgewezen", variant: "destructive" },
  verlopen: { label: "Verlopen", variant: "secondary" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: "slate" };
  return <Badge variant={config.variant as Parameters<typeof Badge>[0]["variant"]}>{config.label}</Badge>;
}
