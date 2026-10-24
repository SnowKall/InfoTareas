document.addEventListener('DOMContentLoaded', () => {
  // Manejo de navegación inferior
    const navButtons = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');

        // Ocultar todas las vistas y desactivar botonesCambio de vistas y navegación
        views.forEach(v => v.classList.add('hidden'));
        navButtons.forEach(b => b.classList.remove('active'));

        // Mostrar la vista seleccionada
        document.getElementById(targetView).classList.remove('hidden');
        btn.classList.add('active');
        });
    });

    // Botón + para abrir formulario de agregar tarea
    const btnAddTask = document.getElementById('btn-add-task');
    const btnBackTask = document.getElementById('btn-back-task');

    if (btnAddTask) {
        btnAddTask.addEventListener('click', () => {
        views.forEach(v => v.classList.add('hidden'));
        document.getElementById('view-add-task').classList.remove('hidden');
        });
    }

    if (btnBackTask) {
        btnBackTask.addEventListener('click', () => {
        views.forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tasks').classList.remove('hidden');
        });
    }
});

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado correctamente', reg))
            .catch(err => console.error('Error al registrar Service Worker', err));
    });
}

// Manejo de Modo Oscuro / Claro
document.addEventListener('DOMContentLoaded', () => {
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    const currentTheme = localStorage.getItem('kite_theme');

    // Aplicar tema guardado previamente
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (btnToggleTheme) btnToggleTheme.textContent = 'Claro ☀️';
    }

    if (btnToggleTheme) {
        btnToggleTheme.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                btnToggleTheme.textContent = 'Claro ☀️';
            } else {
                btnToggleTheme.textContent = 'Oscuro 🌙';
            }

            localStorage.setItem('kite_theme', theme);
        });
    }

    const btnNotify = document.getElementById('btn-enable-notifications');

    if (btnNotify) {
        btnNotify.addEventListener('click', () => {
            if (!('Notification' in window)) {
                alert('Este navegador no soporta notificaciones.');
            return;
            }

            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('¡Notificaciones activadas con éxito!');
                
                    // Disparar notificación de prueba
                    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification('🪁 Kite', {
                                body: '¡Las notificaciones están activadas correctamente!',
                                icon: 'IMG/Icons/icon-192.png',
                                vibrate: [200, 100, 200]
                            });
                        });
                    }
                } else {
                    alert('Permiso de notificaciones denegado.');
                }
            });
        });
    }
});

// 1. Helper para convertir la llave VAPID
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// 2. Evento del botón de notificaciones
document.addEventListener('DOMContentLoaded', () => {
    const btnNotify = document.getElementById('btn-enable-notifications');
    
    // Reemplaza esta comilla por tu VAPID_PUBLIC_KEY real
    const PUBLIC_VAPID_KEY = 'BPL4QD7vyyUW0ZJBqO-jc-pxiqlrAzCEFTYjouXDAjJfo7VO9vugb5y7cMEeVdBUFMzRc99_0VNopTxWdPeIwfk'; 

    if (btnNotify) {
        btnNotify.addEventListener('click', async () => {
            if (!('Notification' in window) || !('serviceWorker' in navigator)) {
                alert('Este navegador no soporta notificaciones push.');
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Permiso de notificaciones denegado.');
                return;
            }

            try {
                const reg = await navigator.serviceWorker.ready;
                let subscription = await reg.pushManager.getSubscription();

                if (!subscription) {
                    subscription = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                    });
                }

                // Guardar la suscripción en el navegador
                localStorage.setItem('kite_push_subscription', JSON.stringify(subscription));
                alert('¡Notificaciones activadas con éxito en Kite!');
            } catch (err) {
                console.error('Error al suscribir a notificaciones:', err);
                alert('Hubo un error al activar las notificaciones.');
            }
        });
    }
});