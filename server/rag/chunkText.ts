import fs from "fs/promises";

/**
 * Naive chunker that splits by newline boundaries, tries to keep functions intact.
 * Returns array of strings (chunks).
 */
export function chunkText(text: string, chunkSize = 1200, overlap = 200): string[] {
  const chunks: string[] = [];
  if (!text) return chunks;

  // split by lines to avoid cutting in middle of lines
  const lines = text.split("\n");
  let current = "";
  for (const line of lines) {
    if ((current + "\n" + line).length > chunkSize) {
      // push current
      chunks.push(current.trim());
      // keep overlap lines
      const overlapText = current.slice(-overlap);
      current = overlapText + "\n" + line;
    } else {
      current = current ? current + "\n" + line : line;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** utility to read file and chunk */
export async function chunkFile(path: string, chunkSize?: number, overlap?: number) {
  const content = await fs.readFile(path, "utf8");
  return chunkText(content, chunkSize, overlap);
}
