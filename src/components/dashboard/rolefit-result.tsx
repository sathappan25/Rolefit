import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import type { RecommendedRole } from "@/lib/ai/types";

export function RoleFitResult({ role, rank }: { role: RecommendedRole; rank: number }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {String(rank).padStart(2, "0")}
          </span>
          <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
        </div>
        <span className="text-2xl font-bold text-primary">{role.matchScore}% Match</span>
      </div>

      <div className="mt-4">
        <Progress value={role.matchScore} className="h-2.5" />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Why you fit</p>
          <ul className="space-y-1.5">
            {role.matchingSkills.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">What you&apos;re missing</p>
          <ul className="space-y-1.5">
            {role.missingSkills.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4 shrink-0 text-destructive" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href={`/dashboard/roles/${role.id}`}
        className={cn(buttonVariants({ variant: "outline" }), "mt-5 w-full sm:w-auto")}
      >
        Analyze This Role
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
