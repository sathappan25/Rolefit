"use client";

import * as React from "react";
import { Search, Filter } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { QuestionCard } from "@/components/interview/question-card";
import type { InterviewQuestion, QuestionCategory } from "@/lib/ai/types";

const tabs: { value: QuestionCategory; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "resume", label: "Resume-Based" },
  { value: "projects", label: "Projects" },
  { value: "hr", label: "HR" },
  { value: "role-specific", label: "Role-Specific" },
];

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";
type StatusFilter = "all" | "prepared" | "unprepared";

function filterQuestions(
  questions: InterviewQuestion[],
  query: string,
  difficulty: DifficultyFilter,
  status: StatusFilter,
  preparedIds: string[],
) {
  return questions.filter((q) => {
    const matchesQuery =
      !query ||
      q.question.toLowerCase().includes(query.toLowerCase()) ||
      q.topic.toLowerCase().includes(query.toLowerCase()) ||
      q.relatedTo?.toLowerCase().includes(query.toLowerCase());
    const matchesDifficulty = difficulty === "all" || q.difficulty === difficulty;
    const isPrepared = preparedIds.includes(q.id);
    const matchesStatus =
      status === "all" ||
      (status === "prepared" && isPrepared) ||
      (status === "unprepared" && !isPrepared);
    return matchesQuery && matchesDifficulty && matchesStatus;
  });
}

export default function InterviewPrepPage() {
  const { analysis, preparedQuestions } = useApp();
  const [query, setQuery] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<DifficultyFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Interview Prep" description="Your personalized question bank will appear here." />
        <NoAnalysis />
      </div>
    );
  }

  const total = analysis.interviewQuestions.length;
  const preparedCount = analysis.interviewQuestions.filter((q) =>
    preparedQuestions.includes(q.id),
  ).length;
  const progress = total ? Math.round((preparedCount / total) * 100) : 0;

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        title="Interview Prep"
        description="Practice personalized questions grounded in your resume and target role."
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">
                {preparedCount} of {total} questions prepared
              </p>
              <p className="text-sm text-muted-foreground">Keep going — mark questions as you practice.</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <Progress value={progress} />
            <p className="mt-1 text-right text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions, topics, or projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <span className="text-xs font-medium text-muted-foreground self-center">Difficulty:</span>
          {(["all", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(d)}
            >
              {d === "all" ? "All" : d}
            </Button>
          ))}
          <span className="mx-1 text-border">|</span>
          <span className="text-xs font-medium text-muted-foreground self-center">Status:</span>
          {(
            [
              { v: "all", l: "All" },
              { v: "prepared", l: "Prepared" },
              { v: "unprepared", l: "Not prepared" },
            ] as { v: StatusFilter; l: string }[]
          ).map(({ v, l }) => (
            <Button
              key={v}
              variant={status === v ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(v)}
            >
              {l}
            </Button>
          ))}
        </div>
      )}

      <Tabs defaultValue="technical">
        <TabsList className="w-full overflow-x-auto">
          {tabs.map((t) => {
            const count = filterQuestions(
              analysis.interviewQuestions.filter((q) => q.category === t.value),
              query,
              difficulty,
              status,
              preparedQuestions,
            ).length;
            return (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                {t.label}
                <Badge variant="secondary" className="text-[10px]">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((t) => {
          const questions = filterQuestions(
            analysis.interviewQuestions.filter((q) => q.category === t.value),
            query,
            difficulty,
            status,
            preparedQuestions,
          );
          return (
            <TabsContent key={t.value} value={t.value}>
              {questions.length === 0 ? (
                <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
                  No questions match your search. Try adjusting filters.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {questions.map((q, i) => (
                    <QuestionCard key={q.id} question={q} index={i + 1} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
