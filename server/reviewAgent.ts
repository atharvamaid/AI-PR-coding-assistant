// server/reviewAgent.ts
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const modelName = "gpt-4o-mini";

export const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

export async function reviewChanges(diff: string) {
  const prompt = `
You are a lead software engineer reviewing a Pull Request.

Here are the code changes:
${diff}

Please:
1. Summarize what was changed.
2. Identify potential issues or bad practices.
3. Suggest improvements or best practices.

Format response in clear Markdown with headings.
`;

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0]?.message?.content ?? "No feedback generated.";
}
