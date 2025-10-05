import OpenAI from "openai";
import dotenv from "dotenv";
import { postInlineComment } from "./utils/githubUtils";
import { Octokit } from "@octokit/rest";
import { runSecurityAgent } from "./agents/securityAgent";
import { runPerformanceAgent } from "./agents/performanceAgent";
import { runStyleAgent } from "./agents/styleAgent";
import { endpoint, modelName, token } from "./constants/common";
import { INLINE_REVIEW_PROMPT } from "./constants/prompts";

dotenv.config();

export const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

export async function reviewInlinePR(
  octokit: Octokit,
  owner: string,
  repo: string,
  pull_number: number,
  files: any,
  commit_id: string
) {
  for (const file of files) {
    const { filename, patch } = file;
    const diffLines = patch.split("\n");
    let position = 0;

    for (const line of diffLines) {
      position++;
      // Only analyze added lines
      if (line.startsWith("+") && !line.startsWith("+++")) {
        const response = await openai.chat.completions.create({
          model: modelName,
          messages: [
            { role: "system", content: INLINE_REVIEW_PROMPT },
            { role: "user", content: `File: ${filename}\nCode:\n${line}` },
          ],
          temperature: 0.3,
        });

        const comment = response.choices[0].message.content?.trim();
        if (comment && !comment.includes("No critical feedback")) {
          await postInlineComment(octokit, {
            owner,
            repo,
            pull_number,
            commit_id,
            path: filename,
            position,
            body: `**AI Suggestion:** ${comment}`,
          });
        }
      }
    }
  }
}

export async function runMultiAgentReview(
  octokit: Octokit,
  owner: string,
  repo: string,
  pull_number: number,
  diff: string
) {
  const [security, performance, style] = await Promise.all([
    runSecurityAgent(diff),
    runPerformanceAgent(diff),
    runStyleAgent(diff),
  ]);

  const combinedFeedback = `
# Multi-Agent Code Review Summary

## Security Review
${security}

## Performance Review
${performance}

## Style & Readability
${style}
`;

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: combinedFeedback,
  });
}
