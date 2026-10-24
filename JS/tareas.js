document.addEventListener('DOMContentLoaded', () => {
    const formTask = document.getElementById('form-task');
    const typeButtons = document.querySelectorAll('.type-selector .btn-toggle');
    let selectedType = 'Individual';

  // Cambiar selector Individual / Grupal
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = btn.textContent;
        });
    });

  // Guardar nueva tarea desde el formulario
    if (formTask) {
        formTask.addEventListener('submit', (e) => {
            e.preventDefault();

        const inputs = formTask.querySelectorAll('input, select, textarea');
        const nuevaTarea = {
            id: Date.now(),
            titulo: inputs[0].value,
            curso: inputs[1].value || 'General',
            tipo: selectedType,
            fecha: inputs[2].value,
            notas: inputs[3].value,
            completada: false
        };

        Almacen.guardarTarea(nuevaTarea);
        formTask.reset();

      // Regresar a la vista principal
        document.getElementById('btn-back-task').click();
        renderizarTareas();
        });
    }
});

// Función para pintar las tareas dinámicamente en la pantalla principal
function renderizarTareas() {
    const container = document.getElementById('tasks-list');
    const tareas = Almacen.obtenerTareas();

    if (!container) return;

    if (tareas.length === 0) {
        container.innerHTML = `<p style="text-align:center; color: var(--text-secondary); margin-top:20px;">No tienes tareas pendientes</p>`;
        return;
    }

    container.innerHTML = tareas.map(t => `
        <article class="task-card" data-id="${t.id}">
        <div class="task-icon">📐</div>
        <div class="task-info">
            <h3 class="task-title">${t.titulo}</h3>
            <p class="task-course">${t.curso}</p>
            <div class="task-badges">
            <span class="badge badge-group">${t.tipo}</span>
            <span class="badge badge-date">${t.fecha ? t.fecha.replace('T', ' ') : 'Sin fecha'}</span>
            </div>
        </div>
        <div class="task-action">
            <input type="checkbox" class="task-check" ${t.completada ? 'checked' : ''}>
        </div>
        </article>
    `).join('');
}