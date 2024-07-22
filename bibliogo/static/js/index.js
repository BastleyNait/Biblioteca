//  TABLA LIBROS

const libros = [];
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://bibliotecabackend-1.onrender.com/libros/")
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
                          <td>
                         <button class="btn btn-primary modificar-btn" data-isbn="${libro.isbn}" id="modificarLibro" >Modificar</button>
                         <button class="btn btn-danger eliminar-btn" data-isbn="${libro.isbn}"    id="eliminarLibro"   >Eliminar</button>
                          </td>
                          
                        </tr>
                    `;
        contenedorLibros.append(tr);
      });


      
      asignarEventosModificarLibro();

      asignarEventosEliminarLibro();


      actualizarBotonesAgregar();
      cargarProductos(data);
    })
    .catch((error) => console.error("Error fetching products:", error));
});
// BORRAR DE LIBROS ######################################################################
// Función para asignar eventos a los botones de eliminar
function asignarEventosEliminarLibro() {
  const botonesEliminar = document.querySelectorAll("#eliminarLibro");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const isbn = this.getAttribute("data-isbn");
      eliminarLibro(isbn);
    });
  });
}

// Función para eliminar un libro por su ISBN
function eliminarLibro(isbn) {
  // Enviar solicitud DELETE al API
  fetch(`https://bibliotecabackend-1.onrender.com/libros/${isbn}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        // Eliminar de la tabla
        const filaAEliminar = Array.from(document.querySelectorAll("#contenedorLibros tr"))
          .find(row => row.querySelector("td").textContent === isbn);
        if (filaAEliminar) {
          filaAEliminar.remove();
        }

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Libro eliminado exitosamente",
          icon: "success",
        });
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud: " + error.message,
      });
    });
}





// MODIFICAR DE LIBROS ######################################################################

function asignarEventosModificarLibro() {
  const botonesModificar = document.querySelectorAll("#modificarLibro");
  botonesModificar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const isbn = this.getAttribute("data-isbn");
      mostrarPanelModificarLibro(isbn);
    });
  });
}

