# 🤖 AI PR Coding Assistant

An **AI-powered Pull Request Reviewer** that automatically analyzes code changes when a PR is opened and posts feedback.  
Built with **Node.js**, **Express**, **GitHub Apps API**, and **OpenAI** (planned for Week 2+).  

---

## 📌 Features (Week 1 Milestone ✅)
- ✅ GitHub App integration
- ✅ Webhook server receives PR events
- ✅ Logs PR details (title, number, author, URL)
- 🚧 Next: fetch code diffs and run AI review (Week 2+)

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express  
- **GitHub API**: Octokit (GitHub App authentication)  
- **Tunneling**: Cloudflare Tunnel (or ngrok)  
- **AI**: OpenAI GPT models (planned)  

---

## ⚡ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/ai-pr-coding-assistant.git
cd ai-pr-coding-assistant
```

### 2. Install 
```bash
npm install
```

### 3. Setup Environment Variables
```bash
PORT=5000
GITHUB_APP_ID=123456
GITHUB_WEBHOOK_SECRET=supersecret123
GITHUB_PRIVATE_KEY_PATH=./ai-pr-assistant.pem
OPENAI_API_KEY=sk-xxxx
```

### 4. Start the server
```bash
npm run dev
```

### 5. Expose to github (webhook testing)
```bash
cloudflared tunnel --url http://localhost:5000
```
