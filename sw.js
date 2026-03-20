const CACHE = 'scents-ios-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com') || e.request.url.includes('googleapis.com') || e.request.url.includes('cdnjs')) return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('./index.html'))));
});
