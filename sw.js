const CACHE = 'desempeno-v2';
const ARCHIVOS = ['./', './index.html', './icon-192.png', './logo-total.png', './logo-dpo.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return; // la API de Apps Script va directo a la red
  e.respondWith(fetch(req).then(r => {
    const copia = r.clone();
    caches.open(CACHE).then(c => c.put(req, copia));
    return r;
  }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
