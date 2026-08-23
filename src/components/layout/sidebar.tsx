"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { mainNav, bottomNav } from "./nav-config";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navBadge(href: string, analysis: boolean, preparedCount: number) {
  if (href === "/dashboard/interview-prep" && preparedCount > 0) {
    return `${preparedCount} ready`;
  }
  if (href === "/dashboard/skill-gaps" && analysis) {
    return "Review";
  }
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { analysis, preparedQuestions } = useApp();
  const preparedCount = preparedQuestions.length;

  return (
    <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/dashboard" />
      </div>

      {!analysis && (
        <div className="border-b p-4">
          <Link
            href="/dashboard/resume-analyzer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "w-full justify-center gap-2 glow-primary",
            )}
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </Link>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Start by analyzing your resume
          </p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 scrollbar-thin">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          const badge = navBadge(item.href, !!analysis, preparedCount);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {badge && (
                <Badge variant={active ? "default" : "secondary"} className="shrink-0 text-[10px]">
                  {badge}
                </Badge>
              )}
              {active && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      {analysis && (
        <div className="border-t p-4">
          <div className="rounded-lg border bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Target role
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {analysis.bestRole.title}
            </p>
            <p className="text-xs text-muted-foreground">{analysis.bestRole.matchScore}% match</p>
          </div>
        </div>
      )}

      <div className="border-t p-4">
        <div className="flex flex-col gap-1">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