// Función para mostrar el panel de modificación de libro
function mostrarPanelModificarLibro(isbn) {
  // Obtener el libro del array de libros (asumiendo que tienes un array llamado 'libros')
  const libro = libros.find(l => l.isbn === isbn);
  if (!libro) return;

  const panelModificar = document.querySelector("#panelModificar");

  panelModificar.className = 'modal fade';
  panelModificar.setAttribute('tabindex', '-1');
  panelModificar.setAttribute('role', 'dialog');
  panelModificar.setAttribute('aria-labelledby', 'modificarLibroModalLabel');
  panelModificar.setAttribute('aria-hidden', 'true');

  panelModificar.innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modificarLibroModalLabel">Modificar Libro</h5>
        </div>
        <div class="modal-body">
          <form id="formModificarLibro">
            <div class="form-group">
              <label for="isbn">ISBN</label>
              <input type="text" class="form-control" id="isbn" value="${libro.isbn}" disabled>
            </div>
            <div class="form-group">
              <label for="titulo">Título</label>
              <input type="text" class="form-control" id="titulo" value="${libro.titulo}">
            </div>
            <div class="form-group">
              <label for="autor">Autor</label>
              <input type="text" class="form-control" id="autor" value="${libro.autor}">
            </div>
            <div class="form-group">
              <label for="categoria">Categoría</label>
              <input type="text" class="form-control" id="categoria" value="${libro.categoria}">
            </div>
            <div class="form-group">
              <label for="cantidad">Cantidad</label>
              <input type="number" class="form-control" id="cantidad" value="${libro.cantidad}">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancelarModificarLibro">Cancelar</button>
          <button type="button" class="btn btn-primary" id="enviarModificarLibro">Guardar cambios</button>
        </div>
      </div>
    </div>
  `;

  // Mostrar el modal
  $('#panelModificar').modal('show');

  // Función para cerrar el modal y limpiar
  function cerrarYLimpiarModal() {
    $('#panelModificar').modal('hide');
    $('#panelModificar').on('hidden.bs.modal', function (e) {
      // No es necesario remover el panel, ya que lo estamos reutilizando
    });
  }

  // Asignar eventos al botón de enviar
  document.getElementById("enviarModificarLibro").addEventListener("click", function () {
    const updatedLibro = {
      isbn: libro.isbn,
      titulo: document.getElementById("titulo").value,
      autor: document.getElementById("autor").value,
      categoria: document.getElementById("categoria").value,
      cantidad: parseInt(document.getElementById("cantidad").value)
    };
    modificarLibro(updatedLibro);
    cerrarYLimpiarModal();
  });

  // Asignar evento al botón de cancelar
  $('#cancelarModificarLibro').on('click', function (e) {
    cerrarYLimpiarModal();
  });

  // Cerrar modal al hacer clic fuera de él
  $('#panelModificar').on('click', function (e) {
    if (e.target !== this) return;
    cerrarYLimpiarModal();
  });

  // Manejar el cierre del modal con la tecla Esc
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      cerrarYLimpiarModal();
    }
  });
}

// Función para modificar un libro por su ISBN
function modificarLibro(libro) {
  fetch(`https://bibliotecabackend-1.onrender.com/libros/${libro.isbn}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(libro)
  })
    .then((response) => {
      if (response.ok) {
        // Actualizar la tabla
        const filaAModificar = Array.from(document.querySelectorAll("#contenedorLibros tr"))
          .find(row => row.querySelector("td").textContent === libro.isbn);
        if (filaAModificar) {
          filaAModificar.innerHTML = `
            <td>${libro.isbn}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.categoria}</td>
            <td>${libro.cantidad}</td>
            <td>
              <button class="btn btn-primary modificar-btn" data-isbn="${libro.isbn}">Modificar</button>
              <button class="btn btn-danger eliminar-btn" data-isbn="${libro.isbn}">Eliminar</button>
            </td>
          `;
        }

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Libro modificado exitosamente",
          icon: "success",
        });

        // Asignar eventos a los nuevos botones de eliminar y modificar
        asignarEventosEliminarLibro();
        asignarEventosModificarLibro();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud: " + error.message,
      });
    });
}

// Asignar eventos después de cargar los libros
function asignarEventosLibros() {
  asignarEventosModificarLibro();
  asignarEventosEliminarLibro();
}

// BUSQUEDA DE LIBROS ######################################################################

// Obtener referencias a los elementos del DOM
const searchInput = document.getElementById('librosInput');
const librosContenedor = document.getElementById('librosContenedor');
document.addEventListener("DOMContentLoaded", function () {

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
                    <td>
              <button class="btn btn-primary modificar-btn" data-isbn="${libro.isbn}">Modificar</button>
              <button class="btn btn-danger eliminar-btn" data-isbn="${libro.isbn}">Eliminar</button>
            </td>
      </tr>
    `;
    librosContenedor.innerHTML += row;
  });
}
asignarEventosEliminarLibro();
asignarEventosModificarLibro();

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
});
// Mostrar todos los libros al cargar la página

//  TABLA ALUMNOS ######################################################################
const alumnos  = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://bibliotecabackend-1.onrender.com/alumnos/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const contenedoralumnos = document.querySelector("#alumnosContenedor");

      // Limpiar el contenido del contenedor antes de agregar nuevos elementos
      contenedoralumnos.innerHTML = '';

      data.forEach((alumno) => {
        const dni = alumno.dni;

        if (!alumnos.has(dni)) {
          alumnos.add(alumno);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${alumno.dni}</td>
            <td>${alumno.nombres}</td>
            <td>${alumno.apellidoPat}</td>
            <td>${alumno.apellidoMat}</td>
            <td>
            <button class="btn btn-primary modificar-btn" data-dni="${alumno.dni}"  id="modificarAlumno">Modificar</button>
            <button class="btn btn-danger eliminar-btn" data-dni="${alumno.dni}" id="eliminarAlumno">Eliminar</button>
            </td>
          `;
          contenedoralumnos.append(tr);
        }
      });

      asignarEventosModificar();

      asignarEventosEliminar();
      // Asumiendo que cargarProductos y actualizarBotonesAgregar son necesarias después de agregar los elementos
      cargarProductos(data);
      actualizarBotonesAgregar();
    })
    .catch((error) => console.error("Error fetching products:", error));
});
// ELIMINAR DE ALUMNOS ######################################################################

