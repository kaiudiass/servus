const CACHE_NAME = 'get-escala-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/main.jsx',
    '/src/App.jsx',
    '/src/App.css',
    '/favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
