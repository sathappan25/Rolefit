import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { SkillGap } from "@/lib/ai/types";

export function SkillGapPreview({ gaps }: { gaps: SkillGap[] }) {
  const critical = gaps.filter((g) => g.category === "critical").slice(0, 3);
  const improve = gaps.filter((g) => g.category === "improve").slice(0, 2);

  return (
    <Card className="hover-lift">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Priority Skill Gaps</CardTitle>
        <Link href="/dashboard/skill-gaps" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {critical.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              Critical
            </div>
            <div className="space-y-3">
              {critical.map((gap) => (
                <GapRow key={gap.skill} gap={gap} barClass="bg-destructive" />
              ))}
            </div>
          </div>
        )}
        {improve.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-warning">Improve</p>
            <div className="space-y-3">
              {improve.map((gap) => (
                <GapRow key={gap.skill} gap={gap} barClass="bg-warning" />
              ))}
            </div>
          </div>
        )}
        {critical.length === 0 && improve.length === 0 && (
          <p className="text-sm text-muted-foreground">No major gaps detected for your target role.</p>
        )}
      </CardContent>
    </Card>
  );
}

function GapRow({ gap, barClass }: { gap: SkillGap; barClass: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{gap.skill}</span>
        <Badge variant="secondary">{gap.currentLevel} → {gap.targetLevel}</Badge>
      </div>
      <Progress value={gap.progress} indicatorClassName={barClass} />
    </div>
  );
}
