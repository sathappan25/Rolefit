import type { AnalysisStage, CareerAnalysis } from "./types";
import { mockAnalysis } from "./mock-data";
import { nameFromResumeFilename } from "@/lib/storage/resume-storage";

/**
 * Provider-agnostic AI analysis contract.
 *
 * The UI depends only on this interface — never on a concrete AI provider.
 * To integrate a real backend (OpenAI, Anthropic, a custom endpoint, etc.),
 * implement `AiAnalysisProvider` and register it in `getAiService()`.
 */
export interface AiAnalysisProvider {
  analyzeResume(file: File): Promise<CareerAnalysis>;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

/** Ordered stages surfaced to the user during analysis. */
export const ANALYSIS_STAGES: AnalysisStage[] = [
  { id: "upload", label: "Resume uploaded" },
  { id: "extract", label: "Resume text extracted" },
  { id: "skills", label: "Skills identified" },
  { id: "roles", label: "Matching job roles" },
  { id: "plan", label: "Building interview plan" },
];

export type AiErrorCode =
  | "invalid-file"
  | "unsupported-format"
  | "empty-resume"
  | "parse-failure"
  | "analysis-failure"
  | "network"
  | "session-expired";

export class AiError extends Error {
  code: AiErrorCode;
  constructor(code: AiErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "AiError";
  }
}

/** Human-readable, never-raw error messages for the UI. */
export const ERROR_MESSAGES: Record<AiErrorCode, string> = {
  "invalid-file": "We couldn't read that file. Please choose a valid resume file.",
  "unsupported-format": "That format isn't supported. Please upload a PDF, DOC, or DOCX.",
  "empty-resume": "This resume appears to be empty. Please upload a resume with content.",
  "parse-failure": "We couldn't extract text from this resume. Try a different file or format.",
  "analysis-failure": "Something went wrong while analyzing your resume. Please try again.",
  network: "We're having trouble connecting. Check your connection and try again.",
  "session-expired": "Your session expired. Please sign in again to continue.",
};

export function validateResumeFile(file: File | null | undefined): AiError | null {
  if (!file) return new AiError("invalid-file", ERROR_MESSAGES["invalid-file"]);
  const name = file.name.toLowerCase();
  const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidType = file.type === "" || ACCEPTED_TYPES.includes(file.type);
  if (!hasValidExt || !hasValidType) {
    return new AiError("unsupported-format", ERROR_MESSAGES["unsupported-format"]);
  }
  if (file.size === 0) {
    return new AiError("empty-resume", ERROR_MESSAGES["empty-resume"]);
  }
  if (file.size > MAX_FILE_SIZE) {
    return new AiError("invalid-file", "This file is too large. Please upload a resume under 5MB.");
  }
  return null;
}

/**
 * Development-only mock provider. Returns realistic structured data after a
 * short delay so the UI's loading and animation states can be exercised.
 *
 * IMPORTANT: This is clearly isolated. Replace with a real provider for production.
 */
class MockAiProvider implements AiAnalysisProvider {
  async analyzeResume(file: File): Promise<CareerAnalysis> {
    const invalid = validateResumeFile(file);
    if (invalid) throw invalid;
    await new Promise((r) => setTimeout(r, 600));

    // Prefer a name grounded in the uploaded resume filename when available.
    // Real AI providers should extract candidateName from resume text instead.
    const extractedName = nameFromResumeFilename(file.name);
    return {
      ...mockAnalysis,
      candidateName: extractedName || mockAnalysis.candidateName,
    };
  }
}

let provider: AiAnalysisProvider = new MockAiProvider();

/** Swap the provider (e.g. inject a real backend) without touching the UI. */
export function setAiProvider(next: AiAnalysisProvider) {
  provider = next;
}

export function getAiService(): AiAnalysisProvider {
  return provider;
}
