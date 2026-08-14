import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-xl sm:px-12">
          <div className="absolute inset-0 grid-pattern opacity-10" aria-hidden="true" />
          <h2 className="relative text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Know your fit. Know your role. Ace your interview.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-balance text-primary-foreground/80">
            Join RoleFit and turn your resume into a clear, actionable career plan.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              href="/dashboard/resume-analyzer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-primary hover:bg-white/90",
              )}
            >
              Analyze My Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
