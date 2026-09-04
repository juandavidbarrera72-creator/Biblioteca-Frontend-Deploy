const API_URL = "https://api-biblioteca-1ibw8.onrender.com";

/**
 * Wrapper central de fetch: agrega headers, valida el status HTTP y
 * lanza un error legible en vez de dejar que falle en silencio.
 * (En la versión anterior, un error del servidor o de red simplemente
 * rompía la página sin avisar qué pasó.)
 */
async function apiFetch(path, opciones = {}) {
    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...opciones,
        });
    } catch (err) {
        // Error de red: el servidor no respondió en absoluto
        throw new Error(
            "No se pudo contactar al servidor. Puede estar caído o iniciando (espera unos segundos y reintenta)."
        );
    }

    let data = null;
    try {
        data = await respuesta.json();
    } catch (_) {
        // Respuesta sin cuerpo JSON (poco común, pero no debe romper)
    }

    if (!respuesta.ok) {
        throw new Error((data && data.mensaje) || `Error ${respuesta.status} del servidor`);
    }

    return data;
}

// ==================== LIBROS ====================

async function obtenerLibros() {
    return apiFetch("/libros");
}

async function agregarLibro(libro) {
    return apiFetch("/libros", { method: "POST", body: JSON.stringify(libro) });
}

async function editarLibro(id, libro) {
    return apiFetch(`/libros/${id}`, { method: "PUT", body: JSON.stringify(libro) });
}

async function eliminarLibro(id) {
    return apiFetch(`/libros/${id}`, { method: "DELETE" });
}

// ==================== USUARIOS ====================

async function obtenerUsuarios() {
    return apiFetch("/usuarios");
}

async function agregarUsuario(usuario) {
    return apiFetch("/usuarios", { method: "POST", body: JSON.stringify(usuario) });
}

async function editarUsuario(id, usuario) {
    return apiFetch(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(usuario) });
}

async function eliminarUsuario(id) {
    return apiFetch(`/usuarios/${id}`, { method: "DELETE" });
}

// ==================== AUTORES ====================

async function obtenerAutores() {
    return apiFetch("/autores");
}

async function agregarAutor(autor) {
    return apiFetch("/autores", { method: "POST", body: JSON.stringify(autor) });
}

async function editarAutor(id, autor) {
    return apiFetch(`/autores/${id}`, { method: "PUT", body: JSON.stringify(autor) });
}

async function eliminarAutor(id) {
    return apiFetch(`/autores/${id}`, { method: "DELETE" });
}

// ==================== PRÉSTAMOS ====================

async function obtenerPrestamos() {
    return apiFetch("/prestamos");
}

async function agregarPrestamo(prestamo) {
    return apiFetch("/prestamos", { method: "POST", body: JSON.stringify(prestamo) });
}

async function editarPrestamo(id, prestamo) {
    return apiFetch(`/prestamos/${id}`, { method: "PUT", body: JSON.stringify(prestamo) });
}

async function eliminarPrestamo(id) {
    return apiFetch(`/prestamos/${id}`, { method: "DELETE" });
}
