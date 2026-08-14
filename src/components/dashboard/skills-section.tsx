import { Badge } from "@/components/ui/badge";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { Skill } from "@/lib/ai/types";

function groupByCategory(skills: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = map.get(skill.category) ?? [];
    list.push(skill);
    map.set(skill.category, list);
  }
  return Array.from(map.entries());
}

const sourceVariant = {
  found: "default",
  inferred: "warning",
  "not-found": "muted",
} as const;

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = groupByCategory(skills);
  return (
    <div className="space-y-5">
      {groups.map(([category, items]) => (
        <div key={category}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {items.map((s) => (
              <Badge key={s.name} variant={sourceVariant[s.source]} title={s.level}>
                {s.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      <div className="border-t pt-4">
        <EvidenceBadgeLegendInline />
      </div>
    </div>
  );
}

function EvidenceBadgeLegendInline() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Legend:</span>
      <EvidenceBadge source="found" />
      <EvidenceBadge source="inferred" />
      <EvidenceBadge source="not-found" />
    </div>
  );
}
