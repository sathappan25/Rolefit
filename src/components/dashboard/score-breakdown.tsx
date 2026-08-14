import { Progress } from "@/components/ui/progress";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/ai/types";

const labels: { key: keyof ScoreBreakdownType; label: string }[] = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "education", label: "Education" },
  { key: "ats", label: "ATS Optimization" },
];

export function ScoreBreakdown({ breakdown }: { breakdown: ScoreBreakdownType }) {
  return (
    <div className="space-y-4">
      {labels.map(({ key, label }) => {
        const value = breakdown[key];
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{label}</span>
              <span className="font-semibold text-muted-foreground">{value}%</span>
            </div>
            <Progress
              value={value}
              indicatorClassName={
                value >= 80 ? "bg-success" : value >= 60 ? "bg-warning" : "bg-destructive"
              }
            />
          </div>
        );
      })}
    </div>
  );
}
