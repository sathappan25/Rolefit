"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Does RoleFit invent skills or experience?",
    a: "Never. RoleFit only works with what's actually in your resume. Anything not present is clearly marked as 'Not Found', and skills implied by a project are labeled 'Inferred from Project'.",
  },
  {
    q: "What file formats are supported?",
    a: "You can upload PDF, DOC, and DOCX files up to 5MB.",
  },
  {
    q: "How are role matches calculated?",
    a: "RoleFit compares your extracted skills, experience, and projects against the requirements of each role and produces a transparent match score with reasons.",
  },
  {
    q: "Is my data secure?",
    a: "Your resume is processed for analysis only. The AI provider is fully replaceable, so teams can run RoleFit against their own secure backend.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="border-t bg-secondary/30 py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-xl border bg-card">
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-foreground">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
