import { describe, it, expect } from "vitest";
import { validateResumeFile, AiError } from "./service";

function mockFile(name: string, size = 1024, type = ""): File {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type });
}

describe("validateResumeFile", () => {
  it("accepts valid PDF", () => {
    expect(validateResumeFile(mockFile("resume.pdf", 1024, "application/pdf"))).toBeNull();
  });

  it("rejects unsupported extension", () => {
    const err = validateResumeFile(mockFile("resume.txt"));
    expect(err).toBeInstanceOf(AiError);
    expect(err?.code).toBe("unsupported-format");
  });

  it("rejects empty file", () => {
    const err = validateResumeFile(mockFile("resume.pdf", 0));
    expect(err?.code).toBe("empty-resume");
  });

  it("rejects oversize file", () => {
    const err = validateResumeFile(mockFile("resume.pdf", 6 * 1024 * 1024));
    expect(err?.code).toBe("invalid-file");
  });
});
