// Variables y selectores
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

// Funciones
const cargarEventListeners = () => {
    // Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Vacía el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Reseteamos el arreglo
        limpiarHTML(); // Eliminamos todo el HTML
    });

    // Muestra los cursos del localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

}

// Agrega un curso al carrito
const agregarCurso = (e) => {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
const eliminarCurso = (e) => {
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}


// Lee el contenido del HTML al que le dimos click y extrae la información del curso
const leerDatosCurso = (curso) => {
    // console.log(curso);
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe){
        // Actualizamos la cantidad con map que retorna un nuevo arreglo
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // agregar elementos al arreglo de carrito
        // usando el spread operator, se agregan primero los artículos anteriormente agregados
        // De esa manera no se pierden los artículos que ya estaban en el carrito (no se pierde la referencia)
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    // console.log(infoCurso);
    // console.log(articulosCarrito);
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
const carritoHTML = () => {

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        // Destructuring
        // para evitar colocar curso.imagen, curso.titulo, etc.
        const { imagen, titulo, precio, cantidad, id } = curso;
        //
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
        `;
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agrega el carrito de compras al localStorage
    sincronizarStorage();
    
}

// Sincroniza los cursos del carrito con el localStorage
const sincronizarStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
const limpiarHTML = () => {
    // Forma lenta
    // contenedorCarrito.innerHTML = '';
    // Forma rápida
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

cargarEventListeners();

// Flujo del código:

// 1. Cuando se presiona "Agregar al carrito", se ejecuta la función agregarCurso.
// Nos aseguramos que el usuario haya presionado en agregar carrito, y no en cualquier otro lugar del curso,
// y accedemos a todo el div con el contenido del curso.
// 2. Luego leemos los datos del curso con la función leerDatosCurso, y creamos un objeto con los datos que requerimos.
// Lo agregamos al carrito de compras con el spread operator, y lo mostramos (imprimimos) en el HTML con la función carritoHTML.
// 3. La función carritoHTML muestra el carrito en el HTML, contiene la función limpiarHTML que limpia el HTML antes de mostrarlo,
// para no tener duplicados, y recorre el arreglo de articulosCarrito generando el HTML.
// Este mantiene la referencia del arreglo de articulosCarrito, por lo que no se pierden los artículos que ya estaban en el carrito.
// Si hay uno o dos, y se siguen agregando, va a limpiar el HTML previo y luego crear el HTML nuevamente con los artículos que ya estaban
// y los que se agregaron.

