let listaPrestamos = [];
let listaLibros = [];
let listaUsuarios = [];

let modal;


// ==========================
// INICIO
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    modal = new bootstrap.Modal(
        document.getElementById("modalPrestamo")
    );


    cargarDatos();


    document
        .getElementById("buscarPrestamo")
        .addEventListener("input", buscarPrestamos);


    document
        .getElementById("guardarPrestamo")
        .addEventListener("click", guardarPrestamo);

});



// ==========================
// CARGAR DATOS
// ==========================

async function cargarDatos(){

    try {

        listaLibros = await obtenerLibros();
        listaUsuarios = await obtenerUsuarios();

        cargarSelects();

        await cargarPrestamos();

    } catch (err) {
        manejarErrorApi(err);
    }

}



// ==========================
// CARGAR SELECTS
// ==========================

function cargarSelects(){

    const selectLibro = document.getElementById("libro_id");

    const selectUsuario = document.getElementById("usuario_id");


    selectLibro.innerHTML = "";

    selectUsuario.innerHTML = "";



    listaLibros.forEach(libro => {

        selectLibro.innerHTML += `

            <option value="${libro.id}">
                ${libro.titulo}
            </option>

        `;

    });



    listaUsuarios.forEach(usuario => {

        selectUsuario.innerHTML += `

            <option value="${usuario.id}">
                ${usuario.nombre} ${usuario.apellido}
            </option>

        `;

    });


}




// ==========================
// MOSTRAR PRÉSTAMOS
// ==========================

async function cargarPrestamos(){

    try {
        listaPrestamos = await obtenerPrestamos();
        mostrarPrestamos(listaPrestamos);
    } catch (err) {
        manejarErrorApi(err);
    }

}



function mostrarPrestamos(prestamos){

    const tabla = document.getElementById("tablaPrestamos");

    tabla.innerHTML = "";

    if (prestamos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay préstamos para mostrar</td></tr>`;
        return;
    }



    prestamos.forEach(prestamo => {

        // El backend puede devolver el nombre del libro/usuario como
        // "libro_titulo"/"usuario_nombre" (join) o como "libro"/"usuario"
        // según la versión de la API; se soportan ambos por seguridad.
        const tituloLibro = prestamo.libro_titulo ?? prestamo.libro ?? "";
        const nombreUsuario = prestamo.usuario_nombre ?? prestamo.usuario ?? "";

        tabla.innerHTML += `

        <tr>

            <td>${prestamo.id}</td>

            <td>${tituloLibro}</td>

            <td>${nombreUsuario}</td>


            <td>
                ${prestamo.fecha_prestamo
                ? String(prestamo.fecha_prestamo).substring(0,10)
                : ""}
            </td>


            <td>
                ${prestamo.fecha_devolucion
                ? String(prestamo.fecha_devolucion).substring(0,10)
                : ""}
            </td>


            <td>

                ${
                prestamo.estado === "Devuelto"

                ? '<span class="badge bg-success">Devuelto</span>'

                : '<span class="badge bg-warning text-dark">Prestado</span>'
                }

            </td>



            <td>


                <button
                    class="btn btn-warning btn-sm"
                    onclick="prepararEdicionPrestamo(${prestamo.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>



                <button
                    class="btn btn-danger btn-sm"
                    onclick="borrarPrestamo(${prestamo.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>


            </td>


        </tr>

        `;


    });


}




// ==========================
// BUSCAR
// ==========================

function buscarPrestamos(){


    const texto =
    document.getElementById("buscarPrestamo")
    .value
    .toLowerCase();



    const resultado =
    listaPrestamos.filter(prestamo => {

        const tituloLibro = (prestamo.libro_titulo ?? prestamo.libro ?? "").toLowerCase();
        const nombreUsuario = (prestamo.usuario_nombre ?? prestamo.usuario ?? "").toLowerCase();
        const estado = (prestamo.estado ?? "").toLowerCase();

        return tituloLibro.includes(texto) ||
               nombreUsuario.includes(texto) ||
               estado.includes(texto);

    });



    mostrarPrestamos(resultado);


}




// ==========================
// GUARDAR
// ==========================

async function guardarPrestamo(){


    const id =
    document.getElementById("idPrestamo").value;


    const libro_id = document.getElementById("libro_id").value;
    const usuario_id = document.getElementById("usuario_id").value;
    const fecha_prestamo = document.getElementById("fecha_prestamo").value;

    if (!libro_id || !usuario_id || !fecha_prestamo) {
        mostrarToast("Libro, usuario y fecha de préstamo son obligatorios", "warning");
        return;
    }

    const prestamo = {


        libro_id,


        usuario_id,


        fecha_prestamo,


        fecha_devolucion:
        document.getElementById("fecha_devolucion").value || null,


        estado:
        document.getElementById("estado").value


    };


    try {

        // OJO: aquí se llama a la función editarPrestamo(id, prestamo)
        // definida en api.js (la llamada real a la API). Antes existía
        // una función con el MISMO NOMBRE en este archivo que solo
        // rellenaba el formulario, y al ser ambas funciones globales, la
        // segunda pisaba a la primera: al editar, nunca se guardaba
        // nada en la base de datos. Por eso esa función de UI se
        // renombró a prepararEdicionPrestamo().
        if(id === ""){

            await agregarPrestamo(prestamo);

        }else{

            await editarPrestamo(id, prestamo);

        }


        mostrarToast("Préstamo guardado correctamente");

        modal.hide();

        limpiarFormulario();

        await cargarPrestamos();

    } catch (err) {
        manejarErrorApi(err);
    }


}




// ==========================
// PREPARAR EDICIÓN (rellenar formulario)
// ==========================

function prepararEdicionPrestamo(id){


    const prestamo =
    listaPrestamos.find(p => p.id == id);

    if (!prestamo) return;


    document.getElementById("idPrestamo").value =
    prestamo.id;


    document.getElementById("libro_id").value =
    prestamo.libro_id;


    document.getElementById("usuario_id").value =
    prestamo.usuario_id;


    document.getElementById("fecha_prestamo").value =
    prestamo.fecha_prestamo ? String(prestamo.fecha_prestamo).substring(0,10) : "";



    document.getElementById("fecha_devolucion").value =
    prestamo.fecha_devolucion
    ? String(prestamo.fecha_devolucion).substring(0,10)
    : "";



    document.getElementById("estado").value =
    prestamo.estado;



    document.getElementById("tituloModal").innerText =
    "Editar Préstamo";


    modal.show();


}




// ==========================
// ELIMINAR
// ==========================

async function borrarPrestamo(id){


    if(!confirm("¿Desea eliminar este préstamo?"))
    return;


    try {

        await eliminarPrestamo(id);

        mostrarToast("Préstamo eliminado correctamente");

        await cargarPrestamos();

    } catch (err) {
        manejarErrorApi(err);
    }


}




// ==========================
// LIMPIAR
// ==========================

function limpiarFormulario(){


    document.getElementById("idPrestamo").value = "";

    document.getElementById("fecha_prestamo").value = "";

    document.getElementById("fecha_devolucion").value = "";

    document.getElementById("estado").value = "Prestado";


}
