// Self-host anywhere Node 18+ runs (your computer, a VPS, Render, Railway, Fly.io, Docker…):
//   ANTHROPIC_API_KEY=sk-ant-... APP_PASSWORD=your-password node server.js
// Serves the app, the /api/ai proxy and the /api/source reader. Optional: PORT (default 8787).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { sourceResponse } from './lib/source.js';

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
  '/vendor/marked.min.js': ['vendor/marked.min.js', 'text/javascript'],
  '/vendor/katex.min.js': ['vendor/katex.min.js', 'text/javascript'],
  '/vendor/purify.min.js': ['vendor/purify.min.js', 'text/javascript'],
  '/vendor/katex.min.css': ['vendor/katex.min.css', 'text/css'],
};
// KaTeX fonts (fixed list, same idea: nothing else in the repo is public).
for (const n of ['AMS-Regular','Caligraphic-Bold','Caligraphic-Regular','Fraktur-Bold','Fraktur-Regular','Main-Bold','Main-BoldItalic','Main-Italic','Main-Regular','Math-BoldItalic','Math-Italic','SansSerif-Bold','SansSerif-Italic','SansSerif-Regular','Script-Regular','Size1-Regular','Size2-Regular','Size3-Regular','Size4-Regular','Typewriter-Regular'])
  FILES['/vendor/fonts/KaTeX_' + n + '.woff2'] = ['vendor/fonts/KaTeX_' + n + '.woff2', 'font/woff2'];
// Self-hosted extra guard: resolve the host and refuse private addresses (DNS rebinding / internal names).
const privateIP = (ip) => /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|::1|fc|fd|fe80)/i.test(ip);
const assertHost = async (host) => {
  if (isIP(host)) { if (privateIP(host)) throw Object.assign(new Error('Ese enlace no está permitido.'), { status: 400 }); return; }
  let addrs; try { addrs = await lookup(host, { all: true }); } catch (e) { throw Object.assign(new Error('No se encontró ese sitio.'), { status: 502 }); }
  if (addrs.some((a) => privateIP(a.address))) throw Object.assign(new Error('Ese enlace no está permitido.'), { status: 400 });
};
// Same headers as netlify.toml / vercel.json / _headers: the browser may only talk to this site and api.anthropic.com.
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": "camera=(self), microphone=(self), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self' https://api.anthropic.com; worker-src 'self'; manifest-src 'self'; object-src 'self' blob:; frame-src 'self' blob:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};
const send = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  if (path === '/api/ai') {
    if (req.method !== 'POST') return send(res, 405, { error: { message: 'Método no permitido' } });
    // Only this site may use the proxy (browsers always send Origin on POST).
    if (req.headers.origin) { let ok = false; try { ok = new URL(req.headers.origin).host === req.headers.host; } catch (e) {} if (!ok) return send(res, 403, { error: { message: 'Origen no permitido' } }); }
    const { APP_PASSWORD: pw, ANTHROPIC_API_KEY: key } = process.env;
    if (!pw || !key) return send(res, 500, { error: { message: 'Faltan ANTHROPIC_API_KEY o APP_PASSWORD en el servidor.' } });
    if (req.headers['x-app-password'] !== pw) return send(res, 401, { error: { message: 'Contraseña incorrecta' } });
    const chunks = []; for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8');
    const m = raw.match(/"model"\s*:\s*"([^"]+)"/);
    if (!m || !ALLOWED_MODELS.includes(m[1])) return send(res, 400, { error: { message: 'Modelo no permitido' } });
    const mt = raw.match(/"max_tokens"\s*:\s*(\d+)/);
    if (!mt || +mt[1] > 16000) return send(res, 400, { error: { message: 'max_tokens no permitido' } });
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
  if (path === '/api/source') {
    if (req.method !== 'POST') return send(res, 405, { error: { message: 'Método no permitido' } });
    if (req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { error: { message: 'No permitido' } });
    const { APP_PASSWORD: pw } = process.env;       // optional: if set, it is required
    if (pw && req.headers['x-app-password'] !== pw) return send(res, 401, { error: { message: 'Contraseña incorrecta' } });
    const chunks = []; for await (const c of req) chunks.push(c);
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { return send(res, 400, { error: { message: 'Petición no válida' } }); }
    const r = await sourceResponse(body, { assertHost });
    res.writeHead(r.status, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(await r.text());
    return;
  }
  const f = FILES[path];
  if (!f || req.method !== 'GET') { res.writeHead(404); return res.end('Not found'); }
  try { res.writeHead(200, { 'content-type': f[1], ...SECURITY_HEADERS }); res.end(await readFile(join(ROOT, f[0]))); }
  catch (e) { res.writeHead(404); res.end('Not found'); }
}).listen(process.env.PORT || 8787, () => console.log('Knowly → http://localhost:' + (process.env.PORT || 8787)));
