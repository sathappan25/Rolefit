"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import type { RoadmapStep } from "@/lib/ai/types";

const statusConfig = {
  done: { icon: Check, ring: "border-success bg-success text-success-foreground", badge: "success" as const, label: "Completed" },
  "in-progress": { icon: Loader2, ring: "border-primary bg-primary text-primary-foreground", badge: "default" as const, label: "In Progress" },
  upcoming: { icon: Circle, ring: "border-border bg-card text-muted-foreground", badge: "muted" as const, label: "Upcoming" },
};

function Step({ step, isLast }: { step: RoadmapStep; isLast: boolean }) {
  const cfg = statusConfig[step.status];
  const Icon = cfg.icon;
  return (
    <div className="relative flex gap-4 pb-8">
      {!isLast && (
        <span
          className={cn(
            "absolute left-[19px] top-10 h-full w-0.5",
            step.status === "done" ? "bg-success/40" : "bg-border",
          )}
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
          cfg.ring,
        )}
      >
        <Icon className={cn("h-5 w-5", step.status === "in-progress" && "animate-spin")} />
      </span>
      <Card className="flex-1">
        <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">Step {step.step}</span>
              <Badge variant={cfg.badge}>{cfg.label}</Badge>
            </div>
            <p className="mt-1 font-semibold text-foreground">{step.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">{step.estimate}</span>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RoadmapPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Your Career Roadmap" description="A personalized path toward your target role." />
        <NoAnalysis />
      </div>
    );
  }

  const steps = analysis.careerRoadmap;
  const done = steps.filter((s) => s.status === "done").length;
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const target = analysis.bestRole.title;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Career Roadmap"
        description={`A personalized path toward becoming a ${target}.`}
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">Overall progress</p>
            <p className="text-sm text-muted-foreground">
              {done} of {steps.length} milestones completed
            </p>
          </div>
          <div className="flex items-center gap-3 sm:w-72">
            <Progress value={progress} />
            <span className="text-sm font-bold text-foreground">{progress}%</span>
          </div>
        </CardContent>
      </Card>

      <div>
        {steps.map((step, i) => (
          <Step key={step.step} step={step} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}
