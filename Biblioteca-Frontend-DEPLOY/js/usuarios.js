let listaUsuarios = [];
let editando = false;

const modal = new bootstrap.Modal(document.getElementById("modalUsuario"));

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();

    document.getElementById("buscarUsuario").addEventListener("input", buscarUsuarios);
    document.getElementById("guardarUsuario").addEventListener("click", guardarUsuario);
});

async function cargarUsuarios() {
    try {
        listaUsuarios = await obtenerUsuarios();
        mostrarUsuarios(listaUsuarios);
    } catch (err) {
        manejarErrorApi(err);
    }
}

function mostrarUsuarios(usuarios) {

    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";

    if (usuarios.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay usuarios para mostrar</td></tr>`;
        return;
    }

    usuarios.forEach(usuario => {

        tabla.innerHTML += `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.telefono ?? ""}</td>
                <td>${usuario.direccion ?? ""}</td>

                <td>
                    <button class="btn btn-warning btn-sm" onclick="editar(${usuario.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="borrar(${usuario.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

    });

}

function buscarUsuarios() {

    const texto = document.getElementById("buscarUsuario").value.toLowerCase();

    const filtrados = listaUsuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.apellido.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto)
    );

    mostrarUsuarios(filtrados);

}

async function guardarUsuario() {

    const id = document.getElementById("idUsuario").value;

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();

    if (!nombre || !apellido || !correo) {
        mostrarToast("Nombre, apellido y correo son obligatorios", "warning");
        return;
    }

    const usuario = {
        nombre,
        apellido,
        correo,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value
    };

    try {

        if (editando) {
            await editarUsuario(id, usuario);
            mostrarToast("Usuario actualizado correctamente");
        } else {
            await agregarUsuario(usuario);
            mostrarToast("Usuario agregado correctamente");
        }

        limpiarFormulario();
        modal.hide();
        await cargarUsuarios();

    } catch (err) {
        manejarErrorApi(err);
    }

}

function editar(id) {

    const usuario = listaUsuarios.find(u => u.id == id);
    if (!usuario) return;

    document.getElementById("idUsuario").value = usuario.id;
    document.getElementById("nombre").value = usuario.nombre;
    document.getElementById("apellido").value = usuario.apellido;
    document.getElementById("correo").value = usuario.correo;
    document.getElementById("telefono").value = usuario.telefono ?? "";
    document.getElementById("direccion").value = usuario.direccion ?? "";

    document.getElementById("tituloModal").innerText = "Editar Usuario";

    editando = true;

    modal.show();

}

async function borrar(id) {

    if (!confirm("¿Desea eliminar este usuario?")) return;

    try {
        await eliminarUsuario(id);
        mostrarToast("Usuario eliminado correctamente");
        await cargarUsuarios();
    } catch (err) {
        manejarErrorApi(err);
    }

}

function limpiarFormulario() {

    document.getElementById("idUsuario").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("direccion").value = "";

    document.getElementById("tituloModal").innerText = "Agregar Usuario";

    editando = false;

}

document.getElementById("modalUsuario").addEventListener("hidden.bs.modal", limpiarFormulario);
