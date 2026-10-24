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
});