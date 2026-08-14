"use client";

import Link from "next/link";
import { FileText, Target, TrendingUp, Award, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { BestRoleCard } from "@/components/dashboard/best-role-card";
import { RoleCard } from "@/components/dashboard/role-card";
import { NoAnalysis } from "@/components/shared/no-analysis";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function OverviewPage() {
  const { user, analysis } = useApp();
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting()}, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your current career readiness overview.
        </p>
      </div>

      {!analysis ? (
        <NoAnalysis />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Career Readiness</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <CircularProgress value={analysis.careerReadiness} size={180} />
                <div className="mt-6 grid w-full grid-cols-2 gap-3">
                  {[
                    { label: "Resume Score", value: analysis.readiness.resumeScore },
                    { label: "Role Fit", value: analysis.readiness.roleFit },
                    { label: "Interview Readiness", value: analysis.readiness.interviewReadiness },
                    { label: "Skill Strength", value: analysis.readiness.skillStrength },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-bold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <BestRoleCard role={analysis.bestRole} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Resume Score" value={analysis.resumeScore} suffix="/100" icon={FileText} hint="Overall resume quality" />
            <StatCard label="Best Role Fit" value={analysis.bestRole.matchScore} suffix="%" icon={Target} hint={analysis.bestRole.title} />
            <StatCard label="Skill Strength" value={analysis.readiness.skillStrength} suffix="%" icon={TrendingUp} hint="Across all categories" />
            <StatCard label="Interview Ready" value={analysis.readiness.interviewReadiness} suffix="%" icon={Award} hint="Prep completion" />
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recommended Roles</h2>
                <p className="text-sm text-muted-foreground">Your top role matches based on your resume.</p>
              </div>
              <Link href="/dashboard/roles" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analysis.recommendedRoles.slice(0, 3).map((role, i) => (
                <RoleCard key={role.id} role={role} rank={i + 1} />
              ))}
            </div>
          </section>

          <Card className="bg-primary/5">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Ready to go deeper?</p>
                  <p className="text-sm text-muted-foreground">
                    Review your skill gaps and start your personalized interview prep plan.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href="/dashboard/skill-gaps" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Skill Gaps
                </Link>
                <Link href="/dashboard/interview-prep" className={cn(buttonVariants({ size: "sm" }))}>
                  Interview Prep
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
