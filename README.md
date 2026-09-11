# NudgePath

<p align="center"><strong>The developer-grade, self-hosted career companion & AI job tracker with instant mobile pairing</strong></p>

<p align="center">
  <a href="#1-click-cloud-deployment">1-Click Cloud Deploy</a> ·
  <a href="#quick-start-docker">Local Docker</a> ·
  <a href="#mobile-app--qr-pairing">Mobile Pairing</a> ·
  <a href="#ai-assistant--byok">BYOK AI</a> ·
  <a href="#mcp-server-integration">MCP Setup</a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/ezykl/NudgePath" alt="License"></a>
  <a href="https://github.com/ezykl/NudgePath/stargazers"><img src="https://img.shields.io/github/stars/ezykl/NudgePath?style=social" alt="GitHub Stars"></a>
  <img src="https://img.shields.io/badge/self--hosted-Docker-blue" alt="Self-hosted with Docker">
  <img src="https://img.shields.io/badge/mobile-iOS%20%26%20Android-emerald" alt="iOS & Android Mobile">
  <img src="https://img.shields.io/badge/ui-Coolicons%20%26%20Geist-cyan" alt="Modern Developer UI">
</p>

NudgePath is a modern, developer-grade open-source career companion. Track applications across stages, manage and score tailored resumes, and automate job discovery — with an AI assistant that runs on your choice of cloud keys (Gemini, OpenAI, DeepSeek) or 100% offline with local Ollama.

Everything stays in your hands: self-host on your own machine with Docker, or launch a **free 24/7 cloud instance** on Railway/Render, and pair with the **NudgePath Mobile App** in seconds via QR code.

---

## 🚀 1-Click Cloud Deployment (Free 24/7 Uptime)

Don't want to keep your desktop PC running 24/7? Deploy NudgePath to cloud container hosts with persistent SQLite storage in one click:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/new/template?template=https%3A%2F%2Fgithub.com%2Fezykl%2FNudgePath)
&nbsp;&nbsp;
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ezykl/NudgePath)

### Cloud Configuration Notes:
- **Persistent Storage**: Mounts persistent volume at `/data` (`/data/dev.db`) so your SQLite database and uploaded resumes persist across restarts.
- **`AUTH_SECRET`**: Set a random 32-character secret string (e.g. `openssl rand -base64 32`).
- **`NEXTAUTH_URL`**: Set to your public domain (e.g., `https://your-nudgepath.up.railway.app`).

---

## ⚡ Quick Start (Local Docker)

Make sure [Docker](https://www.docker.com) is installed and running:

```sh
git clone https://github.com/ezykl/NudgePath.git
cd NudgePath
docker compose up
```

> **Note:** Initial startup builds the Docker image. Once initialized, visit [http://localhost:3737](http://localhost:3737) to create your admin user.

### Updating Local Instance:
Run the deployment script from your project directory:

```sh
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/ezykl/NudgePath/main/deploy.sh | sudo bash -s

# Windows (PowerShell)
.\deploy.ps1
```

---

## 📱 Mobile App & QR Pairing

NudgePath features a companion mobile app (iOS & Android) designed for quick application management, status updates, and interview prep on the go.

1. In NudgePath Web, navigate to **Settings > Mobile Pairing**.
2. Open the **NudgePath Mobile App** and tap **Scan Pairing QR**.
3. Point your camera at the QR code — your instance URL and secure auth token pair instantly.
4. **No accounts to configure, no third-party tracking, 100% private to your self-hosted server.**

---

## ✨ Key Features

- **Developer-Grade UI**: Built with Geist typography, micro-borders, and crisp [coolicons](https://github.com/krystonschwarze/coolicons) vector geometry. Zero playful emojis.
- **Bring Your Own Key (BYOK)**: Zero platform subscriptions or hidden AI markups. Enter your free Google Gemini, OpenAI, DeepSeek, or OpenRouter keys in Settings — or run 100% offline with local **Ollama**.
- **Automated Career Nudges**: Proactive dashboard nudges analyze your pipeline, highlight overdue follow-ups, and suggest immediate high-leverage actions.
- **Automated Discovery**: Tracks job postings from Greenhouse, Lever, and job boards on a schedule, auto-scoring matches against your resume.
- **PDF Resume Builder & Review**: Export clean Simple or Professional PDF resumes, import Word/PDF resumes, and receive ATS-aligned feedback.
- **MCP Server (Model Context Protocol)**: Connect Claude Desktop, Hermes, or OpenClaw to search, add, or analyze jobs straight from chat.

---

## 🤖 Supported AI Model Providers

Configure API keys under **Settings > AI Settings**:

- **Ollama (Local)**: 100% local and free. Tested with `qwen3.5:9b` and `deepseek-r1`.
- **Google Gemini**: Get key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Fast, affordable, and supports large 1M+ token context.
- **OpenAI**: Get key from [platform.openai.com](https://platform.openai.com). Supports GPT-4o / GPT-4.1.
- **DeepSeek**: Get key from [platform.deepseek.com](https://platform.deepseek.com). High performance reasoning models.
- **OpenRouter**: Access multiple models across providers.

---

## 🔌 MCP Server (AI Agent Integration)

Integrate with Claude Desktop or cursor-compatible agents:

1. Sign in to NudgePath and go to **Settings > MCP Access**.
2. Click **Generate Token**.
3. Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nudgepath": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://<your-nudgepath-url>/api/mcp",
        "--header",
        "Authorization: Bearer <your-token>"
      ]
    }
  }
}
```

---

## 📄 License & Credits

Released under the [MIT License](./LICENSE). Forked and evolved from [Gsync/jobsync](https://github.com/Gsync/jobsync).
Special thanks to the open-source community: [React](https://react.dev), [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [Prisma](https://prisma.io), [coolicons](https://github.com/krystonschwarze/coolicons), [Ollama](https://ollama.com).
