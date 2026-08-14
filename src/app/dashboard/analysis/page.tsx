"use client";

import { GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { ScoreBreakdown } from "@/components/dashboard/score-breakdown";
import { SkillsSection } from "@/components/dashboard/skills-section";
import { RoleFitResult } from "@/components/dashboard/rolefit-result";

export default function AnalysisPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="Resume Analysis" description="Your full resume report will appear here." />
        <NoAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Resume Analysis" description={`Report for ${analysis.candidateName}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Resume Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress value={analysis.resumeScore} size={170} label="out of 100" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              A strong, competitive resume. A few targeted improvements will push it higher.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreBreakdown breakdown={analysis.scoreBreakdown} />
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Extracted Profile</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.education.map((e, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-medium text-foreground">{e.degree}</p>
                  <p className="text-sm text-muted-foreground">{e.university}</p>
                  <p className="text-sm text-muted-foreground">{e.graduationYear}</p>
                  <EvidenceBadge source={e.source} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.experience.map((e, i) => (
                <div key={i} className="space-y-1 border-l-2 border-primary/20 pl-3">
                  <p className="font-medium text-foreground">{e.position}</p>
                  <p className="text-sm text-muted-foreground">{e.company}</p>
                  <p className="text-xs text-muted-foreground">{e.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsSection skills={analysis.skills} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Your RoleFit Results</h2>
            <p className="text-sm text-muted-foreground">Top role matches ranked by fit.</p>
          </div>
          <Badge variant="secondary">{analysis.recommendedRoles.length} roles</Badge>
        </div>
        <div className="space-y-4">
          {analysis.recommendedRoles.slice(0, 3).map((role, i) => (
            <RoleFitResult key={role.id} role={role} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
