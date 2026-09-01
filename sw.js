const CACHE = 'tacqtics-v1';
const ASSETS = [
  '/tacqtics-upload/',
  '/tacqtics-upload/index.html',
  '/tacqtics-upload/logo.png',
  '/tacqtics-upload/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls, cache first for assets
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('accounts.google.com')) {
    return; // Let network handle Google API calls
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
