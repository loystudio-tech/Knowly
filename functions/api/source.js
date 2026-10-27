// Cloudflare Pages: reads YouTube transcripts, public Google Drive files and web pages for the "Create from" menu.
// Uses the same APP_PASSWORD as /api/ai. Code lives in lib/source.js.
import { sourceResponse } from '../../lib/source.js';

const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export async function onRequest({ request: req, env }) {
  if (req.method !== 'POST') return json({ error: { message: 'Método no permitido' } }, 405);
  if (!env.APP_PASSWORD) return json({ error: { message: 'Falta APP_PASSWORD en las variables de Cloudflare.' } }, 500);
  if (req.headers.get('x-app-password') !== env.APP_PASSWORD) return json({ error: { message: 'Contraseña incorrecta' } }, 401);
  let body; try { body = await req.json(); } catch (e) { return json({ error: { message: 'Petición no válida' } }, 400); }
  return sourceResponse(body);
}
