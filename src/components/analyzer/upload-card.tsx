"use client";

import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { validateResumeFile } from "@/lib/ai/service";

interface UploadCardProps {
  onAnalyze: (file: File) => void;
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
    <Card className="overflow-hidden">
      <div className="border-b p-6">
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
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/40",
          )}
        >
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
              dragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
            )}
          >
            <UploadCloud className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium text-foreground">Drag &amp; drop your resume here</p>
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
          <div role="alert" className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border bg-secondary/40 p-3 animate-fade-in">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
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
      </div>
    </Card>
  );
}
