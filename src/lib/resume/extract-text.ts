import mammoth from "mammoth";

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";

  if (ext === "pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return (result.text ?? "").trim();
    } finally {
      await parser.destroy();
    }
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
