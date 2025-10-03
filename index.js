import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const verifySignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = `sha256=${hmac
    .update(JSON.stringify(req.body))
    .digest("hex")}`;
  return signature === digest;
};

app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.headers["x-github-event"];
  const action = req.body.action;

  console.log(`📩 Event: ${event}, Action: ${action}`);

  if (event === "pull_request" && (action === "opened" || action === "synchronize")) {
    const pr = req.body.pull_request;
    const repo = req.body.repository.full_name;

    console.log(`🔹 New PR in ${repo}`);
    console.log(`PR #${pr.number} by ${pr.user.login}`);
    console.log(`Title: ${pr.title}`);
    console.log(`URL: ${pr.html_url}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
