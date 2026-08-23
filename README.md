# RoleFit — AI-Powered Career Intelligence Platform

**Know your fit. Know your role. Ace your interview.**

RoleFit is a premium, AI-powered career platform. Upload a resume and get resume
quality analysis, best-fit roles, role match percentages, skill gaps, a prioritized
interview preparation plan, personalized & project-specific interview questions, and a
career roadmap.

## Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with a restrained, single-accent design system
- **unpdf** + **mammoth** for real resume text extraction (PDF/DOCX)
- **Optional OpenAI** enhancement via `OPENAI_API_KEY`
- **Vitest** for unit tests
- **Recharts** for data visualization

## Getting Started

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo flow

1. Landing page → **Analyze My Resume**
2. **Resume Analyzer** → upload a PDF/DOC/DOCX
3. Backend extracts text, parses skills/experience/projects, matches roles
4. Explore **Analysis**, **My Roles**, **Skill Gaps**, **Interview Prep**, etc.

### Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run test     # unit tests
npm run lint     # ESLint
```

## Architecture

### Real resume pipeline

1. **`POST /api/analyze`** — accepts resume file upload
2. **`extract-text.ts`** — PDF (unpdf) / DOCX (mammoth) text extraction
3. **`parse-resume.ts`** — extracts name, skills, education, experience, projects from text only
4. **`build-analysis.ts`** — role matching, scores, gaps, interview plan
5. **`openai-analyze.ts`** — optional GPT enhancement when `OPENAI_API_KEY` is set

The UI consumes a typed `CareerAnalysis` contract via `createApiAiProvider()`.

### AI grounding rules

RoleFit never invents skills, companies, projects, certifications, experience, or
education. Every extracted item is labeled honestly:

- **Found in Resume**
- **Inferred from Project**
- **Not Found**

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | No | Enables optional GPT-enhanced analysis |
| `OPENAI_MODEL` | No | Default: `gpt-4o-mini` |

## Project Structure

```
src/
  app/api/analyze/     # resume analysis API route
  lib/
    resume/            # text extraction, parsing, analysis engine
    ai/                # types, API provider, service
    storage/           # IndexedDB resume persistence
  components/          # UI components
```
