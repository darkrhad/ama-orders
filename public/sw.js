// Keeps the app on the device so it opens with no internet.
// Serves from the cache first and refreshes it in the background;
// a new version shows up on the next open.
const CACHE = 'ama-orders-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/manifest.webmanifest', '/icon.svg', '/icon-180.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const key = req.mode === 'navigate' ? '/' : req;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(key);
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(key, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit ?? fresh;
    }),
  );
});
