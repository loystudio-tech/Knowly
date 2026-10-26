// Self-host anywhere Node 18+ runs (your computer, a VPS, Render, Railway, Fly.io, Docker…):
//   ANTHROPIC_API_KEY=sk-ant-... APP_PASSWORD=your-password node server.js
// Serves the app and the /api/ai proxy. Optional: PORT (default 8787).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ALLOWED_MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-opus-5-5'];
// Only these files are public (so .env and the rest of the repo are never exposed).
const FILES = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/sw.js': ['sw.js', 'text/javascript'],
  '/manifest.webmanifest': ['manifest.webmanifest', 'application/manifest+json'],
  '/icons/icon-192.png': ['icons/icon-192.png', 'image/png'],
  '/icons/icon-512.png': ['icons/icon-512.png', 'image/png'],
  '/icons/icon-maskable-512.png': ['icons/icon-maskable-512.png', 'image/png'],
  '/icons/apple-touch-icon.png': ['icons/apple-touch-icon.png', 'image/png'],
};
const send = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  if (path === '/api/ai') {
    if (req.method !== 'POST') return send(res, 405, { error: { message: 'Método no permitido' } });
    const { APP_PASSWORD: pw, ANTHROPIC_API_KEY: key } = process.env;
    if (!pw || !key) return send(res, 500, { error: { message: 'Faltan ANTHROPIC_API_KEY o APP_PASSWORD en el servidor.' } });
    if (req.headers['x-app-password'] !== pw) return send(res, 401, { error: { message: 'Contraseña incorrecta' } });
    const chunks = []; for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8');
    const m = raw.match(/"model"\s*:\s*"([^"]+)"/);
    if (!m || !ALLOWED_MODELS.includes(m[1])) return send(res, 400, { error: { message: 'Modelo no permitido' } });
    try {
      const up = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', body: raw,
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      });
      res.writeHead(up.status, { 'content-type': up.headers.get('content-type') || 'text/event-stream', 'cache-control': 'no-cache' });
      Readable.fromWeb(up.body).pipe(res);
    } catch (e) { send(res, 502, { error: { message: 'No se pudo conectar con Anthropic.' } }); }
    return;
  }
  const f = FILES[path];
  if (!f || req.method !== 'GET') { res.writeHead(404); return res.end('Not found'); }
  try { res.writeHead(200, { 'content-type': f[1] }); res.end(await readFile(join(ROOT, f[0]))); }
  catch (e) { res.writeHead(404); res.end('Not found'); }
}).listen(process.env.PORT || 8787, () => console.log('Knowly → http://localhost:' + (process.env.PORT || 8787)));
