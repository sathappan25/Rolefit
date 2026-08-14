import { Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const roles = [
  { title: "Machine Learning Engineer", match: 87 },
  { title: "Data Scientist", match: 82 },
  { title: "AI Engineer", match: 79 },
];

/** Decorative, self-contained product preview shown in the hero. */
export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" aria-hidden="true" />
      <div className="rounded-2xl border bg-card p-5 shadow-2xl shadow-primary/5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Career Readiness</p>
            <p className="text-sm font-semibold text-foreground">Aisha Sharma</p>
          </div>
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3" />
            Analyzed
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <CircularProgress value={78} size={116} strokeWidth={10} />
          <div className="flex-1 space-y-3">
            {[
              { label: "Resume Score", value: 82 },
              { label: "Role Fit", value: 87 },
              { label: "Interview", value: 71 },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
                <Progress value={s.value} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-primary" />
            Best-Fit Role
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-semibold text-foreground">Machine Learning Engineer</span>
            <span className="text-lg font-bold text-primary">87%</span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Recommended Roles
          </div>
          {roles.map((r) => (
            <div key={r.title} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-xs text-foreground">{r.title}</span>
              <Progress value={r.match} className="h-1.5" />
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-foreground">{r.match}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
