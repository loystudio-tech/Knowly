<div align="center">

<img src="icons/icon-192.png" width="88" alt="Knowly">

# Knowly

**Your AI study companion. Free and open source.**

Upload photos of the whiteboard, textbook pages, PDFs or handwritten notes. Knowly sorts them by subject and builds study guides, flashcards, quizzes, mock exams, whiteboard lessons with voice, and podcasts.

It runs on **your own Anthropic (Claude) API key**. You pay only for what you use, usually $1–4 per month.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/loystudio-tech/Knowly)

[Features](#features) · [Setup](#setup) · [Desktop app](#desktop-app-mac-windows-linux) · [Privacy](#privacy-and-data) · [Cost](#cost) · [Contributing](#contributing) · [Español](README.es.md)

</div>

---

## Features

| | |
|---|---|
| 🧮 **Solver** | Solves problems step by step from text, a photo, a PDF or handwriting (Apple Pencil works too). You can ask follow-up questions about the solution. |
| 🧑‍🏫 **Whiteboard tutor** | A lesson that writes itself step by step, with drawings and a voice. |
| 📚 **Study sets** | Built from your files and sorted by subject automatically. Each set includes a study guide, review guide, flashcards, quiz, mock exam, cheat sheet, podcast and a chat tutor (voice supported). |
| 🔁 **Daily review** | Spaced repetition across all your flashcards, with a day streak and an activity heatmap. |
| 🎯 **Exam predictor** | Most likely topics, a day-by-day study plan, mock exams and a cheat sheet. |
| ✨ **Skills** (`/`) | Upload a PDF or photos with exercises solved your way (or your teacher's way). Knowly learns the method and applies it whenever you type `/skill-name`. It can also generate new exercises and teach the method on the whiteboard. |
| ⚡ **Automations** | "When I upload Math notes → create flashcards, a quiz and 5 exercises with my skill." Triggered when you upload material, add an exam, score low on a quiz, or every day. |
| ✍️ **Writing tools** | Proofreader, rewrite, paraphrase, summarize, citations (APA, MLA…) and text explainer. |
| 🎙️ **Live notes** | Transcribes a class with your microphone and turns it into study material. |
| 📅 **Calendar** | Homework and exams with reminders and a "Prepare with AI" button. |
| ⌘ **Command palette** | ⌘K / Ctrl+K to jump anywhere or run actions. |

Works on **Mac, PC, iPad and phone**. Installable as an app (PWA), with dark and light themes, and it opens offline.

> The app interface is currently in Spanish. The AI answers in the language of your material.

---

## Setup

Knowly runs **anywhere**: as a desktop app, in your browser, or on any host. You always use **your own Anthropic API key**. Create one at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) and set a monthly spending limit under **Settings → Limits** (for example, $10).

| I want to… | Use | Needs a server? |
|---|---|---|
| Use it as a **Mac / Windows / Linux app** | [Desktop app](#desktop-app-mac-windows-linux) | No |
| Try it in 1 minute | [Open `index.html` / GitHub Pages](#no-server-fastest) | No |
| Put it online for me or my class | [Netlify](#netlify) · [Vercel](#vercel) · [Cloudflare Pages](#cloudflare-pages) | Yes (included) |
| Host it on my own machine, VPS, Render, Railway… | [Node server](#any-node-host-render-railway-vps-docker) | Yes (included) |

There are two ways to connect the AI, and you can switch in **Ajustes** (Settings) at any time:

- **Server mode (recommended for sharing):** your API key lives in the host's environment variables and never reaches the browser. Set `ANTHROPIC_API_KEY` and `APP_PASSWORD` (a password you make up, so nobody else can spend your credit). Then enter that password in **Ajustes**.
- **Direct key mode (no server):** paste your API key in **Ajustes → Clave directa**. The key is stored only in your browser or app. Great for personal use; don't share that browser.

Everything uses the same `/api/ai` endpoint, so the app doesn't care which host you pick.

### Desktop app (Mac, Windows, Linux)

Download the latest `.dmg` (Mac), `.exe` (Windows) or `.AppImage` (Linux) from the [Releases](../../releases) page, open it and paste your key in **Ajustes → Clave directa**.

- **Mac:** the app is not signed by Apple, so the first time right-click it and choose **Open** (or **System Settings → Privacy & Security → Open Anyway**).
- Voice dictation (live notes with the microphone) may not work in the desktop app. For that, use the browser version installed as an app (see below). Spoken answers work everywhere.
- **Build it yourself:** `cd desktop && npm install && npm run dist` (the app appears in `desktop/dist`).
- **Publish your own release:** push a tag (`git tag v1.0.0 && git push --tags`). GitHub Actions builds all three apps and attaches them to a Release.

### No server (fastest)

1. Download the repo (**Code → Download ZIP**) and open `index.html` in Chrome or Safari. You can also host it for free on **GitHub Pages**.
2. In **Ajustes → Clave directa**, paste your API key.

### Netlify

Press the **Deploy to Netlify** button at the top (or **Add new site → Import from Git**). Set `ANTHROPIC_API_KEY` and `APP_PASSWORD` when asked. The proxy is `netlify/edge-functions/ai.js`.

> ⚠️ Dragging the folder into *Netlify Drop* does not work, because the AI function would not be published.

### Vercel

**Add New → Project → Import** this repo. Leave the build settings empty (framework "Other") and add `ANTHROPIC_API_KEY` and `APP_PASSWORD` under **Environment Variables**. The proxy is `api/ai.js`.

### Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git.** Leave the build command empty and set the output directory to `/`. Add `ANTHROPIC_API_KEY` and `APP_PASSWORD` under **Settings → Variables and Secrets**. The proxy is `functions/api/ai.js`.

### Any Node host (Render, Railway, VPS, Docker…)

```bash
git clone https://github.com/loystudio-tech/Knowly.git && cd Knowly
ANTHROPIC_API_KEY=sk-ant-... APP_PASSWORD=your-password node server.js
```

Needs Node 18+. On Render or Railway, use `npm start` as the start command and add the two variables. Optional: `PORT` (default 8787).

### Netlify from the terminal

```bash
npm install -g netlify-cli
git clone https://github.com/loystudio-tech/Knowly.git && cd Knowly
netlify login
netlify sites:create --name knowly-yourname
netlify link --name knowly-yourname
netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
netlify env:set APP_PASSWORD "your-password"
netlify deploy --prod
```

To test locally with the AI function: copy `.env.example` to `.env`, fill it in and run `netlify dev` (or just `node server.js`).

### Install it as an app from the browser

- **iPad or iPhone:** in Safari, **Share → Add to Home Screen**.
- **Mac:** in Safari, **File → Add to Dock**. In Chrome, use the install icon in the address bar.

---

## Privacy and data

- **Your notes, sets and progress are stored in your browser** (IndexedDB). There is no database and no accounts.
- Files are sent to the Anthropic API only when you ask the AI to do something.
- To move to another device: **Ajustes → Exportar** (Export), then **Importar** (Import) on the other device.
- No analytics and no tracking.
- Your API key is never stored in this repo. It lives in your host's environment variables or, in direct mode, only in your own browser or app.

## Cost

Knowly is free. You only pay for the Anthropic API usage. With Sonnet 5.5, a normal month of studying costs about $1–4. You can pick **Haiku 5.5** in Settings, which is much cheaper. The whiteboard and podcast voices are the browser's own, so they are free.

## How it's built

- **A single file** (`index.html`) with HTML, CSS and JavaScript, no frameworks.
- A small proxy (`/api/ai`) that adds your API key and checks the password. It streams, so long answers don't get cut off. One version per host: `netlify/edge-functions/ai.js`, `api/ai.js` (Vercel), `functions/api/ai.js` (Cloudflare) and `server.js` (Node).
- `desktop/`: an Electron wrapper that packages the same `index.html` as a Mac, Windows and Linux app.
- Libraries via CDN: [marked](https://github.com/markedjs/marked), [KaTeX](https://katex.org) and [DOMPurify](https://github.com/cure53/DOMPurify).
- JSON output uses the Claude API's structured outputs.

Want to rename it? Search for `const APP_NAME = 'Knowly';` in `index.html`.

## Contributing

Issues and pull requests are welcome. Open ideas:

- Optional cross-device sync (Firebase or Supabase).
- Email reminders even when the app is closed.
- More natural voices (optional paid TTS).
- YouTube videos and Word/PowerPoint files as sources.
- Translating the interface to more languages.

## License

[MIT](LICENSE): use it, modify it and share it freely.

Knowly is an independent project and is not affiliated with Anthropic or with any other study app.