// Función para asignar eventos a los botones de eliminar
function asignarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll("#eliminarAlumno");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const dni = this.getAttribute("data-dni");
      eliminarAlumno(dni);
    });
  });
}

// Función para eliminar un alumno por su dni
function eliminarAlumno(dni) {
  // Enviar solicitud DELETE al API
  fetch(`https://bibliotecabackend-1.onrender.com/alumnos/${dni}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        // Eliminar del Set
        const alumnoAEliminar = Array.from(alumnos).find(alumno => alumno.dni === dni);
        if (alumnoAEliminar) {
          alumnos.delete(alumnoAEliminar);
        }

        // Eliminar de la tabla
        const filaAEliminar = Array.from(document.querySelectorAll("#alumnosContenedor tr"))
          .find(row => row.querySelector("td").textContent === dni);
        if (filaAEliminar) {
          filaAEliminar.remove();
        }

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Alumno eliminado exitosamente",
          icon: "success",
        });
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      if (!error.message.includes("Error 400")) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema con la solicitud: " + error.message,
        });
      }
    });
}

// MODIFICAR  DE ALUMNOS ######################################################################

function asignarEventosModificar() {
  const botonesModificar = document.querySelectorAll("#modificarAlumno");
  botonesModificar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const dni = this.getAttribute("data-dni");
      mostrarPanelModificar(dni);
    });
  });
}


// Función para mostrar el panel de modificación
function mostrarPanelModificar(dni) {
  const alumno = Array.from(alumnos).find(a => a.dni === dni);
  console.log(alumno);
  if (!alumno) return;

  alumnoAEditar = alumno;

  // Crear el panel de modificación

  const panelModificar = document.querySelector("#panelModificar");

  panelModificar.className = 'modal fade';
  panelModificar.setAttribute('tabindex', '-1');
  panelModificar.setAttribute('role', 'dialog');
  panelModificar.setAttribute('aria-labelledby', 'modificarAlumnoModalLabel');
  panelModificar.setAttribute('aria-hidden', 'true');

  panelModificar.innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modificarAlumnoModalLabel">Modificar Alumno</h5>

        </div>
        <div class="modal-body">
          <form id="formModificar">
            <div class="form-group">
              <label for="dni">DNI</label>
              <input type="text" class="form-control" id="dni" value="${alumno.dni}" disabled>
            </div>
            <div class="form-group">
              <label for="nombres">Nombres</label>
              <input type="text" class="form-control" id="nombres" value="${alumno.nombres}">
            </div>
            <div class="form-group">
              <label for="apellidoPat">Apellido Paterno</label>
              <input type="text" class="form-control" id="apellidoPat" value="${alumno.apellidoPat}">
            </div>
            <div class="form-group">
              <label for="apellidoMat">Apellido Materno</label>
              <input type="text" class="form-control" id="apellidoMat" value="${alumno.apellidoMat}">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary " data-dismiss="modal"id="cancelarModificar">Cancelar</button>
          <button type="button" class="btn btn-primary" id="enviarModificar">Guardar cambios</button>
        </div>
      </div>
    </div>
  `;


  // Mostrar el modal
  $('#panelModificar').modal('show');

  // Función para cerrar el modal y limpiar
  function cerrarYLimpiarModal() {
    $('#panelModificar').modal('hide');
    $('#panelModificar').on('hidden.bs.modal', function (e) {
    });
  }

  // Asignar eventos al botón de enviar
  document.getElementById("enviarModificar").addEventListener("click", function () {
    const updatedAlumno = {
      dni: alumno.dni,
      nombres: document.getElementById("nombres").value,
      apellidoPat: document.getElementById("apellidoPat").value,
      apellidoMat: document.getElementById("apellidoMat").value
    };
    modificarAlumno(updatedAlumno);
    cerrarYLimpiarModal();
  });

  // Asignar evento al botón de cancelar
  $('#cancelarModificar').on('click', function (e) {

    cerrarYLimpiarModal();
  });

  // Cerrar modal al hacer clic fuera de él
  $('#panelModificar').on('click', function (e) {
    if (e.target !== this) return;
    cerrarYLimpiarModal();
  });

  // Manejar el cierre del modal con la tecla Esc
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      cerrarYLimpiarModal();
    }
  });
}


