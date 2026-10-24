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

document.addEventListener('DOMContentLoaded', () => {
    const formTask = document.getElementById('form-task');
    const typeButtons = document.querySelectorAll('.type-selector .btn-toggle');
    const btnBackDetail = document.getElementById('btn-back-detail');
    let selectedType = 'Individual';

  // Toggle Tipo Individual/Grupal
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.textContent;
        });
    });

  // Regresar desde la vista de detalle
    if (btnBackDetail) {
        btnBackDetail.addEventListener('click', () => {
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.getElementById('view-tasks').classList.remove('hidden');
        });
    }

  // Guardar Tarea con Foto y Descripción
    if (formTask) {
        formTask.addEventListener('submit', (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('task-img-input');
        const file = fileInput ? fileInput.files[0] : null;

        const guardar = (imagenData = null) => {
            const nuevaTarea = {
                id: Date.now(),
                titulo: document.getElementById('task-title-input').value,
                curso: document.getElementById('task-course-select').value || 'General',
                tipo: selectedType,
                fecha: document.getElementById('task-date-input').value,
                descripcion: document.getElementById('task-desc-input').value,
                imagen: imagenData,
                completada: false
            };

            Almacen.guardarTarea(nuevaTarea);
            formTask.reset();
            document.getElementById('btn-back-task').click();
            renderizarTareas();
        };

        // Si subió foto, convertir a Base64
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => guardar(reader.result);
            reader.readAsDataURL(file);
        } else {
            guardar();
        }
        });
    }

    renderizarTareas();
});

// Renderizar tareas con botón de eliminar y evento para abrir detalle
function renderizarTareas() {
    const container = document.getElementById('tasks-list');
    const tareas = Almacen.obtenerTareas();

    if (!container) return;

    if (tareas.length === 0) {
        container.innerHTML = `<p style="text-align:center; color: var(--text-secondary); margin-top:30px;">No tienes tareas pendientes 🎉</p>`;
        return;
    }

    container.innerHTML = tareas.map(t => `
        <article class="task-card" data-id="${t.id}" style="cursor: pointer;">
            <div class="task-icon">📐</div>
            <div class="task-info" onclick="verDetalleTarea(${t.id})">
                <h3 class="task-title">${t.titulo}</h3>
                <p class="task-course">${t.curso}</p>
                <div class="task-badges">
                    <span class="badge badge-group">${t.tipo}</span>
                    <span class="badge badge-date">${t.fecha ? t.fecha.replace('T', ' ') : 'Sin fecha'}</span>
                </div>
            </div>
            <div class="task-action" style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" class="task-check" ${t.completada ? 'checked' : ''} onclick="event.stopPropagation()">
                <button class="btn-delete-task" onclick="event.stopPropagation(); eliminarTareaConConfirmacion(${t.id})">✕</button>
            </div>
        </article>
    `).join('');
}

// Abrir detalle de la tarea
function verDetalleTarea(id) {
    const tareas = Almacen.obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    const detailContent = document.getElementById('task-detail-content');
    detailContent.innerHTML = `
        <div class="detail-card">
            <h3 style="font-size: 18px; color: var(--text-primary);">${tarea.titulo}</h3>
            <p style="font-size: 14px; color: var(--text-secondary);"><strong>Curso:</strong> ${tarea.curso}</p>
            <p style="font-size: 14px; color: var(--text-secondary);"><strong>Entrega:</strong> ${tarea.fecha ? tarea.fecha.replace('T', ' ') : 'Sin fecha'}</p>
            <p style="font-size: 14px; color: var(--text-secondary);"><strong>Modalidad:</strong> ${tarea.tipo}</p>
            
            ${tarea.descripcion ? `
                <div style="margin-top: 8px;">
                    <strong>Descripción:</strong>
                    <p style="font-size: 14px; margin-top: 4px; white-space: pre-line;">${tarea.descripcion}</p>
                </div>
            ` : ''}

            ${tarea.imagen ? `
                <div style="margin-top: 8px;">
                    <strong>Foto / Archivo adjunto:</strong><br>
                    <img src="${tarea.imagen}" class="detail-img" alt="Foto de la tarea" style="margin-top:6px;">
                </div>
            ` : ''}
        </div>
    `;

    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById('view-task-detail').classList.remove('hidden');
}

// Eliminar tarea con confirmación
function eliminarTareaConConfirmacion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        Almacen.eliminarTarea(id);
        renderizarTareas();
    }
}