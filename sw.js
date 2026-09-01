const CACHE = 'otacq-v4';
const ASSETS = [
  '/tacqtics-upload/',
  '/tacqtics-upload/index.html',
  '/tacqtics-upload/logo.png',
  '/tacqtics-upload/manifest.json',
  '/tacqtics-upload/sw.js'
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
  // Pass through Google API calls directly to network
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('accounts.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache first for local assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
