import Link from "next/link";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-pattern opacity-[0.6] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered career intelligence
          </div>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find the role you&apos;re{" "}
            <span className="text-primary">actually built for.</span>
          </h1>
          <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            Upload your resume and let RoleFit analyze your skills, identify your best-fit roles,
            uncover skill gaps, and build a personalized interview preparation plan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/resume-analyzer" className={cn(buttonVariants({ size: "lg" }))}>
              Analyze My Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              <PlayCircle className="h-4 w-4" />
              See How It Works
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "12+", v: "Role matches" },
              { k: "40+", v: "Interview topics" },
              { k: "100%", v: "Resume-grounded" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-bold text-foreground">{s.k}</dt>
                <dd className="text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-scale-in lg:pl-6">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
