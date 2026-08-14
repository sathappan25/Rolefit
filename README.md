# RoleFit — AI-Powered Career Intelligence Platform

**Know your fit. Know your role. Ace your interview.**

RoleFit is a premium, AI-powered career platform. Upload a resume and get resume
quality analysis, best-fit roles, role match percentages, skill gaps, a prioritized
interview preparation plan, personalized & project-specific interview questions, and a
career roadmap.

## Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with a restrained, single-accent design system
- **shadcn/ui-style** reusable components (hand-authored, no runtime lock-in)
- **Lucide** icons
- **Recharts** for data visualization

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo flow

1. Landing page → **Get started / Analyze My Resume**
2. **Resume Analyzer** → upload a PDF/DOC/DOCX → animated analysis
3. Explore **Analysis**, **My Roles**, **Skill Gaps**, **Interview Prep**,
   **My Projects**, **Career Roadmap**, and **Improve Resume**

## Architecture

The UI is fully decoupled from any AI provider.

- `src/lib/ai/types.ts` — the structured data contract the UI consumes.
- `src/lib/ai/service.ts` — a provider-agnostic `AiAnalysisProvider` interface,
  file validation, analysis stages, and human-readable error handling.
- `src/lib/ai/mock-data.ts` — **development-only** mock data, clearly isolated.
- `src/lib/store/app-store.tsx` — client analysis state with persistence.

### Plugging in a real AI backend

Implement the interface and register it — no UI changes required:

```ts
import { setAiProvider, type AiAnalysisProvider } from "@/lib/ai/service";
import type { CareerAnalysis } from "@/lib/ai/types";

class RealAiProvider implements AiAnalysisProvider {
  async analyzeResume(file: File): Promise<CareerAnalysis> {
    const body = new FormData();
    body.append("resume", file);
    const res = await fetch("/api/analyze", { method: "POST", body });
    if (!res.ok) throw new Error("analysis-failure");
    return res.json();
  }
}

setAiProvider(new RealAiProvider());
```

## AI Grounding Rules

RoleFit never invents skills, companies, projects, certifications, experience, or
education. Every extracted item is labeled honestly:

- **Found in Resume**
- **Inferred from Project**
- **Not Found**

## Responsive & Accessible

- Desktop sidebar, tablet-friendly layout, mobile hamburger + bottom navigation.
- Semantic HTML, keyboard navigation, ARIA labels, visible focus states, good contrast.

## Project Structure

```
src/
  app/                # routes (landing and dashboard/*)
  components/
    ui/               # reusable primitives (button, card, tabs, ...)
    layout/           # sidebar, topbar, mobile nav
    landing/          # landing page sections
    dashboard/        # dashboard domain components
    analyzer/         # resume upload + analysis states
    interview/        # interview question components
    shared/           # page header, empty states, badges
  lib/
    ai/               # types, service abstraction, mock data
    store/            # client app store
```
