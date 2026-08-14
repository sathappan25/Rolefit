import { Upload, Cpu, Target, MessageSquareText } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Upload Resume",
    description: "Add your resume in PDF, DOC, or DOCX. It stays grounded to your real experience.",
    icon: Upload,
  },
  {
    num: "02",
    title: "AI Analyzes Your Profile",
    description: "RoleFit extracts skills, projects, and experience — never inventing details.",
    icon: Cpu,
  },
  {
    num: "03",
    title: "Discover Your Best-Fit Roles",
    description: "See ranked role matches with clear reasons and the gaps to close.",
    icon: Target,
  },
  {
    num: "04",
    title: "Prepare for Your Interview",
    description: "Get a prioritized plan with personalized, project-specific questions.",
    icon: MessageSquareText,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t bg-secondary/30 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How RoleFit Works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From resume to interview-ready in four steps
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-sm font-bold text-primary/60">Step {step.num}</span>
              <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-6 translate-x-full bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
