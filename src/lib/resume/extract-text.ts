import mammoth from "mammoth";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return (text ?? "").trim();
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";

  if (ext === "pdf") {
    return extractPdfText(buffer);
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
