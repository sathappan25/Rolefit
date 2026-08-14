"use client";

import Link from "next/link";
import { useApp } from "@/lib/store/app-store";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

function profileLabel(analysisName?: string, userName?: string) {
  const fromAnalysis = analysisName?.trim();
  if (fromAnalysis && fromAnalysis !== "Not Found") return fromAnalysis;
  if (userName?.trim()) return userName.trim();
  return "Guest";
}

export function Topbar() {
  const { user, analysis } = useApp();
  const name = profileLabel(analysis?.candidateName, user.name);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <MobileMenu />
        <div className="lg:hidden">
          <Logo href="/dashboard" showWordmark={false} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-secondary"
        >
          <Avatar fallback={name === "Guest" ? "?" : getInitials(name)} />
          <span className="hidden text-sm font-medium sm:inline">{name}</span>
        </Link>
      </div>
    </header>
  );
}
