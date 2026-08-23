import { FileText, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CareerAnalysis } from "@/lib/ai/types";

interface ResumeMeta {
  name: string;
  uploadedAt: string;
}

interface ActivityTimelineProps {
  analysis: CareerAnalysis;
  resumeMeta: ResumeMeta | null;
  preparedCount: number;
  totalQuestions: number;
}

export function ActivityTimeline({
  analysis,
  resumeMeta,
  preparedCount,
  totalQuestions,
}: ActivityTimelineProps) {
  const events = [
    resumeMeta && {
      icon: FileText,
      title: "Resume uploaded",
      detail: resumeMeta.name,
      time: new Date(resumeMeta.uploadedAt).toLocaleDateString(),
    },
    {
      icon: CheckCircle2,
      title: "Analysis complete",
      detail: `Resume score ${analysis.resumeScore}/100`,
      time: "Recent",
    },
    {
      icon: Target,
      title: "Best-fit role identified",
      detail: `${analysis.bestRole.title} · ${analysis.bestRole.matchScore}% match`,
      time: "Recent",
    },
    preparedCount > 0 && {
      icon: TrendingUp,
      title: "Interview prep in progress",
      detail: `${preparedCount} of ${totalQuestions} questions prepared`,
      time: "Ongoing",
    },
  ].filter(Boolean) as {
    icon: typeof FileText;
    title: string;
    detail: string;
    time: string;
  }[];

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-0">
          {events.map((event, i) => {
            const Icon = event.icon;
            const isLast = i === events.length - 1;
            return (
              <li key={event.title} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[15px] top-8 h-full w-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
