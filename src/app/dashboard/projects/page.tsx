"use client";

import { FolderGit2 } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { NoAnalysis } from "@/components/shared/no-analysis";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/dashboard/project-card";

export default function ProjectsPage() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="space-y-8">
        <PageHeader title="My Projects" description="Projects extracted from your resume will appear here." />
        <NoAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Projects"
        description="Personalized preparation for the projects on your resume."
      />

      {analysis.projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description="We couldn't find any projects in your resume. Add projects to get tailored interview prep."
          actionLabel="Improve Resume"
          actionHref="/dashboard/resume-improvement"
        />
      ) : (
        <div className="space-y-6">
          {analysis.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
