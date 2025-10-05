# 🤖 AI PR Coding Assistant

An **AI-powered GitHub App** that automatically reviews Pull Requests — analyzing code changes, detecting potential issues, and posting intelligent feedback comments line by line on the files directly on GitHub.

Built with **Node.js**, **Express**, **Octokit (GitHub API)**, and **OpenAI GPT**.

---

## 🚀 Overview

Whenever a developer opens a new Pull Request (PR):

1. GitHub triggers a **Webhook event**.
2. The app receives the event and authenticates as a **GitHub App** using a **JWT**.
3. It exchanges the JWT for a **repo-scoped Installation Access Token**.
4. The server fetches **changed files/diffs** from the PR.
5. The **OpenAI API** analyzes the changes and generates review feedback.
6. The app posts this AI-generated review **as a line by line review comment directly on the PR** 🎯


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

### Create .env file
```bash
PORT=5000
GITHUB_APP_ID=<your_app_id>
GITHUB_WEBHOOK_SECRET=<your_webhook_secret>
GITHUB_PRIVATE_KEY_PATH=./ai-pr-assistant.pem
OPENAI_API_KEY=sk-xxxx
```

### Start development server
```bash
npm run dev
```

### Expose localhost to github
```bash
cloudflared tunnel --url http://localhost:5000
```
Copy the generated public URL and paste it into your GitHub App’s Webhook URL field.

---

## 🧠 How It Works
1. When a Pull Request is opened or updated,
   GitHub sends a webhook event to your Express server.
2. The server:
    Verifies the webhook signature (x-hub-signature-256)
    Authenticates using JWT + installation access token
    Fetches changed files and diff patches
3. The AI reviewer system:
    Sends each diff chunk to OpenAI
    Each agent (Security, Performance, Style, Docs) analyzes the diff
    Comments inline or generates an overall summary
4. The assistant posts comments directly on GitHub using Octokit.

---

## 🚀 Future Improvements
1. 🧾 GitHub Action integration for CI/CD
2. 📊 PR quality scoring (based on AI feedback)
3. 💾 Dashboard UI for tracking AI reviews
4. 🧩 Caching and retry logic for rate limits
5. ⚡ Fine-tuned review agents (custom OpenAI fine-tuning)


---

## 🧑‍💻 Contributing
Contributions are welcome!
Feel free to fork this repo, create a feature branch, and open a PR.


