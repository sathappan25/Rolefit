import type { CareerAnalysis } from "@/lib/ai/types";
import type { ParsedResume } from "./parse-resume";
import { buildAnalysisFromResume } from "./build-analysis";

const SYSTEM_PROMPT = `You are RoleFit's resume analysis engine. You MUST follow these rules strictly:
- NEVER invent skills, companies, projects, certifications, experience, or education.
- Only include information explicitly present in the resume text.
- Mark missing fields as "Not Found".
- Distinguish "found" (explicit in resume), "inferred" (from project context only), "not-found".
- Return ONLY valid JSON matching the CareerAnalysis schema structure.
- Keep recommendedRoles as an array of up to 5 roles with honest match scores based on skill overlap.`;

/**
 * Optional OpenAI-enhanced analysis. Falls back to heuristic builder on failure.
 * Requires OPENAI_API_KEY environment variable.
 */
export async function analyzeWithOpenAI(
  parsed: ParsedResume,
  heuristic: CareerAnalysis,
): Promise<CareerAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return heuristic;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Resume text:\n\n${parsed.rawText.slice(0, 12000)}\n\nHeuristic baseline (use as floor, improve honestly):\n${JSON.stringify(heuristic).slice(0, 4000)}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) return heuristic;

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return heuristic;

    const enhanced = JSON.parse(content) as CareerAnalysis;
    // Safety: never allow empty candidate if heuristic found one
    if (parsed.candidateName !== "Not Found" && enhanced.candidateName === "Not Found") {
      enhanced.candidateName = parsed.candidateName;
    }
    return enhanced;
  } catch {
    return heuristic;
  }
}
