"use client";

import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { SkillGapChart } from "@/components/dashboard/skill-gap-chart";
import type { SkillGap } from "@/lib/ai/types";

const columns = [
  {
    key: "critical" as const,
    title: "Critical",
    icon: AlertTriangle,
    accent: "text-destructive",
    ring: "border-destructive/30",
    bar: "bg-destructive",
  },
  {
    key: "improve" as const,
    title: "Improve",
    icon: TrendingUp,
    accent: "text-warning",
    ring: "border-warning/30",
    bar: "bg-warning",
  },
  {
    key: "strong" as const,
    title: "Strong",
    icon: CheckCircle2,
    accent: "text-success",
    ring: "border-success/30",
    bar: "bg-success",
  },
];

function GapItem({ gap, bar }: { gap: SkillGap; bar: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{gap.skill}</span>
        <span className="text-xs text-muted-foreground">
          {gap.currentLevel} → {gap.targetLevel}
        </span>
      </div>
      <Progress value={gap.progress} indicatorClassName={bar} />
    </div>
  );
}

export default function SkillGapsPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Skill Gaps" description="Skills that can improve your chances for your target role." />
        <NoAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Gaps"
        description="Skills that can improve your chances for your target role."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Readiness Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillGapChart gaps={analysis.skillGaps} />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Improve</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Strong</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map((col) => {
          const items = analysis.skillGaps.filter((g) => g.category === col.key);
          const Icon = col.icon;
          return (
            <Card key={col.key} className={cn("border", col.ring)}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className={cn("flex items-center gap-2 text-base", col.accent)}>
                  <Icon className="h-5 w-5" />
                  {col.title}
                </CardTitle>
                <Badge variant="secondary">{items.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No skills in this category.</p>
                ) : (
                  items.map((gap) => <GapItem key={gap.skill} gap={gap} bar={col.bar} />)
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
