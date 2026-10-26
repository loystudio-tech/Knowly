// Vercel: secure proxy to the Claude API (Edge runtime, streams the response).
// Set ANTHROPIC_API_KEY and APP_PASSWORD in Project Settings → Environment Variables.
export const config = { runtime: 'edge' };

const ALLOWED_MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-opus-5-5'];
const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: { message: 'Método no permitido' } }, 405);
  const password = process.env.APP_PASSWORD;
  if (!password) return json({ error: { message: 'Falta APP_PASSWORD en las variables de entorno de Vercel.' } }, 500);
  if (req.headers.get('x-app-password') !== password) return json({ error: { message: 'Contraseña incorrecta' } }, 401);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: { message: 'Falta ANTHROPIC_API_KEY en las variables de entorno de Vercel.' } }, 500);

  const raw = await req.text();
  const m = raw.match(/"model"\s*:\s*"([^"]+)"/);
  if (!m || !ALLOWED_MODELS.includes(m[1])) return json({ error: { message: 'Modelo no permitido' } }, 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: raw,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'text/event-stream', 'cache-control': 'no-cache' },
  });
}
