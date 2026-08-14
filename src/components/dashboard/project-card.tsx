import { Lightbulb, MessageSquareText, BookOpen, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { Project } from "@/lib/ai/types";

function Section({
  icon: Icon,
  title,
  items,
  ordered,
}: {
  icon: typeof Lightbulb;
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="shrink-0 text-primary/70">{ordered ? `${i + 1}.` : "•"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
            <div className="mt-1.5">
              <EvidenceBadge source={project.source} />
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{project.relevance}%</span>
            <p className="text-[11px] font-medium text-muted-foreground">Role Relevance</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <Gauge className="h-4 w-4 text-primary" />
              Project Strength
            </span>
            <span className="font-semibold text-muted-foreground">{project.strength}%</span>
          </div>
          <Progress value={project.strength} />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Section icon={Lightbulb} title="What You Should Know" items={project.whatToKnow} />
          <Section icon={MessageSquareText} title="Likely Interview Questions" items={project.likelyQuestions} ordered />
          <Section icon={BookOpen} title="Concepts to Revise" items={project.conceptsToRevise} />
        </div>
      </CardContent>
    </Card>
  );
}
