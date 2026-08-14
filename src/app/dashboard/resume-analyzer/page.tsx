"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { AiError, ERROR_MESSAGES } from "@/lib/ai/service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { UploadCard } from "@/components/analyzer/upload-card";
import { AnalyzingState } from "@/components/analyzer/analyzing-state";

type Phase = "idle" | "analyzing" | "error";

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const { analysis, analyzeResume, resumeMeta } = useApp();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const resultReady = React.useRef(false);
  const failed = React.useRef(false);

  const onAnalyze = async (file: File) => {
    setError(null);
    resultReady.current = false;
    failed.current = false;
    setPhase("analyzing");
    try {
      await analyzeResume(file);
      resultReady.current = true;
    } catch (err) {
      failed.current = true;
      const message =
        err instanceof AiError ? err.message : ERROR_MESSAGES["analysis-failure"];
      setError(message);
    }
  };

  const onAnimationComplete = () => {
    if (failed.current) {
      setPhase("error");
      return;
    }
    router.push("/dashboard/analysis");
  };

  if (phase === "analyzing") {
    return (
      <div className="py-8">
        <AnalyzingState onComplete={onAnimationComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume Analyzer"
        description="Upload your resume to generate your complete RoleFit career profile."
      />

      {phase === "error" && error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">We couldn&apos;t complete the analysis</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {analysis && phase !== "error" && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-foreground">You already have an analysis ready</p>
                <p className="text-sm text-muted-foreground">
                  {analysis.candidateName} · Resume Score {analysis.resumeScore}/100
                  {resumeMeta ? ` · Saved: ${resumeMeta.name}` : ""}
                </p>
              </div>
            </div>
            <Link href="/dashboard/analysis" className={cn(buttonVariants({ size: "sm" }))}>
              View Results
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UploadCard onAnalyze={onAnalyze} />
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Grounded &amp; honest analysis
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Only analyzes what&apos;s actually in your resume.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Never invents skills, projects, or experience.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Clearly labels Found, Inferred, and Not Found.
            </li>
          </ul>
          {analysis && (
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => setPhase("idle")}
            >
              <RefreshCw className="h-4 w-4" />
              Re-analyze a new resume
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
