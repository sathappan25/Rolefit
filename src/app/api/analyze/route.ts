import { NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/resume/extract-text";
import { parseResumeText } from "@/lib/resume/parse-resume";
import { buildAnalysisFromResume } from "@/lib/resume/build-analysis";
import { analyzeWithOpenAI } from "@/lib/resume/openai-analyze";
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
} from "@/lib/ai/service";

export const runtime = "nodejs";
export const maxDuration = 60;

const ERROR_MAP: Record<string, { code: string; message: string; status: number }> = {
  "unsupported-format": {
    code: "unsupported-format",
    message: "That format isn't supported. Please upload a PDF, DOC, or DOCX.",
    status: 400,
  },
  "empty-resume": {
    code: "empty-resume",
    message: "This resume appears to be empty. Please upload a resume with content.",
    status: 400,
  },
  "parse-failure": {
    code: "parse-failure",
    message: "We couldn't extract text from this resume. Try a different file or format.",
    status: 422,
  },
};

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { code: "invalid-file", message: "No resume file provided." },
        { status: 400 },
      );
    }

    const name = file.name.toLowerCase();
    const validExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!validExt) {
      return NextResponse.json(
        { code: "unsupported-format", message: ERROR_MAP["unsupported-format"].message },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          code: "invalid-file",
          message: file.size === 0 ? ERROR_MAP["empty-resume"].message : "File too large (max 5MB).",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;

    try {
      text = await extractTextFromBuffer(buffer, file.name);
    } catch (err) {
      console.error("[analyze] text extraction failed:", err);
      const key = err instanceof Error && ERROR_MAP[err.message] ? err.message : "parse-failure";
      const mapped = ERROR_MAP[key] ?? ERROR_MAP["parse-failure"];
      return NextResponse.json({ code: mapped.code, message: mapped.message }, { status: mapped.status });
    }

    if (!text || text.replace(/\s/g, "").length < 50) {
      return NextResponse.json(
        { code: "empty-resume", message: ERROR_MAP["empty-resume"].message },
        { status: 400 },
      );
    }

    const parsed = parseResumeText(text);
    const heuristic = buildAnalysisFromResume(parsed);
    const analysis = await analyzeWithOpenAI(parsed, heuristic);

    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(
      {
        code: "analysis-failure",
        message: "Something went wrong while analyzing your resume. Please try again.",
      },
      { status: 500 },
    );
  }
}
