"use client";

import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { QuestionCard } from "@/components/interview/question-card";
import type { QuestionCategory } from "@/lib/ai/types";

const tabs: { value: QuestionCategory; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "resume", label: "Resume-Based" },
  { value: "projects", label: "Projects" },
  { value: "hr", label: "HR" },
  { value: "role-specific", label: "Role-Specific" },
];

export default function InterviewPrepPage() {
  const { analysis, preparedQuestions } = useApp();

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
    <div className="space-y-8">
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
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="technical">
        <TabsList className="w-full">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const questions = analysis.interviewQuestions.filter((q) => q.category === t.value);
          return (
            <TabsContent key={t.value} value={t.value}>
              <div className="grid gap-4 md:grid-cols-2">
                {questions.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i + 1} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