// Función para modificar un alumno por su dni
function modificarAlumno(alumno) {
  fetch(`https://bibliotecabackend-1.onrender.com/alumnos/${alumno.dni}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alumno)
  })
    .then((response) => {
      if (response.ok) {
        // Actualizar el Set
        alumnos.delete(alumnoAEditar);
        alumnos.add(alumno);

        // Actualizar la tabla
        const filaAModificar = Array.from(document.querySelectorAll("#alumnosContenedor tr"))
          .find(row => row.querySelector("td").textContent === alumno.dni);
        if (filaAModificar) {
          filaAModificar.innerHTML = `
          <td>${alumno.dni}</td>
          <td>${alumno.nombres}</td>
          <td>${alumno.apellidoPat}</td>
          <td>${alumno.apellidoMat}</td>
          <td>
            <button class="btn btn-primary modificar-btn" data-dni="${alumno.dni}">Modificar</button>
            <button class="btn btn-danger eliminar-btn" data-dni="${alumno.dni}">Eliminar</button>
          </td>
        `;
        }

        // Eliminar el panel de modificación
        document.getElementById("panelModificar").remove();

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Alumno modificado exitosamente",
          icon: "success",
        });

        // Asignar eventos a los nuevos botones de eliminar y modificar
        asignarEventosEliminar();
        asignarEventosModificar();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud: " + error.message,
      });
    });
}



// BUSQUEDA DE ALUMNOS ######################################################################

// Obtener referencias a los elementos del DOM
const searchInputAlumnos = document.getElementById('alumnoInput');
const alumnosContenedor = document.getElementById('alumnosContenedor');


// Función para mostrar todos los alumnos
function mostrarAlumnos(alumnosf) {
  console.log(alumnosf);
  alumnosContenedor.innerHTML = '';
  alumnosf.forEach(alumno => {
    const rowAl = `
      <tr>
        <td>${alumno.dni}</td>
        <td>${alumno.nombres}</td>
        <td>${alumno.apellidoPat}</td>
        <td>${alumno.apellidoMat}</td>
                  <td>
            <button class="btn btn-primary modificar-btn" data-dni="${alumno.dni}">Modificar</button>
            <button class="btn btn-danger eliminar-btn" data-dni="${alumno.dni}">Eliminar</button>
          </td>
      </tr>
    `;
    alumnosContenedor.innerHTML += rowAl;
  });
}
asignarEventosEliminar();
asignarEventosModificar();

// Función para filtrar libros
function filtrarAlumnos(busqueda) {
  const alumnosArray = Array.from(alumnos);
  return alumnosArray.filter(alumno =>
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
mostrarAlumnos(Array.from(alumnos));

// TABLA PRESTAMOS ######################################################################



const prestamos = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://bibliotecabackend-1.onrender.com/prestamos/")
    .then((response) => response.json())
    .then((data) => {
      const contenedorprestamos = document.querySelector("#prestamosContenedor");
      console.log(data+"prestamos");
      
      // Limpiar el contenido del contenedor antes de agregar nuevos elementos
      contenedorprestamos.innerHTML = '';

      data.forEach((prestamo) => {
        const key = `${prestamo.alumnoPrestado.nombres}-${prestamo.libroPrestado.titulo}`;
        console.log(key);

        if (!prestamos.has(key)) {
          prestamos.add(key);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${prestamo.alumnoPrestado.nombres}</td>
            <td>${prestamo.libroPrestado.titulo}</td>
            <td>${prestamo.fechaPrestamo}</td>
            <td>${prestamo.fechaDevolucion}</td>
            <td>
            <button class="btn btn-primary modificar-btn" data="${prestamo.nombres}"  id= "PrestamosModificar">Modificar</button>
            <button class="btn btn-danger eliminar-btn" data="${prestamo.nombres}" id= "PrestamosEliminar">Eliminar</button>
            </td>
          `;
          contenedorprestamos.append(tr);
        }
      });
      asignarEventosEliminarPrestamos();
      asignarEventosModificarPrestamos();
      // Asumiendo que cargarProductos y actualizarBotonesAgregar son necesarias después de agregar los elementos
      cargarProductos(data);
      actualizarBotonesAgregar();
    })
    .catch((error) => console.error("Error fetching products:", error));
});



