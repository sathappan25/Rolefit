import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { CareerAnalysis } from "@/lib/ai/types";

interface Step {
  id: string;
  label: string;
  href: string;
  done: boolean;
}

function buildSteps(analysis: CareerAnalysis, preparedCount: number): Step[] {
  const hasPrep = preparedCount > 0;
  const criticalGaps = analysis.skillGaps.filter((g) => g.category === "critical").length;

  return [
    { id: "upload", label: "Resume analyzed", href: "/dashboard/analysis", done: true },
    {
      id: "role",
      label: `Review best-fit role: ${analysis.bestRole.title}`,
      href: `/dashboard/roles/${analysis.bestRole.id}`,
      done: true,
    },
    {
      id: "gaps",
      label: criticalGaps
        ? `Close ${criticalGaps} critical skill gap${criticalGaps > 1 ? "s" : ""}`
        : "Review skill gaps",
      href: "/dashboard/skill-gaps",
      done: false,
    },
    {
      id: "prep",
      label: hasPrep ? "Continue interview prep" : "Start interview preparation",
      href: "/dashboard/interview-prep",
      done: hasPrep,
    },
    {
      id: "roadmap",
      label: "Follow your career roadmap",
      href: "/dashboard/roadmap",
      done: analysis.careerRoadmap.some((s) => s.status === "done"),
    },
  ];
}

export function NextSteps({
  analysis,
  preparedCount,
}: {
  analysis: CareerAnalysis;
  preparedCount: number;
}) {
  const steps = buildSteps(analysis, preparedCount);
  const next = steps.find((s) => !s.done) ?? steps[steps.length - 1];
  const completed = steps.filter((s) => s.done).length;

  return (
    <Card className="hover-lift">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Your Next Steps</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {completed} of {steps.length} milestones started
          </p>
        </div>
        <Link href={next.href} className={cn(buttonVariants({ size: "sm" }))}>
          Continue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-secondary/60",
              step.done ? "border-success/20 bg-success/5" : "border-border",
            )}
          >
            {step.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className={cn("font-medium", step.done ? "text-muted-foreground" : "text-foreground")}>
              {step.label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
