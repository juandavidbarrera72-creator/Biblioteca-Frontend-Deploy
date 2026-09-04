/* ==========================================================
   UTILIDADES COMPARTIDAS
   Reemplaza los alert()/confirm() nativos por notificaciones
   más agradables, y centraliza el manejo de errores de la API.
========================================================== */

// Contenedor de toasts (se crea una sola vez, al vuelo)
function obtenerContenedorToasts() {
    let contenedor = document.getElementById("toastContainer");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContainer";
        contenedor.style.position = "fixed";
        contenedor.style.top = "1rem";
        contenedor.style.right = "1rem";
        contenedor.style.zIndex = "1080";
        contenedor.style.display = "flex";
        contenedor.style.flexDirection = "column";
        contenedor.style.gap = "0.5rem";
        document.body.appendChild(contenedor);
    }

    return contenedor;
}

/**
 * Muestra una notificación temporal.
 * @param {string} mensaje
 * @param {"success"|"danger"|"warning"|"info"} tipo
 */
function mostrarToast(mensaje, tipo = "success") {
    const contenedor = obtenerContenedorToasts();

    const toast = document.createElement("div");
    toast.className = `alert alert-${tipo} shadow mb-0`;
    toast.style.minWidth = "260px";
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = "opacity 0.4s";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

/**
 * Convierte una fecha "YYYY-MM-DD" a formato legible en español.
 */
function formatearFecha(fecha) {
    if (!fecha) return "-";

    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;

    return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

/**
 * Muestra un mensaje de error legible cuando falla una llamada a la API
 * (ya sea porque el servidor respondió con error o porque no hay red).
 */
function manejarErrorApi(err) {
    console.error(err);
    mostrarToast(
        "No se pudo conectar con el servidor. Revisa tu conexión o intenta más tarde.",
        "danger"
    );
}