// ELIMINAR PRÉSTAMOS ######################################################################

// Función para asignar eventos a los botones de eliminar
function asignarEventosEliminarPrestamos() {
  const botonesEliminar = document.querySelectorAll("#PrestamosEliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const id = this.getAttribute("data");
      eliminarPrestamo(id);
    });
  });
}

// Función para eliminar un préstamo por su ID
function eliminarPrestamo(id) {
  // Enviar solicitud DELETE al API
  fetch(`https://bibliotecabackend-1.onrender.com/prestamos/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        // Eliminar de la tabla
        const filaAEliminar = Array.from(document.querySelectorAll("#prestamosContenedor tr"))
          .find(row => row.querySelector("button").getAttribute("data") === id);
        if (filaAEliminar) {
          filaAEliminar.remove();
        }

        // Eliminar del Set
        prestamos.delete(Array.from(prestamos).find(p => `${p.alumnoPrestado.nombres}-${p.libroPrestado.titulo}` === id));

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Préstamo eliminado exitosamente",
          icon: "success",
        });
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud: " + error.message,
      });
    });
}

// MODIFICAR PRÉSTAMOS ######################################################################

function asignarEventosModificarPrestamos() {
  const botonesModificar = document.querySelectorAll("#PrestamosModificar");
  botonesModificar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const id = this.getAttribute("data");
      mostrarPanelModificarPrestamo(id);
    });
  });
}

// Función para mostrar el panel de modificación de préstamo
function mostrarPanelModificarPrestamo(id) {
  // Obtener el préstamo del Set
  const prestamo = Array.from(prestamos).find(p => `${p.alumnoPrestado.nombres}-${p.libroPrestado.titulo}` === id);
  if (!prestamo) return;

  const panelModificar = document.querySelector("#panelModificar");

  panelModificar.className = 'modal fade';
  panelModificar.setAttribute('tabindex', '-1');
  panelModificar.setAttribute('role', 'dialog');
  panelModificar.setAttribute('aria-labelledby', 'modificarPrestamoModalLabel');
  panelModificar.setAttribute('aria-hidden', 'true');

  panelModificar.innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modificarPrestamoModalLabel">Modificar Préstamo</h5>
        </div>
        <div class="modal-body">
          <form id="formModificarPrestamo">
            <div class="form-group">
              <label for="alumno">Alumno</label>
              <input type="text" class="form-control" id="alumno" value="${prestamo.alumnoPrestado.nombres}" disabled>
            </div>
            <div class="form-group">
              <label for="libro">Libro</label>
              <input type="text" class="form-control" id="libro" value="${prestamo.libroPrestado.titulo}" disabled>
            </div>
            <div class="form-group">
              <label for="fechaPrestamo">Fecha de Préstamo</label>
              <input type="date" class="form-control" id="fechaPrestamo" value="${prestamo.fechaPrestamo}">
            </div>
            <div class="form-group">
              <label for="fechaDevolucion">Fecha de Devolución</label>
              <input type="date" class="form-control" id="fechaDevolucion" value="${prestamo.fechaDevolucion}">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button"  class="btn btn-secondary" data-dismiss="modal" id="cancelarModificarPrestamo">Cancelar</button>
          <button type="button"  class="btn btn-primary" id="enviarModificarPrestamo">Guardar cambios</button>
        </div>
      </div>
    </div>
  `;

  // Mostrar el modal
  $('#panelModificar').modal('show');

  // Función para cerrar el modal y limpiar
  function cerrarYLimpiarModal() {
    $('#panelModificar').modal('hide');
    $('#panelModificar').on('hidden.bs.modal', function (e) {
      // No es necesario remover el panel, ya que lo estamos reutilizando
    });
  }

  // Asignar eventos al botón de enviar
  document.getElementById("enviarModificarPrestamo").addEventListener("click", function () {
    const updatedPrestamo = {
      ...prestamo,
      fechaPrestamo: document.getElementById("fechaPrestamo").value,
      fechaDevolucion: document.getElementById("fechaDevolucion").value
    };
    modificarPrestamo(updatedPrestamo);
    cerrarYLimpiarModal();
  });

  // Asignar evento al botón de cancelar
  $('#cancelarModificarPrestamo').on('click', function (e) {
    cerrarYLimpiarModal();
  });

  // Cerrar modal al hacer clic fuera de él
  $('#panelModificar').on('click', function (e) {
    if (e.target !== this) return;
    cerrarYLimpiarModal();
  });

  // Manejar el cierre del modal con la tecla Esc
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      cerrarYLimpiarModal();
    }
  });
}

