import { NextResponse } from "next/server";
import type { CareerAnalysis, InterviewQuestion, QuestionCategory } from "@/lib/ai/types";
import { buildDailyQuestionSet, todayDateKey } from "@/lib/resume/daily-questions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = body?.analysis as CareerAnalysis | undefined;

    if (!analysis?.bestRole?.id) {
      return NextResponse.json(
        { code: "invalid-request", message: "Career analysis with best role is required." },
        { status: 400 },
      );
    }

    const dateKey = typeof body?.date === "string" ? body.date : todayDateKey();
    const daily = buildDailyQuestionSet(analysis, dateKey);

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const enhanced = await enhanceDailyWithOpenAI(analysis, daily, apiKey);
        return NextResponse.json(enhanced);
      } catch {
        // fall through to heuristic daily set
      }
    }

    return NextResponse.json(daily);
  } catch {
    return NextResponse.json(
      { code: "generation-failure", message: "Could not generate today's questions." },
      { status: 500 },
    );
  }
}

async function enhanceDailyWithOpenAI(
  analysis: CareerAnalysis,
  baseline: ReturnType<typeof buildDailyQuestionSet>,
  apiKey: string,
) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You generate daily interview practice questions for RoleFit.
Rules:
- NEVER invent skills, companies, projects, or experience not in the resume context.
- Questions must be tailored to the candidate's best-fit role.
- Return JSON: { "questions": [{ "question", "category", "difficulty", "topic", "relatedTo?" }] }
- Categories: technical, resume, projects, hr, role-specific
- Difficulty: Easy, Medium, Hard
- Generate exactly ${baseline.questions.length} unique questions for today.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            date: baseline.date,
            bestRole: analysis.bestRole,
            skills: analysis.skills.map((s) => s.name),
            experience: analysis.experience,
            projects: analysis.projects.map((p) => p.name),
            skillGaps: analysis.skillGaps.map((g) => g.skill),
            baselineQuestions: baseline.questions.map((q) => q.question),
          }),
        },
      ],
    }),
  });

  if (!res.ok) return baseline;

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return baseline;

  const parsed = JSON.parse(content) as {
    questions: Array<{
      question: string;
      category: string;
      difficulty: string;
      topic: string;
      relatedTo?: string;
    }>;
  };

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) return baseline;

  return {
    ...baseline,
    questions: parsed.questions.slice(0, baseline.questions.length).map((q, i) => ({
      id: `daily-${baseline.date}-${i + 1}`,
      question: q.question,
      category: q.category as QuestionCategory,
      difficulty: q.difficulty as InterviewQuestion["difficulty"],
      topic: q.topic,
      relatedTo: q.relatedTo,
    })),
  };
}
