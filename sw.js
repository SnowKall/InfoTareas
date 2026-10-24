const CACHE_NAME = 'infotareas-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './CSS/main.css',
    './CSS/components.css',
    './CSS/views.css',
    './JS/app.js',
    './JS/almacen.js',
    './JS/tareas.js',
    './JS/cursos.js',
    './IMG/Icons',
    './IMG/PlaceHolders'
];

// Instalación del Service Worker
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones para funcionamiento offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});