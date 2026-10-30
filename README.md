<div align="center">

<img src="icons/icon-192.png" width="88" alt="Knowly">

# Knowly

**Your AI study companion. Free and open source.**

Upload photos of the whiteboard, textbook pages, PDFs or handwritten notes. Knowly sorts them by subject and builds study guides, flashcards, quizzes, mock exams, whiteboard lessons with voice, and podcasts.

It runs on **your own Anthropic (Claude) API key**, which stays in your browser. You pay only for what you use, usually $1–4 per month.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/loystudio-tech/Knowly)

[Features](#features) · [Setup](#setup) · [Desktop app](#desktop-app-mac-windows-linux) · [Privacy](#privacy-and-data) · [Cost](#cost) · [Contributing](#contributing) · [Español](README.es.md)

</div>

---

## Features

| | |
|---|---|
| **Backpack** | Drop up to 30 screenshots, photos, PDFs or Word files. Knowly reads each one and sorts it by **type** (explanation, exercises, homework, exam, notes) and by **class** (Maths, Physics…). A whiteboard full of theory is an explanation; a whiteboard with exercises A, B, C is exercises. Rename or merge classes (e.g. Physics + Chemistry) and later review, generate new exercises, prepare an exam or create a skill from any selection. |
| **Homework** | Upload a photo or screenshot and walk away: Knowly prepares it in the background. It **explains step by step instead of just solving** (hints first, check your answer), has a tutor chat, a whiteboard with voice, reads German/Spanish/other-language texts aloud with translation and vocabulary, puts it in your calendar (and when to read it), and detects if it is exam material and builds a study guide, flashcards, a quiz and a countdown plan. |
| **Create from…** | Every "create" screen (flashcards, quiz, study guide, exam, skill, homework) takes up to 10 sources: files, pasted text, **YouTube**, **video** (frames are analysed), **Google Drive** public links, web pages, camera, drag and drop, and Word/PowerPoint. |
| **Solver** | Solves problems step by step from text, a photo, a PDF or handwriting (Apple Pencil works too). You can ask follow-up questions about the solution. |
| **Whiteboard tutor** | A lesson that writes itself step by step, with drawings and a voice. |
| **Study sets** | Built from your files and sorted by subject automatically. Each set includes a study guide, review guide, flashcards, quiz, mock exam, cheat sheet, podcast and a chat tutor (voice supported). |
| **Daily review** | Spaced repetition across all your flashcards, with a day streak and an activity heatmap. |
| **Exam predictor** | Most likely topics, a day-by-day study plan, mock exams and a cheat sheet. |
| **Skills** (`/`) | Upload a PDF or photos with exercises solved your way (or your teacher's way). Knowly learns the method and applies it whenever you type `/skill-name`. It can also generate new exercises and teach the method on the whiteboard. |
| **Automations** | Build rules with **blocks**, Scratch-style (drag and drop, with `if / then / else`), or use the simple step list. Example: "On exam day → quick summary + morning reminder to review". Triggers: material uploaded, backpack sorted, homework ready, exam added, N days before an exam, low quiz score, every day. |
| **Writing tools** | Proofreader, rewrite, paraphrase, summarize, citations (APA, MLA…) and text explainer. |
| **Calendar** | Homework, readings and exams (with an optional time), in-app reminders (bell) and a **.ics export** with alarms for your calendar app. |
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
| Put it online (everyone brings their own key) | [Netlify](#netlify) · [Vercel](#vercel) · [Cloudflare Pages](#cloudflare-pages) | Yes (included, no secrets) |
| Host it on my own machine, VPS, Render, Railway… | [Node server](#any-node-host-render-railway-vps-docker) | Yes (included) |

**Every person uses their own key.** When Knowly is hosted (Netlify, Vercel, Cloudflare…) the site holds **no secrets at all**: each visitor pastes their own Anthropic key in **Ajustes → Mi propia clave**. The key is stored only in that person's browser and is sent only to `api.anthropic.com`. It never goes through the host, so nobody (including whoever deployed the site) can see or spend anyone else's key. The deployment ships a strict Content-Security-Policy (`netlify.toml`, `vercel.json`, `_headers`, `server.js`) so the browser refuses to send anything to any other domain.

Limits that protect you:
- **Spending limit on the key itself:** in the Anthropic Console set **Settings → Limits** (monthly limit). Ideally create a separate Workspace for Knowly with its own limit. This is the only limit that truly caps a key.
- **Daily limit inside the app:** **Ajustes → Límite diario** (300 thousand / 1 million / 3 million tokens per day, per device). When reached, Knowly stops calling the AI until tomorrow.
- **Monthly limit, request rate and automations:** also in Settings (5 / 15 / 50 million tokens per month by default 15 M), plus a fixed cap of 60 AI requests per minute and 30 automation runs per day. These are per browser; they protect against accidents, not against someone who has your key.
- **Only your own site:** the page loads all its scripts from its own host (no third-party CDN), and a strict Content-Security-Policy only allows connections to the site itself and `api.anthropic.com`. The optional private proxy rejects requests whose `Origin` is a different site. Note: an Anthropic key cannot be locked to a domain; that is why each visitor uses their own.
- **Per-request cap:** no single request can ask for more than 16,000 output tokens.

Optional, for **private** servers only: **Servidor con contraseña**. If you set `ANTHROPIC_API_KEY` and `APP_PASSWORD` as environment variables, visitors who know the password use *your* key through `/api/ai`. Never do this on a site you share publicly without the password.

Everything uses the same `/api/ai` endpoint, so the app doesn't care which host you pick.

### Desktop app (Mac, Windows, Linux)

Download the latest `.dmg` (Mac), `.exe` (Windows) or `.AppImage` (Linux) from the [Releases](../../releases) page, open it and paste your key in **Ajustes → Clave directa**.

- **Mac:** the app is not signed by Apple, so the first time right-click it and choose **Open** (or **System Settings → Privacy & Security → Open Anyway**).
- Spoken answers use your system voices and work everywhere. Voice dictation with the microphone may not work in the desktop app; use the browser version installed as an app (see below).
- **Build it yourself:** `cd desktop && npm install && npm run dist` (the app appears in `desktop/dist`).
- **Publish your own release:** push a tag (`git tag v1.0.0 && git push --tags`). GitHub Actions builds all three apps and attaches them to a Release.

### No server (fastest)

1. Download the repo (**Code → Download ZIP**) and open `index.html` in Chrome or Safari. You can also host it for free on **GitHub Pages**.
2. In **Ajustes → Clave directa**, paste your API key.

### Netlify

Press the **Deploy to Netlify** button at the top (or **Add new site → Import from Git**). No environment variables are needed. Open the site, go to **Ajustes** and paste your key. The optional private-server proxy is `netlify/edge-functions/ai.js`.

> Dragging the folder into *Netlify Drop* does not work, because the AI function would not be published.

### Vercel

**Add New → Project → Import** this repo. Leave the build settings empty (framework "Other"). No environment variables are needed. The optional private-server proxy is `api/ai.js`.

### Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git.** Leave the build command empty and set the output directory to `/`. No environment variables are needed. The optional private-server proxy is `functions/api/ai.js`.

### Any Node host (Render, Railway, VPS, Docker…)

```bash
git clone https://github.com/loystudio-tech/Knowly.git && cd Knowly
node server.js          # public: everyone pastes their own key in the app
# private: ANTHROPIC_API_KEY=sk-ant-... APP_PASSWORD=your-password node server.js
```

Needs Node 18+. On Render or Railway, use `npm start` as the start command. Optional: `PORT` (default 8787); the two variables only for a private server.

### Netlify from the terminal

```bash
npm install -g netlify-cli
git clone https://github.com/loystudio-tech/Knowly.git && cd Knowly
netlify login
netlify sites:create --name knowly-yourname
netlify link --name knowly-yourname
netlify deploy --prod
```

To test locally with the AI function: copy `.env.example` to `.env`, fill it in and run `netlify dev` (or just `node server.js`).

### Install it as an app from the browser

- **iPad or iPhone:** in Safari, **Share → Add to Home Screen**.
- **Mac:** in Safari, **File → Add to Dock**. In Chrome, use the install icon in the address bar.

---

## What it can and can't do (honest limits)

- **No real e-mail.** Knowly has no backend that sends mail. Reminders are an in-app bell, browser notifications (while the app is open), **.ics files whose alarms your calendar app fires even when Knowly is closed**, and a "send me an e-mail" button that opens your mail app (`mailto:`).
- **Audio is not heard.** Claude reads images and text, not sound. Videos are analysed as frames (slides, whiteboard); for the spoken part upload the subtitles (`.srt` / `.vtt`) or paste the transcript. Audio files are not supported.
- **YouTube, Drive and web pages** are fetched by the server endpoint `/api/source` (so it needs to be hosted on Netlify, Vercel, Cloudflare or Node — not the desktop app or a bare `index.html`; there you can still upload files, video, paste text or transcripts). The endpoint holds no secrets; if you set `APP_PASSWORD` it becomes required. YouTube may block server addresses, in which case the app tells you and you can paste the transcript instead. Drive only works for files shared with "anyone with the link".
- **Voices** are the ones your device provides (you can pick one per language in Settings). There are no paid neural voices.
- Alarms in the `.ics` and the in-app bell need you to open the calendar file or the app at least once.

## Privacy and data

- **Your notes, sets and progress are stored in your browser** (IndexedDB). There is no database and no accounts.
- Files are sent to the Anthropic API only when you ask the AI to do something.
- To move to another device: **Ajustes → Exportar** (Export), then **Importar** (Import) on the other device.
- No analytics and no tracking.
- Your API key is never stored in this repo or on the host. It lives only in your own browser or app (localStorage), is never included in backups/exports, and you can remove it any time in **Ajustes**.

## Cost

Knowly is free. You only pay for the Anthropic API usage. With Sonnet 5.5, a normal month of studying costs about $1–4. You can pick **Haiku 5.5** in Settings, which is much cheaper. The whiteboard and podcast voices are the browser's own, so they are free.

## How it's built

- **A single file** (`index.html`) with HTML, CSS and JavaScript, no frameworks.
- A second endpoint, `/api/source`, fetches YouTube transcripts, Google Drive files and web pages (shared logic in `lib/source.js`; the Netlify copy is generated with `scripts/sync-netlify-source.sh`, run it after editing `lib/source.js`).
- A small proxy (`/api/ai`) that adds your API key and checks the password. It streams, so long answers don't get cut off. One version per host: `netlify/edge-functions/ai.js`, `api/ai.js` (Vercel), `functions/api/ai.js` (Cloudflare) and `server.js` (Node).
- `desktop/`: an Electron wrapper that packages the same `index.html` as a Mac, Windows and Linux app.
- Libraries via CDN: [marked](https://github.com/markedjs/marked), [KaTeX](https://katex.org) and [DOMPurify](https://github.com/cure53/DOMPurify).
- JSON output uses the Claude API's structured outputs.

Want to rename it? Search for `const APP_NAME = 'Knowly';` in `index.html`.

## Contributing

Issues and pull requests are welcome. Open ideas:

- Optional cross-device sync (Firebase or Supabase).
- Real e-mail reminders (needs a small backend and an e-mail provider).
- More natural voices (optional paid TTS).
- Audio transcription (for lecture recordings) with an optional speech-to-text provider.
- Translating the interface to more languages.

## License

[MIT](LICENSE): use it, modify it and share it freely.

Knowly is an independent project and is not affiliated with Anthropic or with any other study app.
