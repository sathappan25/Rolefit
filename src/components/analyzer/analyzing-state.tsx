"use client";

import * as React from "react";
import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ANALYSIS_STAGES } from "@/lib/ai/service";

const messages = [
  "Reading your resume...",
  "Extracting skills...",
  "Analyzing experience...",
  "Matching roles...",
  "Building your career profile...",
];

interface AnalyzingStateProps {
  /** Called once all stages have completed. */
  onComplete: () => void;
}

export function AnalyzingState({ onComplete }: AnalyzingStateProps) {
  const [stage, setStage] = React.useState(0);
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    if (stage >= ANALYSIS_STAGES.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        const t = setTimeout(onComplete, 500);
        return () => clearTimeout(t);
      }
      return;
    }
    const t = setTimeout(() => setStage((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [stage, onComplete]);

  const progress = Math.min(100, (stage / ANALYSIS_STAGES.length) * 100);

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-foreground">Analyzing your career profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages[Math.min(stage, messages.length - 1)]}
        </p>
      </div>

      <div className="mt-6">
        <Progress value={progress} />
      </div>

      <ul className="mt-6 space-y-3">
        {ANALYSIS_STAGES.map((s, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                done && "border-success/30 bg-success/5",
                active && "border-primary/30 bg-primary/5",
                !done && !active && "border-border",
              )}
            >
              {done ? (
                <Check className="h-5 w-5 shrink-0 text-success" />
              ) : active ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
