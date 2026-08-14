import { FileUp } from "lucide-react";
import { EmptyState } from "./empty-state";

export function NoAnalysis({
  title = "No Resume Yet",
  description = "Upload your resume to discover your best-fit roles and personalized interview plan.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={FileUp}
      title={title}
      description={description}
      actionLabel="Upload Resume"
      actionHref="/dashboard/resume-analyzer"
    />
  );
}
