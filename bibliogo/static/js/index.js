//  TABLA LIBROS

const libros = [];
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:5000/libros/")
    .then((response) => response.json())
    .then((data) => {
      const contenedorLibros = document.querySelector("#librosContenedor");
      data.forEach((libro) => {
        console.log(libro);
        libros.push(libro);
        const tr = document.createElement("tr");
        /* tr.classList.add("producto"); */
        tr.innerHTML = `
                        <tr>
                          <td>${libro.isbn}</td>
                          <td>${libro.titulo}</td>
                          <td>${libro.autor}</td>
                          <td>${libro.categoria}</td>
                          <td>${libro.cantidad}</td>
                        </tr>
                    `;
        contenedorLibros.append(tr);
      });
      cargarProductos(data);
      actualizarBotonesAgregar();
      cargarProductos(data);
    })
    .catch((error) => console.error("Error fetching products:", error));
});


// BUSQUEDA DE LIBROS ######################################################################

// Obtener referencias a los elementos del DOM
const searchInput = document.getElementById('librosInput');
const librosContenedor = document.getElementById('librosContenedor');

// Suponiendo que tienes un array de libros con esta estructura

// Función para mostrar todos los libros
function mostrarLibros(librosf) {
  librosContenedor.innerHTML = '';
  librosf.forEach(libro => {
    const row = `
      <tr>
        <td>${libro.isbn}</td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.categoria}</td>
        <td>${libro.cantidad}</td>
      </tr>
    `;
    librosContenedor.innerHTML += row;
  });
}

// Función para filtrar libros
function filtrarLibros(busqueda) {
  return libros.filter(libro =>
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.isbn.toLowerCase().includes(busqueda.toLowerCase())
  );
}

// Escuchar el evento 'keyup' en el campo de búsqueda
searchInput.addEventListener('keyup', function () {
  const busqueda = this.value;
  const librosFiltrados = filtrarLibros(busqueda);
  mostrarLibros(librosFiltrados);
});

// Mostrar todos los libros al cargar la página
mostrarLibros(libros);

//  TABLA ALUMNOSd ######################################################################
const alumnos = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:5000/alumnos/")
    .then((response) => response.json())
    .then((data) => {
      const contenedoralumnos = document.querySelector("#alumnosContenedor");

      // Limpiar el contenido del contenedor antes de agregar nuevos elementos
      contenedoralumnos.innerHTML = '';

      data.forEach((alumno) => {
        const dni = alumno.dni;

        if (!alumnos.has(dni)) {
          alumnos.add(dni);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${alumno.dni}</td>
            <td>${alumno.nombres}</td>
            <td>${alumno.apellidoPat}</td>
            <td>${alumno.apellidoMat}</td>
          `;
          contenedoralumnos.append(tr);
        }
      });

      // Asumiendo que cargarProductos y actualizarBotonesAgregar son necesarias después de agregar los elementos
      cargarProductos(data);
      actualizarBotonesAgregar();
    })
    .catch((error) => console.error("Error fetching products:", error));
});


// BUSQUEDA DE ALUMNOS ######################################################################

// Obtener referencias a los elementos del DOM
const searchInputAlumnos = document.getElementById('alumnoInput');
const alumnosContenedor = document.getElementById('alumnosContenedor');


// Función para mostrar todos los alumnos
function mostrarAlumnos(alumnosf) {
  alumnosContenedor.innerHTML = '';
  alumnosf.forEach(alumno => {
    const rowAl = `
      <tr>
        <td>${alumno.dni}</td>
        <td>${alumno.nombres}</td>k
        <td>${alumno.apellidoPat}</td>
        <td>${alumno.apellidoMat}</td>
      </tr>
    `;
    alumnosContenedor.innerHTML += rowAl;
  });
}

// Función para filtrar libros
function filtrarAlumnos(busqueda) {
  return alumnos.filter(alumno =>
    alumno.dni.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.apellidoPat.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.apellidoMat.toLowerCase().includes(busqueda.toLowerCase())
  );
}

// Escuchar el evento 'keyup' en el campo de búsqueda
searchInputAlumnos.addEventListener('keyup', function () {
  const busqueda = this.value;
  const alumnosFiltrados = filtrarAlumnos(busqueda);
  mostrarAlumnos(alumnosFiltrados);
});

// Mostrar todos los libros al cargar la páginA


// TABLA PRESTAMOS ######################################################################
const prestamos = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:5000/prestamos/")
    .then((response) => response.json())
    .then((data) => {
      const contenedorprestamos = document.querySelector("#prestamosContenedor");

      // Limpiar el contenido del contenedor antes de agregar nuevos elementos
      contenedorprestamos.innerHTML = '';

      data.forEach((prestamo) => {
        const key = `${prestamo.alumnoPrestado.nombres}-${prestamo.libroPrestado.titulo}`;

        if (!prestamos.has(key)) {
          prestamos.add(key);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${prestamo.alumnoPrestado.nombres}</td>
            <td>${prestamo.libroPrestado.titulo}</td>
            <td>${prestamo.fechaPrestamo}</td>
            <td>${prestamo.fechaDevolucion}</td>
          `;
          contenedorprestamos.append(tr);
        }
      });

      // Asumiendo que cargarProductos y actualizarBotonesAgregar son necesarias después de agregar los elementos
      cargarProductos(data);
      actualizarBotonesAgregar();
    })
    .catch((error) => console.error("Error fetching products:", error));
});

// BUSQUEDA DE PRESTAMOS ######################################################################

// Obtener referencias a los elementos del DOM
const searchInputPrestamos = document.getElementById('prestamoInput');
const prestamosContenedor = document.getElementById('prestamosContenedor');


// Función para mostrar todos los alumnos
function mostrarPrestamos(prestamosf) {
  prestamosContenedor.innerHTML = '';
  prestamosf.forEach(prestamo => {
    const rowPr = `
      <tr>
        <td>${prestamo.alumnoPrestado.nombres}</td>
        <td>${prestamo.libroPrestado.titulo}</td>
        <td>${prestamo.fechaPrestamo}</td>
        <td>${prestamo.fechaDevolucion}</td>
      </tr>
    `;
    prestamosContenedor.innerHTML += rowPr;
  });
}

// Función para filtrar libros
function filtrarPrestamos(busqueda) {
  return prestamos.filter(prestamo =>
    prestamo.alumnoPrestado.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    prestamo.libroPrestado.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    prestamo.fechaPrestamo.toLowerCase().includes(busqueda.toLowerCase()) ||
    prestamo.fechaDevolucion.toLowerCase().includes(busqueda.toLowerCase())
  );
}

// Escuchar el evento 'keyup' en el campo de búsqueda
searchInputPrestamos.addEventListener('keyup', function () {
  const busqueda = this.value;
  const prestamosFiltrados = filtrarPrestamos(busqueda);
  mostrarPrestamos(prestamosFiltrados);
});

// Mostrar todos los libros al cargar la páginA

