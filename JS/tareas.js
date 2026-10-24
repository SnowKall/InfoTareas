document.addEventListener('DOMContentLoaded', () => {
    const formTask = document.getElementById('form-task');
    const typeButtons = document.querySelectorAll('.type-selector .btn-toggle');
    const btnBackDetail = document.getElementById('btn-back-detail');
    let selectedType = 'Individual';

  // Cambiar selector de tipo (Individual / Grupal)
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = btn.textContent;
        });
    });

  // Botón para volver desde el detalle
    if (btnBackDetail) {
        btnBackDetail.addEventListener('click', () => {
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.getElementById('view-tasks').classList.remove('hidden');
        });
    }

  // Guardar tarea
    if (formTask) {
        formTask.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita envíos duplicados o fantasmas

        const inputTitle = document.getElementById('task-title-input');
        const selectCourse = document.getElementById('task-course-select');
        const inputDate = document.getElementById('task-date-input');
        const inputDesc = document.getElementById('task-desc-input');
        const inputFile = document.getElementById('task-img-input');

        const file = inputFile && inputFile.files ? inputFile.files[0] : null;

        const guardar = (imagenData = null) => {
            const nuevaTarea = {
                id: Date.now(),
                titulo: inputTitle ? inputTitle.value : 'Sin título',
                curso: selectCourse ? selectCourse.value : 'General',
                tipo: selectedType,
                fecha: inputDate ? inputDate.value : '',
                descripcion: inputDesc ? inputDesc.value : '',
                imagen: imagenData,
                completada: false
            };

            Almacen.guardarTarea(nuevaTarea);
            formTask.reset();

            // Volver a selección individual por defecto
            typeButtons.forEach(b => b.classList.remove('active'));
            if (typeButtons[0]) typeButtons[0].classList.add('active');
            selectedType = 'Individual';

            // Regresar a la vista principal
            const btnBack = document.getElementById('btn-back-task');
            if (btnBack) btnBack.click();

        renderizarTareas();
        };

        // Convertir imagen a base64 si el usuario seleccionó un archivo
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

// Pintar la lista de tareas
function renderizarTareas() {
    const container = document.getElementById('tasks-list');
    if (!container) return;

    const tareas = Almacen.obtenerTareas();

    if (tareas.length === 0) {
        container.innerHTML = `<p style="text-align:center; color: var(--text-secondary); margin-top:30px;">No tienes tareas pendientes 🎉</p>`;
        return;
    }

    container.innerHTML = tareas.map(t => `
        <article class="task-card" style="cursor: pointer;">
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

// Mostrar el detalle de la tarea con foto y notas
function verDetalleTarea(id) {
    const tareas = Almacen.obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    const detailContent = document.getElementById('task-detail-content');
    if (!detailContent) return;

    detailContent.innerHTML = `
        <div class="detail-card">
        <h3 style="font-size: 18px; color: var(--text-primary);">${tarea.titulo}</h3>
        <p style="font-size: 14px; color: var(--text-secondary);"><strong>Curso:</strong> ${tarea.curso}</p>
        <p style="font-size: 14px; color: var(--text-secondary);"><strong>Entrega:</strong> ${tarea.fecha ? tarea.fecha.replace('T', ' ') : 'Sin fecha'}</p>
        <p style="font-size: 14px; color: var(--text-secondary);"><strong>Modalidad:</strong> ${tarea.tipo}</p>
        
        ${tarea.descripcion ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                <strong>Descripción / Notas:</strong>
                <p style="font-size: 14px; margin-top: 4px; white-space: pre-line; color: var(--text-primary);">${tarea.descripcion}</p>
            </div>
        ` : ''}

        ${tarea.imagen ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
            <strong>Foto / Archivo adjunto:</strong><br>
            <img src="${tarea.imagen}" class="detail-img" alt="Foto de la tarea" style="margin-top:8px; width:100%; border-radius:8px;">
            </div>
        ` : ''}
        </div>
    `;

    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById('view-task-detail').classList.remove('hidden');
}

// Eliminar tarea
function eliminarTareaConConfirmacion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        Almacen.eliminarTarea(id);
        renderizarTareas();
    }
}