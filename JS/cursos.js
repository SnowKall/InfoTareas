document.addEventListener('DOMContentLoaded', () => {
    const btnAddCourse = document.getElementById('btn-add-course');
    const btnBackCourse = document.getElementById('btn-back-course');
    const formCourse = document.getElementById('form-course');
    const hasGroupSelect = document.getElementById('course-has-group');
    const groupFields = document.getElementById('group-fields');

    // Mostrar / ocultar campos de grupo según la selección
    if (hasGroupSelect) {
        hasGroupSelect.addEventListener('change', (e) => {
        if (e.target.value === 'si') {
            groupFields.classList.remove('hidden');
        } else {
            groupFields.classList.add('hidden');
        }
        });
    }

    // Navegación a pantalla de agregar curso
    if (btnAddCourse) {
        btnAddCourse.addEventListener('click', () => {
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.getElementById('view-add-course').classList.remove('hidden');
        });
    }

    if (btnBackCourse) {
        btnBackCourse.addEventListener('click', () => {
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.getElementById('view-courses').classList.remove('hidden');
        });
    }

    // Guardar nuevo curso
    if (formCourse) {
        formCourse.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevoCurso = {
            id: Date.now(),
            nombre: document.getElementById('course-name').value,
            profesor: document.getElementById('course-prof').value,
            tieneGrupo: hasGroupSelect.value === 'si',
            integrantes: document.getElementById('group-members').value,
            link: document.getElementById('course-link').value
        };

        Almacen.guardarCurso(nuevoCurso);
        formCourse.reset();
        groupFields.classList.add('hidden');

        // Volver a la lista de cursos
        btnBackCourse.click();
        renderizarCursos();
        actualizarSelectCursosFormTarea();
        });
    }

    renderizarCursos();
    actualizarSelectCursosFormTarea();
});

// Pintar la lista de cursos con botón de eliminar
function renderizarCursos() {
    const container = document.getElementById('courses-list');
    const cursos = Almacen.obtenerCursos();

    if (!container) return;

    if (cursos.length === 0) {
        container.innerHTML = `<p style="text-align:center; color: var(--text-secondary); margin-top:20px;">Aún no has registrado cursos. Usa el botón + para agregar uno.</p>`;
        return;
    }

    container.innerHTML = cursos.map(c => `
        <article class="task-card" style="flex-direction: column; align-items: flex-start; gap: 6px; position: relative;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                <h3 class="task-title" style="font-size: 16px;">📚 ${c.nombre}</h3>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge ${c.tieneGrupo ? 'badge-group' : 'badge-date'}">${c.tieneGrupo ? 'Grupal' : 'Individual'}</span>
                    <button class="btn-delete-task" onclick="eliminarCursoConConfirmacion(${c.id})">✕</button>
                </div>
            </div>
            ${c.profesor ? `<p class="task-course">Profe: ${c.profesor}</p>` : ''}
            ${c.tieneGrupo && c.integrantes ? `
                <div style="background: var(--bg-color); padding: 8px; border-radius: 6px; width: 100%; font-size: 12px; margin-top: 4px;">
                    <strong>👥 Equipo:</strong><br>${c.integrantes.replace(/\n/g, '<br>')}
                </div>
            ` : ''}
            ${c.link ? `<a href="${c.link}" target="_blank" style="font-size:12px; color: var(--primary-color); text-decoration: none; margin-top:4px;">🔗 Enlace de materiales / Drive</a>` : ''}
        </article>
    `).join('');
}

// Función para eliminar curso con confirmación
function eliminarCursoConConfirmacion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        let cursos = Almacen.obtenerCursos();
        cursos = cursos.filter(c => c.id !== id);
        localStorage.setItem('info_cursos', JSON.stringify(cursos));
        
        renderizarCursos();
        actualizarSelectCursosFormTarea();
    }
}

// Llenar dinámicamente el selector de cursos al crear una tarea
function actualizarSelectCursosFormTarea() {
    const select = document.querySelector('#form-task select');
    if (!select) return;

    const cursos = Almacen.obtenerCursos();
    select.innerHTML = `<option value="" disabled selected>Selecciona un curso</option>`;
    
    cursos.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.nombre;
        opt.textContent = c.nombre;
        select.appendChild(opt);
    });
}