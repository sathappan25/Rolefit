"use client";

import * as React from "react";
import { CheckCircle2, Circle, PenLine, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-store";
import type { InterviewQuestion } from "@/lib/ai/types";

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "destructive",
} as const;

export function QuestionCard({ question, index }: { question: InterviewQuestion; index: number }) {
  const { preparedQuestions, togglePrepared } = useApp();
  const prepared = preparedQuestions.includes(question.id);
  const [open, setOpen] = React.useState(false);

  return (
    <Card className={cn("p-5 transition-colors", prepared && "border-success/40 bg-success/5")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            <span className="text-muted-foreground">Q{index}. </span>
            {question.question}
          </p>
          {question.relatedTo && (
            <p className="mt-1 text-xs text-muted-foreground">Based on: {question.relatedTo}</p>
          )}
        </div>
        {prepared && (
          <Badge variant="success" className="shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            Prepared
          </Badge>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={difficultyVariant[question.difficulty]}>{question.difficulty}</Badge>
        <Badge variant="secondary">{question.topic}</Badge>
      </div>

      {open && (
        <div className="mt-4 animate-fade-in">
          <label htmlFor={`answer-${question.id}`} className="text-xs font-medium text-muted-foreground">
            Draft your answer
          </label>
          <textarea
            id={`answer-${question.id}`}
            rows={4}
            placeholder="Structure your answer: situation, approach, result, and what you'd improve..."
            className="mt-1.5 w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          <PenLine className="h-4 w-4" />
          Practice Answer
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </Button>
        <Button
          variant={prepared ? "secondary" : "default"}
          size="sm"
          onClick={() => togglePrepared(question.id)}
        >
          {prepared ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {prepared ? "Mark as Unprepared" : "Mark as Prepared"}
        </Button>
      </div>
    </Card>
  );
}
