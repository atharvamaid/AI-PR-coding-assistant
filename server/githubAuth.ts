// server/githubAuth.ts
import fs from "fs";
import jwt from "jsonwebtoken";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const privateKey = fs.readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH ?? "", "utf8");

function createAppJwt() {
  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 600,
    iss: process.env.GITHUB_APP_ID,
  };
  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

export async function getInstallationOctokit(installationId: number) {
  const appOctokit = new Octokit({ auth: createAppJwt() });

  const tokenResp = await appOctokit.request(
    "POST /app/installations/{installation_id}/access_tokens",
    { installation_id: installationId }
  );

  return new Octokit({ auth: tokenResp.data.token });
}
