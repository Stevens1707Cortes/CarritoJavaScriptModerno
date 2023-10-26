// Variables

const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
let articulosCompras = [];

// Se crea una funcion que carga los eventListeners de las variables que lo necesiten
cargarEventListeners();
function cargarEventListeners() {

    //Cuando el documento esta listo
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCompras = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //Agregar un curso al carrito cuando das click a "Agregar carrito"
    listaCursos.addEventListener('click', agregarCarrito);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar el carrito
    btnVaciarCarrito.addEventListener('click', ()=>{
        // Reiniciar arreglo del carrito de compras
        articulosCompras = [];

        // Limpiar el HTML
        limpiarHTML();
    });

}

//Funciones

function agregarCarrito(e) {
    e.preventDefault();


    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement; // Variable para los datos del curso
        leerDatosCurso(cursoSeleccionado);
    }

}

function eliminarCurso(e) {
    e.preventDefault();
    const cursoId = e.target.getAttribute('data-id');
    const cursoContador = e.target.parentElement.previousElementSibling.textContent;

    if (e.target.classList.contains('borrar-curso') && cursoContador > 1){
        
        // Actualizamos la cantidad
        const cursos = articulosCompras.map( curso => {
            if (curso.id === cursoId) {
                curso.cantidad--;
                return curso; // retorna el objeto actualizado
            }else{
                return curso; // retorna los objetos que no son duplicados
            }
        });

        articulosCompras = [...cursos];
        
    }else{

        // Eliminar del arreglo articulosCompras por el data-id
        articulosCompras = articulosCompras.filter((curso)=> curso.id !== cursoId);

    }

    sincronizarLocalStorage();
    carritoHTML(); // MANDO LLAMAR LA FUNCION QUE IMPRIME EL HTML - Iterar sobre el carrito y mostrar HTML
}

// Lee el contenido del HTML al que le damos click

function leerDatosCurso(cursoSeleccionado) {

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: cursoSeleccionado.querySelector('img').src,
        nombre: cursoSeleccionado.querySelector('h4').textContent,
        precio: cursoSeleccionado.querySelector('.precio span').textContent,
        id: cursoSeleccionado.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    
    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCompras.some((curso)=> curso.id === infoCurso.id ); // Se hizo con el id, o se puede con el nombre tambien

    if (!existe) {
        // Agregar elementos al arreglo del carrito
        articulosCompras = [...articulosCompras, infoCurso];

    }else{
        // Actualizamos la cantidad
        const cursos = articulosCompras.map( curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            }else{
                return curso; // retorna los objetos que no son duplicados
            }
        });

        articulosCompras = [...cursos];

    }
    // NOTA: LA FUNCION carritoHTML() se pone fuera del condicional, puesto que debe ejecutarse despues de que alguna de las
    //condiciones se ejecute, ya sea if o else. Esto hace que dependiendo la condicion, la informacion se actualice de una u
    //otra forma.
    carritoHTML();
    console.log(articulosCompras);
   
}   

// Muestra el Carrito de compras en el HTML
function carritoHTML() {

    // Limpiar HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCompras.forEach( curso => {
        // Destructuring para mejorar el codigo
        const {imagen, nombre, precio, id, cantidad} = curso;
        //
        const row =  document.createElement('tr');

        row.innerHTML = `
        <td>
            <img src=${imagen}>
        </td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `;
        
        // Agrega el HTML del carrito al tbdoy
        contenedorCarrito.appendChild(row);

    });
    
    sincronizarLocalStorage();
}

// Elimina los cursos del tbdoy
function limpiarHTML() {
   
    // Forma rapida
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    
}

// LocalStorage

function sincronizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCompras));
}