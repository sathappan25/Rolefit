import { Flame, CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "@/components/shared/evidence-badge";
import type { InterviewTopic, Priority } from "@/lib/ai/types";

const groups: {
  key: Priority;
  title: string;
  icon: typeof Flame;
  accent: string;
  ring: string;
}[] = [
  { key: "high", title: "High Priority", icon: Flame, accent: "text-destructive", ring: "border-destructive/30 bg-destructive/5" },
  { key: "medium", title: "Medium Priority", icon: CircleDot, accent: "text-warning", ring: "border-warning/30 bg-warning/5" },
  { key: "low", title: "Lower Priority", icon: Circle, accent: "text-success", ring: "border-success/30 bg-success/5" },
];

function TopicRow({ topic }: { topic: InterviewTopic }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-foreground">{topic.topic}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LevelBadge level={topic.currentLevel} />
          <span>→</span>
          <LevelBadge level={topic.requiredLevel} />
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{topic.recommendation}</p>
    </div>
  );
}

export function InterviewFocus({ topics }: { topics: InterviewTopic[] }) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const items = topics.filter((t) => t.priority === group.key);
        if (items.length === 0) return null;
        const Icon = group.icon;
        return (
          <Card key={group.key} className={cn("border p-5", group.ring)}>
            <div className={cn("flex items-center gap-2 font-semibold", group.accent)}>
              <Icon className="h-5 w-5" />
              {group.title}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {items.map((t) => (
                <TopicRow key={t.topic} topic={t} />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
