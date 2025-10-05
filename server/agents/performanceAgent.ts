import { performancePrompt } from "../constants/prompts";
import { openai } from "../reviewAgent";

export async function runPerformanceAgent(diff: string) {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: performancePrompt },
      { role: "user", content: diff },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content?.trim();
}