/* Service Worker do TugLords — app instalável e jogável offline.
   Estratégia:
   - navegação (HTML): network-first com fallback ao index.html em cache;
   - estáticos mesmo-origem: stale-while-revalidate (serve do cache e atualiza);
   - CDNs/externos: passam direto pela rede (áudio degrada sem Tone.js). */

const CACHE = 'tuglords-v2';

const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/css/styles.css',
  '/src/js/main.js',
  '/src/js/modules/state.js',
  '/src/js/modules/logic.js',
  '/src/js/modules/ui.js',
  '/src/js/modules/audio.js',
  '/src/js/modules/effects.js',
  '/src/js/modules/commentary.js',
  '/src/js/modules/ranking.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falha se QUALQUER item falhar; usamos tolerância item a item.
      .then((cache) => Promise.allSettled(CORE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Deixa recursos de outras origens (CDNs, fontes) seguirem pela rede.
  if (url.origin !== self.location.origin) return;

  // Navegação: tenta a rede; se offline, cai no index.html do cache.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Estáticos: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
