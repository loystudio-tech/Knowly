// Proxy seguro hacia la API de Claude.
// - Tu API key vive en Netlify (variable ANTHROPIC_API_KEY), nunca en el navegador.
// - APP_PASSWORD evita que otra persona que encuentre tu web gaste tu saldo.
// - Es una Edge Function con streaming: las respuestas largas no chocan con el límite de tiempo.

const ALLOWED_MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-opus-5-5'];

const json = (obj, status) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: { message: 'Método no permitido' } }, 405);

  const password = Netlify.env.get('APP_PASSWORD');
  if (!password) return json({ error: { message: 'Falta APP_PASSWORD en las variables de entorno de Netlify.' } }, 500);
  if (req.headers.get('x-app-password') !== password) return json({ error: { message: 'Contraseña incorrecta' } }, 401);

  const key = Netlify.env.get('ANTHROPIC_API_KEY');
  if (!key) return json({ error: { message: 'Falta ANTHROPIC_API_KEY en las variables de entorno de Netlify.' } }, 500);

  // Comprobación barata del modelo sin parsear todo el cuerpo (puede llevar imágenes grandes).
  const raw = await req.text();
  const m = raw.match(/"model"\s*:\s*"([^"]+)"/);
  if (!m || !ALLOWED_MODELS.includes(m[1])) return json({ error: { message: 'Modelo no permitido' } }, 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: raw,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'text/event-stream',
      'cache-control': 'no-cache',
    },
  });
};

export const config = { path: '/api/ai' };
