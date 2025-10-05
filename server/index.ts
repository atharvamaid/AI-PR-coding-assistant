import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { getInstallationOctokit } from "./githubAuth";
import { reviewInlinePR, runMultiAgentReview } from "./reviewAgent";
import { getChangedFiles } from "./utils/githubUtils";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const verifySignature = (req: any) => {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET ?? "");
  const digest = `sha256=${hmac
    .update(JSON.stringify(req.body))
    .digest("hex")}`;
  return signature === digest;
};

app.post("/webhook", async (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.headers["x-github-event"];
  const action = req.body.action;

  console.log(`Event: ${event}, Action: ${action}`);

  if (
    event === "pull_request" &&
    (action === "opened" || action === "synchronize")
  ) {
    const { number, head } = req.body.pull_request;
    const owner = req.body.repository.owner.login;
    const repo = req.body.repository.name;
    const installationId = req.body.installation.id;

    try {
      // Authenticate
      const octokit = await getInstallationOctokit(installationId);

      // Fetch changed files
      const files = await getChangedFiles(octokit, owner, repo, number);

      // Run AI review
      await reviewInlinePR(octokit, owner, repo, number, files, head.sha);

      // Combine all diffs for multi-agent
      const fullDiff = files.map((f) => f.patch).join("\n");
      await runMultiAgentReview(octokit, owner, repo, number, fullDiff);

      console.log(`Posted AI review on PR #${number}`);
    } catch (err) {
      console.error("Error processing webhook:", err);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
