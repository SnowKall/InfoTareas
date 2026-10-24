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
    './JS/cursos.js'
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

// Solicitar permiso
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
        console.log('Permisos de notificación concedidos');
    }
});

// Enviar una notificación local
navigator.serviceWorker.ready.then(registration => {
    registration.showNotification('Kite: Tarea Próxima', {
        body: 'Tu tarea "Informe de Matrices" vence hoy a las 11:59 PM',
        icon: 'IMG/Icons/icon-192.png',
        vibrate: [200, 100, 200]
    });
});