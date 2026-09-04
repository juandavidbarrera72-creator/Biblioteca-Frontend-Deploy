/* ==========================================================
   dashboard.js — carga los conteos reales de libros, usuarios,
   autores y préstamos activos para mostrarlos en las tarjetas
   de la página de inicio.
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        cargarConteo("statLibros", obtenerLibros),
        cargarConteo("statUsuarios", obtenerUsuarios),
        cargarConteo("statAutores", obtenerAutores),
        cargarConteoPrestamosActivos(),
    ]);
});

async function cargarConteo(elementId, fnObtener) {
    const el = document.getElementById(elementId);
    if (!el) return;

    try {
        const datos = await fnObtener();
        el.textContent = Array.isArray(datos) ? datos.length : "-";
    } catch (err) {
        el.textContent = "-";
        console.error(err);
    }
}

async function cargarConteoPrestamosActivos() {
    const el = document.getElementById("statPrestamos");
    if (!el) return;

    try {
        const prestamos = await obtenerPrestamos();
        const activos = prestamos.filter((p) => p.estado === "Prestado").length;
        el.textContent = activos;
    } catch (err) {
        el.textContent = "-";
        console.error(err);
    }
}
