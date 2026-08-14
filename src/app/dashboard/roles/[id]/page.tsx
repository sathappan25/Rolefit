"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, ListChecks, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillRequirements } from "@/components/dashboard/skill-requirements";
import { InterviewFocus } from "@/components/dashboard/interview-focus";

export default function RoleAnalysisPage() {
  const params = useParams<{ id: string }>();
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Role Analysis" />
        <NoAnalysis />
      </div>
    );
  }

  const role = analysis.recommendedRoles.find((r) => r.id === params.id);

  if (!role) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/roles" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}>
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Link>
        <EmptyState
          icon={ListChecks}
          title="Role not found"
          description="We couldn't find that role in your current analysis."
          actionLabel="View all roles"
          actionHref="/dashboard/roles"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/dashboard/roles" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}>
        <ArrowLeft className="h-4 w-4" />
        Back to roles
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Badge variant="secondary">Role Analysis</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{role.title}</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">{role.summary}</p>
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-foreground">Why you&apos;re a good match</p>
              <div className="flex flex-wrap gap-1.5">
                {role.matchingSkills.map((s) => (
                  <Badge key={s} variant="success">
                    <Check className="h-3 w-3" />
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Role Match</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularProgress value={role.matchScore} size={160} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillRequirements requirements={role.requirements} />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">What Should You Prepare?</h2>
          <p className="text-sm text-muted-foreground">
            Prioritized interview topics tailored to this role and your profile.
          </p>
        </div>
        <InterviewFocus topics={analysis.interviewFocus} />
      </section>

      <Card className="bg-primary/5">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquareText className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Start preparing for {role.title}</p>
              <p className="text-sm text-muted-foreground">Practice personalized interview questions now.</p>
            </div>
          </div>
          <Link href="/dashboard/interview-prep" className={cn(buttonVariants(), "shrink-0")}>
            Go to Interview Prep
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
