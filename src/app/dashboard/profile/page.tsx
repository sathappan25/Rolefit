"use client";

import { Target, FileText, Award, Download } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProfilePage() {
  const { user, analysis, resumeMeta, resumeFile } = useApp();
  const name = analysis?.candidateName?.trim() || user.name;

  const downloadResume = () => {
    if (!resumeFile) return;
    const url = URL.createObjectURL(resumeFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = resumeFile.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
            <p className="mt-1 text-sm text-muted-foreground">
              Name sourced from your uploaded resume
            </p>
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

      {resumeMeta && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-foreground">{resumeMeta.name}</p>
                <p className="text-sm text-muted-foreground">
                  Saved locally · {formatBytes(resumeMeta.size)} ·{" "}
                  {new Date(resumeMeta.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadResume}
              disabled={!resumeFile}
            >
              <Download className="h-4 w-4" />
              Access resume
            </Button>
          </CardContent>
        </Card>
      )}

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
