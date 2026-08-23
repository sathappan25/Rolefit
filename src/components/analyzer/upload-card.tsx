"use client";

import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { validateResumeFile } from "@/lib/ai/service";

const tips = [
  "Use a clear filename like Firstname-Lastname-Resume.pdf",
  "Include measurable results in project bullets",
  "List skills you can confidently discuss in interviews",
  "Keep the file under 5MB for faster analysis",
];

interface UploadCardProps {
  onAnalyze: (file: File) => void;
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "doc" || ext === "docx") return "DOC";
  return "FILE";
}

export function UploadCard({ onAnalyze }: UploadCardProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (next: File | null) => {
    setError(null);
    const err = validateResumeFile(next);
    if (err) {
      setError(err.message);
      setFile(null);
      return;
    }
    setFile(next);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  return (
    <Card className="overflow-hidden hover-lift">
      <div className="border-b bg-secondary/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">Analyze Your Resume</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your resume and RoleFit will build your full career profile.
        </p>
      </div>

      <div className="p-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01] glow-primary"
              : "border-border hover:border-primary/50 hover:bg-secondary/40",
          )}
        >
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
              dragging ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary",
            )}
          >
            <UploadCloud className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium text-foreground">
            {dragging ? "Drop your resume here" : "Drag & drop your resume here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse your files</p>
          <p className="mt-4 text-xs text-muted-foreground">Supported: PDF, DOC, DOCX · up to 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive animate-fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 animate-fade-in">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              {fileIcon(file.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB · Ready to analyze
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove file"
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={!file}
          onClick={() => file && onAnalyze(file)}
        >
          Upload &amp; Analyze
        </Button>

        <div className="mt-6 rounded-xl border bg-secondary/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-primary" />
            Resume tips for better results
          </div>
          <ul className="mt-3 space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
