import mammoth from "mammoth";

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";

  if (ext === "pdf") {
    // pdf-parse has a known test-file side effect; use dynamic import in Node only.
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return (result.text ?? "").trim();
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return (result.value ?? "").trim();
  }

  if (ext === "doc") {
    // Legacy .doc — attempt mammoth; may fail for binary .doc format.
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result.value?.trim()) return result.value.trim();
    } catch {
      // fall through
    }
    throw new Error("unsupported-format");
  }

  throw new Error("unsupported-format");
}
