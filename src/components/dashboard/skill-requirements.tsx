import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SkillRequirement, SkillLevel, GapSeverity } from "@/lib/ai/types";

const levelValue: Record<SkillLevel, number> = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Strong: 3,
};

const gapConfig: Record<GapSeverity, { label: string; variant: "success" | "warning" | "destructive" }> = {
  low: { label: "Low", variant: "success" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "destructive" },
};

function LevelMeter({ level, tone }: { level: SkillLevel; tone: "you" | "required" }) {
  const value = levelValue[level];
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-6 rounded-full",
              i <= value
                ? tone === "you"
                  ? "bg-primary"
                  : "bg-foreground/70"
                : "bg-secondary",
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{level}</span>
    </div>
  );
}

export function SkillRequirements({ requirements }: { requirements: SkillRequirement[] }) {
  return (
    <div className="space-y-3">
      {requirements.map((req) => {
        const gap = gapConfig[req.gap];
        return (
          <div
            key={req.skill}
            className="grid grid-cols-2 items-center gap-3 rounded-lg border bg-card p-4 sm:grid-cols-4"
          >
            <span className="font-medium text-foreground">{req.skill}</span>
            <div className="col-span-1">
              <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground sm:hidden">Your level</p>
              <LevelMeter level={req.yourLevel} tone="you" />
            </div>
            <div className="col-span-1">
              <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground sm:hidden">Required</p>
              <LevelMeter level={req.requiredLevel} tone="required" />
            </div>
            <div className="flex justify-start sm:justify-end">
              <Badge variant={gap.variant}>{gap.label} gap</Badge>
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-primary" /> Your level
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-foreground/70" /> Required level
        </span>
      </div>
    </div>
  );
}
