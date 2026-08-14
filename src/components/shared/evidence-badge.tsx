import { CheckCircle2, Lightbulb, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EvidenceSource, SkillLevel } from "@/lib/ai/types";

const sourceConfig: Record<
  EvidenceSource,
  { label: string; variant: "success" | "warning" | "muted"; icon: typeof CheckCircle2 }
> = {
  found: { label: "Found in Resume", variant: "success", icon: CheckCircle2 },
  inferred: { label: "Inferred from Project", variant: "warning", icon: Lightbulb },
  "not-found": { label: "Not Found", variant: "muted", icon: HelpCircle },
};

export function EvidenceBadge({ source }: { source: EvidenceSource }) {
  const cfg = sourceConfig[source];
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

export function EvidenceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <EvidenceBadge source="found" />
      <EvidenceBadge source="inferred" />
      <EvidenceBadge source="not-found" />
    </div>
  );
}

const levelConfig: Record<SkillLevel, "success" | "default" | "warning" | "muted"> = {
  Strong: "success",
  Intermediate: "default",
  Beginner: "warning",
  None: "muted",
};

export function LevelBadge({ level }: { level: SkillLevel }) {
  return <Badge variant={levelConfig[level]}>{level}</Badge>;
}
