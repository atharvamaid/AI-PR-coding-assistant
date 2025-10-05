import { securityPrompt } from "../constants/prompts";
import { openai } from "../reviewAgent";

export async function runSecurityAgent(diff: string) {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: securityPrompt },
      { role: "user", content: diff },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content?.trim();
}