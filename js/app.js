// VARIABLES

const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const btnVaciarCarrito = document.querySelector("#vaciar-carrito");

let articulosCarrito = [];

// LISTENERS

cargarListeners();
function cargarListeners() {
    // Cargar los cursos del LocalStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        actualizarCarrito();
    });

    // Agregar curso al carrito
    listaCursos.addEventListener('click', agregarCurso);

    // Eliminar cursos del carrito
    carrito.addEventListener('click', eliminarCurso)

    // Vaciar el carrito
    btnVaciarCarrito.addEventListener('click', vaciarCarrito)
}

// FUNCIONES

function agregarCurso(e) {
    e.preventDefault() // Prevenir acción predeterminada del botón

    // Delegation -> Detectar si es el botón de "Agregar carrito"
    if (e.target.classList.contains('agregar-carrito')) {
        // Leer los datos del curso al que se le dió click
        const cursoSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado);
    }
}

function leerDatosCurso(cursoNuevo) {
    // Agrupar información necesaria
    const infoCurso = {
        id: cursoNuevo.querySelector('a').getAttribute('data-id'),
        titulo: cursoNuevo.querySelector('h4').textContent,
        precio: cursoNuevo.querySelector('.precio span').textContent,
        imagen: cursoNuevo.querySelector('img').src,
        cantidad: 1
    }

    // Revisar si un elemento ya existe en el carrito
    const existeCurso = articulosCarrito.some(curso => curso.id === infoCurso.id);

    if (existeCurso) {
        // Actualizar cantidad del curso
        const cursos = articulosCarrito.map(curso => {
            if (curso.id == infoCurso.id) {
                curso.cantidad++;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los no duplicados
            }
        });

        // Sobreecribir el arreglo viejo con el actualizado
        articulosCarrito = [...cursos]
    } else {
        // Agregar curso nuevo al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    // Limpiar HTML previo del carrito
    limpiarCarrito()

    // Recorrer el carrito y generar HTML
    articulosCarrito.forEach(curso => {
        // Destructuring del curso
        const { id, titulo, precio, imagen, cantidad } = curso

        // Crear elemento HTML del curso en el carrito
        const row = document.createElement('TR');
        row.innerHTML = `
            <td><img src="${imagen}" alt="Curso ${id}" width="100" ></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
        `;

        // Agregar el elemento al tbody del carrito
        contenedorCarrito.appendChild(row)
    });

    // Agregar el carrito al LocalStorage
    sincronizarStorage();
}

function limpiarCarrito() {
    // Eliminar el primer hijo, si no hay primer hijo, dejar de ejecutar
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function eliminarCurso(e) {
    e.preventDefault() // Prevenir acción predeterminada del botón

    // Delegation -> Detectar si es el botón "X" de cada curso
    if (e.target.classList.contains('borrar-curso')) {
        // Conseguir ID del curso a eliminar
        const cursoID = e.target.getAttribute('data-id');

        // Eliminar del arreglo articulosCarrito
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoID)

        actualizarCarrito();
    }
}

function vaciarCarrito(e) {
    // Resetear arreglo
    articulosCarrito = [];

    // Limpiar todos los HTML
    limpiarCarrito();
}