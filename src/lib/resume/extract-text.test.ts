import { describe, it, expect } from "vitest";
import { extractTextFromBuffer } from "./extract-text";

/** Minimal valid PDF with embedded text for extraction tests. */
function makeSamplePdf(text: string): Buffer {
  const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`;
  const content = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length ${stream.length}>>stream
${stream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000341 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
590
%%EOF`;
  return Buffer.from(content);
}

describe("extractTextFromBuffer", () => {
  it("extracts text from a PDF buffer", async () => {
    const buffer = makeSamplePdf("Jane Smith Software Engineer React Node");
    const text = await extractTextFromBuffer(buffer, "resume.pdf");
    expect(text).toContain("Jane Smith");
    expect(text).toContain("Software Engineer");
  });

  it("rejects unsupported file extensions", async () => {
    const buffer = Buffer.from("plain text");
    await expect(extractTextFromBuffer(buffer, "notes.txt")).rejects.toThrow(
      "unsupported-format",
    );
  });
});
