# 🤖 AI PR Coding Assistant

An **AI-powered GitHub App** that automatically reviews Pull Requests — analyzing code changes, detecting potential issues, and posting intelligent feedback comments directly on GitHub.

Built with **Node.js**, **Express**, **Octokit (GitHub API)**, and **OpenAI GPT**.

---

## 🚀 Overview

Whenever a developer opens a new Pull Request (PR):

1. GitHub triggers a **Webhook event**.
2. The app receives the event and authenticates as a **GitHub App** using a **JWT**.
3. It exchanges the JWT for a **repo-scoped Installation Access Token**.
4. The server fetches **changed files/diffs** from the PR.
5. The **OpenAI API** analyzes the changes and generates review feedback.
6. The app posts this AI-generated review **as a comment directly on the PR** 🎯


---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend Framework** | Node.js + Express |
| **Language** | TypeScript |
| **GitHub Integration** | Octokit SDK + GitHub App API |
| **AI Model** | OpenAI GPT-4o-mini |
| **Authentication** | JWT (App identity) + Installation Access Token (repo access) |
| **Tunnel** | Cloudflare Tunnel (for localhost webhook exposure) |
| **Environment Management** | dotenv |

---

---

## ⚡ Setup Instructions

### Clone the Repo
```bash
git clone https://github.com/your-username/ai-pr-coding-assistant.git
cd ai-pr-coding-assistant
```

### npm install
```bash
npm install
```







