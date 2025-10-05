
import { Octokit } from "@octokit/rest";

export async function getChangedFiles(octokit: Octokit, owner: string, repo: string, pull_number: number) {
  const { data } = await octokit.pulls.listFiles({ owner, repo, pull_number });
  return data.filter(file => file.patch); // only files with diffs
}

export async function postInlineComment(octokit: Octokit, params: {
  owner: string;
  repo: string;
  pull_number: number;
  commit_id: string;
  path: string;
  position: number;
  body: string;
}) {
  await octokit.pulls.createReviewComment(params);
}
