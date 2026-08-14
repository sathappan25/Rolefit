import Link from "next/link";
import { Target, Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import type { BestRole } from "@/lib/ai/types";

export function BestRoleCard({ role }: { role: BestRole }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-secondary/40 p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Target className="h-4 w-4 text-primary" />
          Your Best-Fit Role
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{role.title}</h3>
          <div className="flex items-baseline gap-1 text-primary">
            <AnimatedCounter value={role.matchScore} className="text-3xl font-bold" />
            <span className="text-lg font-semibold">% Match</span>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <p className="text-sm text-muted-foreground">{role.summary}</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Top matching skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {role.matchingSkills.map((s) => (
                <Badge key={s} variant="success">
                  <Check className="h-3 w-3" />
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Missing skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {role.missingSkills.map((s) => (
                <Badge key={s} variant="muted">
                  <X className="h-3 w-3" />
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Link
          href={`/dashboard/roles/${role.id}`}
          className={cn(buttonVariants(), "w-full sm:w-auto")}
        >
          View Role Analysis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
