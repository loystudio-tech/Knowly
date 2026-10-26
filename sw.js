// Knowly service worker: la app abre sin conexión y carga más rápido.
// - La página siempre intenta la red primero (así ves las actualizaciones al momento).
// - Librerías y fuentes se guardan en caché.
// - Las llamadas a la IA (/api/...) nunca se cachean.
const CACHE = 'knowly-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/manifest.webmanifest', '/icons/icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((k) => k.put('/', c)); return r; }).catch(() => caches.match('/')));
    return;
  }
  if (/cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.host) || url.origin === location.origin) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then((k) => k.put(req, c)); } return r; })));
  }
});
