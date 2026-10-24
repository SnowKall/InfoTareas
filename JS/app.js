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