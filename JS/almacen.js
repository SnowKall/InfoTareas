// Manejo de LocalStorage para guardar datos persistentes
const Almacen = {
    obtenerCursos() {
        return JSON.parse(localStorage.getItem('info_cursos')) || [];
    },
    guardarCurso(curso) {
        const cursos = this.obtenerCursos();
        cursos.push(curso);
        localStorage.setItem('info_cursos', JSON.stringify(cursos));
    },
    obtenerTareas() {
        return JSON.parse(localStorage.getItem('info_tareas')) || [];
    },
    guardarTarea(tarea) {
        const tareas = this.obtenerTareas();
        tareas.push(tarea);
        localStorage.setItem('info_tareas', JSON.stringify(tareas));
    },
    eliminarTarea(id) {
        let tareas = this.obtenerTareas();
        tareas = tareas.filter(t => t.id !== id);
        localStorage.setItem('info_tareas', JSON.stringify(tareas));
    }
};