// Función para modificar un préstamo
function modificarPrestamo(prestamo) {
  const id = `${prestamo.alumnoPrestado.nombres}-${prestamo.libroPrestado.titulo}`;
  fetch(`https://bibliotecabackend-1.onrender.com/prestamos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prestamo)
  })
    .then((response) => {
      if (response.ok) {
        // Actualizar en el Set
        prestamos.delete(Array.from(prestamos).find(p => `${p.alumnoPrestado.nombres}-${p.libroPrestado.titulo}` === id));
        prestamos.add(prestamo);

        // Actualizar la tabla
        const filaAModificar = Array.from(document.querySelectorAll("#prestamosContenedor tr"))
          .find(row => row.querySelector("button").getAttribute("data") === id);
        if (filaAModificar) {
          filaAModificar.innerHTML = `
            <td>${prestamo.alumnoPrestado.nombres}</td>
            <td>${prestamo.libroPrestado.titulo}</td>
            <td>${prestamo.fechaPrestamo}</td>
            <td>${prestamo.fechaDevolucion}</td>
            <td>
              <button class="btn btn-primary modificar-btn" data="${id}">Modificar</button>
              <button class="btn btn-danger eliminar-btn" data="${id}">Eliminar</button>
            </td>
          `;
        }

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Préstamo modificado exitosamente",
          icon: "success",
        });

        // Asignar eventos a los nuevos botones de eliminar y modificar
        asignarEventosEliminarPrestamos();
        asignarEventosModificarPrestamos();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud: " + error.message,
      });
    });
}

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
        <td>
              <button class="btn btn-primary modificar-btn" data="${id}">Modificar</button>
              <button class="btn btn-danger eliminar-btn" data="${id}">Eliminar</button>
        </td>
      </tr>
    `;
    prestamosContenedor.innerHTML += rowPr;
  });
}
asignarEventosEliminarPrestamos();
asignarEventosModificarPrestamos();

// Función para filtrar libros
function filtrarPrestamos(busqueda) {
  const PrestamosArray = Array.from(prestamos);

  return PrestamosArray.filter(prestamo =>
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

