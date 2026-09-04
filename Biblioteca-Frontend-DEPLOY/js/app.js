/* ==========================================================
   app.js — inicialización general de la página de inicio.
   Verifica si el backend está disponible y avisa claramente
   si no lo está, en vez de dejar el dashboard en blanco sin
   explicación (que era el síntoma reportado: "solo sirve el
   frontend, las funciones no").
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const banner = document.getElementById("estadoServidor");
    if (!banner) return;

    try {
        const respuesta = await fetch(`${API_URL}/health`);
        const data = await respuesta.json();

        if (respuesta.ok && data.estado === "ok") {
            banner.className = "alert alert-success text-center";
            banner.textContent = "✅ Conectado al servidor correctamente.";
        } else {
            banner.className = "alert alert-warning text-center";
            banner.textContent =
                "⚠️ El servidor respondió, pero no logra conectarse a la base de datos.";
        }
    } catch (err) {
        banner.className = "alert alert-danger text-center";
        banner.textContent =
            "❌ No se pudo contactar al servidor. Puede estar iniciando (espera unos segundos y recarga) o estar caído.";
    }
});
