import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { RecommendedRole } from "@/lib/ai/types";

export function RoleCard({ role, rank }: { role: RecommendedRole; rank?: number }) {
  return (
    <Card className="p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank != null && (
              <span className="text-xs font-bold text-muted-foreground">
                {String(rank).padStart(2, "0")}
              </span>
            )}
            <h3 className="truncate font-semibold text-foreground">{role.title}</h3>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{role.summary}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-bold text-primary">{role.matchScore}%</span>
          <p className="text-[11px] font-medium text-muted-foreground">Match</p>
        </div>
      </div>

      <div className="mt-4">
        <Progress value={role.matchScore} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {role.matchingSkills.slice(0, 4).map((s) => (
          <Badge key={s} variant="secondary">
            <Check className="h-3 w-3 text-success" />
            {s}
          </Badge>
        ))}
      </div>

      <Link
        href={`/dashboard/roles/${role.id}`}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 w-full")}
      >
        View Analysis
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
