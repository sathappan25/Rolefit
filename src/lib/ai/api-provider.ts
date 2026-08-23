import type { CareerAnalysis } from "./types";
import {
  AiError,
  ERROR_MESSAGES,
  validateResumeFile,
  type AiAnalysisProvider,
  type AiErrorCode,
} from "./service";

/** Calls the Next.js /api/analyze endpoint with the uploaded resume file. */
export function createApiAiProvider(): AiAnalysisProvider {
  return {
    async analyzeResume(file: File): Promise<CareerAnalysis> {
      const invalid = validateResumeFile(file);
      if (invalid) throw invalid;

      let response: Response;
      try {
        const body = new FormData();
        body.append("resume", file);
        response = await fetch("/api/analyze", { method: "POST", body });
      } catch {
        throw new AiError("network", ERROR_MESSAGES.network);
      }

      if (!response.ok) {
        let code: AiErrorCode = "analysis-failure";
        let message = ERROR_MESSAGES["analysis-failure"];
        try {
          const err = await response.json();
          if (err.code && err.code in ERROR_MESSAGES) {
            code = err.code as AiErrorCode;
            message = err.message ?? ERROR_MESSAGES[code];
          }
        } catch {
          // use defaults
        }
        throw new AiError(code, message);
      }

      return response.json() as Promise<CareerAnalysis>;
    },
  };
}
