"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { hydrated } = useApp();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
