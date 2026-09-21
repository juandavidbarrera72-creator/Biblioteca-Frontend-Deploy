let listaLibros = [];
let editando = false;

const modal = new bootstrap.Modal(document.getElementById("modalLibro"));

document.addEventListener("DOMContentLoaded", async () => {

    await cargarLibros();

    document
        .getElementById("buscarLibro")
        .addEventListener("input", buscarLibros);

    document
        .getElementById("guardarLibro")
        .addEventListener("click", guardarLibro);

});

async function cargarLibros() {

    try {
        listaLibros = await obtenerLibros();
        mostrarLibros(listaLibros);
    } catch (err) {
        manejarErrorApi(err);
    }

}

function mostrarLibros(libros) {

    const tabla = document.getElementById("tablaLibros");

    tabla.innerHTML = "";

    if (libros.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay libros para mostrar</td></tr>`;
        return;
    }

    libros.forEach(libro => {

        tabla.innerHTML += `
        <tr>

            <td>${libro.id}</td>

            <td>${libro.titulo}</td>

            <td>${libro.categoria ?? ""}</td>

            <td>${libro.editorial ?? ""}</td>

            <td>${libro.anio_publicacion ?? ""}</td>

            <td>
                ${libro.disponible
                    ? '<span class="badge bg-success">Sí</span>'
                    : '<span class="badge bg-danger">No</span>'}
            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editar(${libro.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="borrar(${libro.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

}

function buscarLibros() {

    const texto = document
        .getElementById("buscarLibro")
        .value
        .toLowerCase();

    const resultado = listaLibros.filter(libro =>
        libro.titulo.toLowerCase().includes(texto)
    );

    mostrarLibros(resultado);

}

async function guardarLibro() {

    const id = document.getElementById("idLibro").value;

    const titulo = document.getElementById("titulo").value.trim();

    if (!titulo) {
        mostrarToast("El título es obligatorio", "warning");
        return;
    }

    const libro = {

        titulo,
        isbn: "",
        categoria: document.getElementById("categoria").value,
        editorial: document.getElementById("editorial").value,
        anio_publicacion: document.getElementById("anio").value ? parseInt(document.getElementById("anio").value) : null,
        disponible: true,
        imagen: "",
        autor_id: null

    };

    try {

        if (editando) {
            await editarLibro(id, libro);
            mostrarToast("Libro actualizado correctamente");
        } else {
            await agregarLibro(libro);
            mostrarToast("Libro agregado correctamente");
        }

        limpiarFormulario();
        modal.hide();
        await cargarLibros();

    } catch (err) {
        manejarErrorApi(err);
    }

}

function editar(id) {

    const libro = listaLibros.find(l => l.id == id);
    if (!libro) return;

    document.getElementById("idLibro").value = libro.id;
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("categoria").value = libro.categoria ?? "";
    document.getElementById("editorial").value = libro.editorial ?? "";
    document.getElementById("anio").value = libro.anio_publicacion ?? "";

    document.getElementById("tituloModal").innerText = "Editar Libro";

    editando = true;

    modal.show();

}

async function borrar(id) {

    const confirmar = confirm("¿Desea eliminar este libro?");

    if (!confirmar) return;

    try {
        await eliminarLibro(id);
        mostrarToast("Libro eliminado correctamente");
        await cargarLibros();
    } catch (err) {
        manejarErrorApi(err);
    }

}

function limpiarFormulario() {

    document.getElementById("idLibro").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("editorial").value = "";
    document.getElementById("anio").value = "";

    document.getElementById("tituloModal").innerText = "Agregar Libro";

    editando = false;

}
