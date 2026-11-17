// Versão TV: service worker desativado. Se algum navegador ainda tiver o antigo,
// este se instala, limpa os caches e se remove.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister()));
});
