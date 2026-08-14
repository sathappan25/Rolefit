"use client";

import { Flame, ArrowUpRight, Sparkles, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import type { ResumeImprovement, Priority } from "@/lib/ai/types";

const groups: {
  key: Priority;
  title: string;
  icon: typeof Flame;
  accent: string;
  ring: string;
}[] = [
  { key: "high", title: "High Impact", icon: Flame, accent: "text-destructive", ring: "border-destructive/30 bg-destructive/5" },
  { key: "medium", title: "Medium Impact", icon: ArrowUpRight, accent: "text-warning", ring: "border-warning/30 bg-warning/5" },
  { key: "low", title: "Optional", icon: Sparkles, accent: "text-success", ring: "border-success/30 bg-success/5" },
];

function ImprovementItem({ item }: { item: ResumeImprovement }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="font-medium text-foreground">{item.title}</p>
      {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
      {item.before && item.after && (
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 rounded-lg bg-destructive/5 p-3 text-sm">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Instead of</p>
              <p className="text-muted-foreground">&ldquo;{item.before}&rdquo;</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-success/5 p-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-success">Use</p>
              <p className="text-foreground">&ldquo;{item.after}&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeImprovementPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Improve Your Resume" description="Actionable suggestions to strengthen your resume." />
        <NoAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Improve Your Resume"
        description="Targeted, resume-grounded suggestions ranked by impact."
      />

      <div className="space-y-6">
        {groups.map((group) => {
          const items = analysis.resumeImprovements.filter((r) => r.impact === group.key);
          if (items.length === 0) return null;
          const Icon = group.icon;
          return (
            <Card key={group.key} className={cn("border", group.ring)}>
              <CardContent className="p-5">
                <div className={cn("flex items-center gap-2 font-semibold", group.accent)}>
                  <Icon className="h-5 w-5" />
                  {group.title}
                  <Badge variant="secondary" className="ml-1">{items.length}</Badge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {items.map((item) => (
                    <ImprovementItem key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
