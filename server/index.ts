import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { getInstallationOctokit } from "./githubAuth";
import { reviewChanges } from "./reviewAgent";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const verifySignature = (req:any) => {
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

  if (event === "pull_request" && (action === "opened" || action === "synchronize")) {
    const { number } = req.body.pull_request;
    const owner = req.body.repository.owner.login;
    const repo = req.body.repository.name;
    const installationId = req.body.installation.id;

    try {
      // Authenticate
      const octokit = await getInstallationOctokit(installationId);

      // Fetch changed files
      const files = await octokit.pulls.listFiles({ owner, repo, pull_number: number });
      const diffs = files.data.map((f) => `### ${f.filename}\n${f.patch || ""}`).join("\n\n");

      // Run AI review
      const feedback = await reviewChanges(diffs);

      // Post feedback to PR as comment
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: feedback,
        headers:{
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      console.log(`Posted AI review on PR #${number}`);
    } catch (err) {
      console.error("Error processing webhook:", err);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
