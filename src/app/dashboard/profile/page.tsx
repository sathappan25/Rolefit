"use client";

import { Target, FileText, Award } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

export default function ProfilePage() {
  const { user, analysis } = useApp();
  const name = user.name;

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Your personal RoleFit profile." />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {getInitials(name)}
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {analysis ? (
                <>
                  <Badge variant="success">Resume analyzed</Badge>
                  <Badge variant="secondary">Target: {analysis.bestRole.title}</Badge>
                </>
              ) : (
                <Badge variant="muted">No resume analyzed yet</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-foreground">{analysis.resumeScore}</p>
                <p className="text-xs text-muted-foreground">Resume Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-foreground">{analysis.bestRole.matchScore}%</p>
                <p className="text-xs text-muted-foreground">Best Role Fit</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-foreground">{analysis.careerReadiness}%</p>
                <p className="text-xs text-muted-foreground">Career Readiness</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
