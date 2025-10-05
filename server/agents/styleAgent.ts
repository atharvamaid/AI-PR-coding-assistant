import { stylePrompt } from "../constants/prompts";
import { openai } from "../reviewAgent";

export async function runStyleAgent(diff: string) {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: stylePrompt },
      { role: "user", content: diff },
    ],
    temperature: 0.4,
  });

  return response.choices[0].message.content?.trim();
}