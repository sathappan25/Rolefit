import Link from "next/link";
import {
  FileText,
  Target,
  TrendingUp,
  MessageSquareText,
  Map,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/dashboard/resume-analyzer",
    label: "Analyze Resume",
    icon: FileText,
    accent: "bg-primary/10 text-primary",
  },
  {
    href: "/dashboard/roles",
    label: "My Roles",
    icon: Target,
    accent: "bg-success/10 text-success",
  },
  {
    href: "/dashboard/skill-gaps",
    label: "Skill Gaps",
    icon: TrendingUp,
    accent: "bg-warning/15 text-warning",
  },
  {
    href: "/dashboard/interview-prep",
    label: "Interview Prep",
    icon: MessageSquareText,
    accent: "bg-primary/10 text-primary",
  },
  {
    href: "/dashboard/roadmap",
    label: "Roadmap",
    icon: Map,
    accent: "bg-secondary text-foreground",
  },
  {
    href: "/dashboard/resume-improvement",
    label: "Improve Resume",
    icon: Sparkles,
    accent: "bg-accent text-accent-foreground",
  },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group flex flex-col items-center gap-2.5 rounded-xl border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
              action.accent,
            )}
          >
            <action.icon className="h-5 w-5" />
          </span>
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
