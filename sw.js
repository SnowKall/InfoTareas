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

// Función para programar notificación cuando el usuario guarda una tarea
function programarNotificacionTarea(tarea) {
    if (!tarea.fecha) return;

    const fechaEntrega = new Date(tarea.fecha).getTime();
    const ahora = new Date().getTime();
    const tiempoRestante = fechaEntrega - ahora;

    // Si la fecha es futura, programamos la alerta
    if (tiempoRestante > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted' && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    const horaFormateada = new Date(tarea.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                    registration.showNotification(`📌 Tarea próxima: ${tarea.titulo}`, {
                        body: `Tu tarea del curso "${tarea.curso}" vence hoy a las ${horaFormateada}.`,
                        icon: 'IMG/Icons/icon-192.png',
                        vibrate: [200, 100, 200]
                    });
                });
            }
        }, tiempoRestante);
    }
}