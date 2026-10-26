// Cloudflare Pages: secure proxy to the Claude API (Pages Function, streams the response).
// Set ANTHROPIC_API_KEY and APP_PASSWORD in Settings → Variables and Secrets.
const ALLOWED_MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-opus-5-5'];
const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export async function onRequest({ request: req, env }) {
  if (req.method !== 'POST') return json({ error: { message: 'Método no permitido' } }, 405);
  if (!env.APP_PASSWORD) return json({ error: { message: 'Falta APP_PASSWORD en las variables de Cloudflare.' } }, 500);
  if (req.headers.get('x-app-password') !== env.APP_PASSWORD) return json({ error: { message: 'Contraseña incorrecta' } }, 401);
  if (!env.ANTHROPIC_API_KEY) return json({ error: { message: 'Falta ANTHROPIC_API_KEY en las variables de Cloudflare.' } }, 500);

  const raw = await req.text();
  const m = raw.match(/"model"\s*:\s*"([^"]+)"/);
  if (!m || !ALLOWED_MODELS.includes(m[1])) return json({ error: { message: 'Modelo no permitido' } }, 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: raw,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'text/event-stream', 'cache-control': 'no-cache' },
  });
}
