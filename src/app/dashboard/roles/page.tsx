"use client";

import { useApp } from "@/lib/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { BestRoleCard } from "@/components/dashboard/best-role-card";
import { RoleCard } from "@/components/dashboard/role-card";

export default function RolesPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="My Roles" description="Your best-fit roles will appear here after analysis." />
        <NoAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Roles"
        description="Roles ranked by how well they match your resume profile."
      />

      <BestRoleCard role={analysis.bestRole} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recommended Roles</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {analysis.recommendedRoles.map((role, i) => (
            <RoleCard key={role.id} role={role} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
