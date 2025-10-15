import { openai } from "../reviewAgent";

export async function embedTexts(inputs: string[], model = process.env.EMBED_MODEL || "text-embedding-3-small") {
  // inputs: array of strings
  // returns array of embeddings (number[])
  const results: number[][] = [];
  // batch safe: OpenAI embedding endpoint supports arrays
  const resp = await openai.embeddings.create({
    model,
    input: inputs,
  });
  // response.data is array of embedding objects
  for (const item of resp.data) {
    results.push(item.embedding);
  }
  return results;
}