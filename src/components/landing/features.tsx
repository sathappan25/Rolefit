import {
  FileSearch,
  Target,
  TrendingUp,
  MessageSquareText,
  FolderGit2,
  Map,
} from "lucide-react";

const features = [
  {
    title: "Resume Intelligence",
    description: "Analyze your resume and identify strengths and weaknesses.",
    icon: FileSearch,
  },
  {
    title: "Role Matching",
    description: "Discover which positions match your current profile.",
    icon: Target,
  },
  {
    title: "Skill Gap Analysis",
    description: "See what skills you need to improve for your target role.",
    icon: TrendingUp,
  },
  {
    title: "Interview Intelligence",
    description: "Know exactly what topics and questions to prepare.",
    icon: MessageSquareText,
  },
  {
    title: "Project Analysis",
    description: "Understand what interviewers may ask about your projects.",
    icon: FolderGit2,
  },
  {
    title: "Career Roadmap",
    description: "Get a personalized path toward your target role.",
    icon: Map,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to land the right role
          </h2>
          <p className="mt-3 text-muted-foreground">
            A complete career intelligence toolkit — grounded entirely in your resume.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
