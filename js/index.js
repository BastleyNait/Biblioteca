//  TABLA LIBROS

const libros = [];
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8000/libros/")
    .then((response) => response.json())
    .then((data) => {
      const contenedorLibros = document.querySelector("#librosContenedor");
      data.forEach((libro) => {
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

//  TABLA ALUMNOS
const alumnos = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8000/alumnos/")
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

/* const alumnos = [];
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8000/alumnos/")
    .then((response) => response.json())
    .then((data) => {
      const contenedoralumnos = document.querySelector("#alumnosContenedor");
      data.forEach((alumno) => {
        alumnos.push(alumno);
        const tr = document.createElement("tr");
        tr.innerHTML = `
                        <tr>
                          <td>${alumno.dni}</td>
                          <td>${alumno.nombres}</td>
                          <td>${alumno.apellidoPat}</td>
                          <td>${alumno.apellidoMat}</td>
                        </tr>
                    `;
        contenedoralumnos.append(tr);
      });
      cargarProductos(data);
      actualizarBotonesAgregar();
      cargarProductos(data);
    })
    .catch((error) => console.error("Error fetching products:", error));
});
 */
const prestamos = new Set();
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8000/prestamos/")
    .then((response) => response.json())
    .then((data) => {
      const contenedorprestamos = document.querySelector("#prestamosContenedor");

      // Limpiar el contenido del contenedor antes de agregar nuevos elementos
      contenedorprestamos.innerHTML = '';

      data.forEach((prestamo) => {
        const key = `${prestamo.usuarioPrestado.nombres}-${prestamo.libroPrestado.titulo}`;

        if (!prestamos.has(key)) {
          prestamos.add(key);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${prestamo.usuarioPrestado.nombres}</td>
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

// FORMULARIO DE PRESTAMO
document
  .getElementById("prestamoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Capturar los datos del formulario
    const isbn = document.getElementById("isbn").value;
    const dni = document.getElementById("dni").value;

    // Crear el objeto de datos
    const prestamoData = {
      isbn: isbn,
      dni: dni,
    };
    console.log(prestamoData.isbn);
    console.log(prestamoData.dni);

    // Realizar el fetch con el método POST
    fetch("http://127.0.0.1:8000/prestamos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prestamoData),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((errorData) => {
              // Mostrar un mensaje específico para el error 400
              Swal.fire({
                icon: "error",
                title: "Error 400",
                text: "Solicitud incorrecta: " + JSON.stringify(errorData),
              });
              throw new Error("Error 400: " + JSON.stringify(errorData));
            });
          } else {
            // Manejar otros errores
            return response.json().then((errorData) => {
              Swal.fire({
                icon: "error",
                title: "Error " + response.status,
                text: "Hubo un problema: " + JSON.stringify(errorData),
              });
              throw new Error(
                "Error " + response.status + ": " + JSON.stringify(errorData)
              );
            });
          }
        }
        return response.json(); // Parsear la respuesta si es exitosa
      })
      .then((data) => {
        Swal.fire({
          title: "¡Éxito!",
          text: "Libro prestado exitosamente",
          icon: "success",
        });
        // Aquí puedes manejar la respuesta exitosa del servidor
      })
      .catch((error) => {
        // Aquí puedes manejar los errores de la red y otros errores
        if (!error.message.includes("Error 400")) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema con la solicitud: " + error.message,
          });
        }
      });
  });

// FORM ALUMNOS
document
  .getElementById("alumnoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Capturar los datos del formulario
    const identificacion = document.getElementById("identificacion").value;
    const nombres = document.getElementById("nombres").value;
    const apellidoPat = document.getElementById("apellidoPat").value;
    const apellidoMat = document.getElementById("apellidoMat").value;

    // Crear el objeto de datos
    const alumnoData = {
      dni: identificacion,
      nombres: nombres,
      apellidoPat: apellidoPat,
      apellidoMat: apellidoMat,
    };
    console.log(alumnoData.identificacion);
    console.log(alumnoData.nombres);
    console.log(alumnoData.apellidoPat);
    console.log(alumnoData.apellidoMat);

    // Realizar el fetch con el método POST
    fetch("http://127.0.0.1:8000/alumnos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alumnoData),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((errorData) => {
              // Mostrar un mensaje específico para el error 400
              Swal.fire({
                icon: "error",
                title: "Error 400",
                text: "Solicitud incorrecta: " + JSON.stringify(errorData),
              });
              throw new Error("Error 400: " + JSON.stringify(errorData));
            });
          } else {
            // Manejar otros errores
            return response.json().then((errorData) => {
              Swal.fire({
                icon: "error",
                title: "Error " + response.status,
                text: "Hubo un problema: " + JSON.stringify(errorData),
              });
              throw new Error(
                "Error " + response.status + ": " + JSON.stringify(errorData)
              );
            });
          }
        }
        return response.json(); // Parsear la respuesta si es exitosa
      })
      .then((data) => {
        Swal.fire({
          title: "¡Éxito!",
          text: "Alumno agregado exitosamente",
          icon: "success",
        });
        // Aquí puedes manejar la respuesta exitosa del servidor
      })
      .catch((error) => {
        // Aquí puedes manejar los errores de la red y otros errores
        if (!error.message.includes("Error 400")) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema con la solicitud: " + error.message,
          });
        }
      });
  });
/* 

    const contenedorProductos = document.querySelector("#contenedor-productos");
    const botonesCategorias = document.querySelectorAll(".boton-categoria");
    const tituloPrincipal = document.querySelector("#titulo-principal");
    let botonesAgregar = document.querySelectorAll(".producto-agregar");
    const numerito = document.querySelector("#numerito");

    function cargarProductos(productosElegidos) {

        contenedorProductos.innerHTML = "";

        productosElegidos.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                 <img class="producto-imagen" src="${producto.image_url}" alt="${producto.name}">
                 <div class="producto-detalles">
                     <h3 class="producto-titulo">${producto.name}</h3>
                     <p class="producto-precio">S/ ${producto.price}</p>
                     <button class="producto-agregar" id="${producto.name}">Agregar</button>
                 </div>
             `;
            contenedorProductos.append(div);
        })
        actualizarBotonesAgregar();
    }



    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            console.log(productos)
            botonesCategorias.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");
            if (e.currentTarget.id != "todos") {
                const productoCategoria = productos.find(producto => producto.category === e.currentTarget.id);
                tituloPrincipal.innerText = productoCategoria.category;
                const productosBoton = productos.filter(producto => producto.category === e.currentTarget.id);
                cargarProductos(productosBoton);
            } else {
                tituloPrincipal.innerText = "Todos los productos";
                cargarProductos(productos);
            }
        })
    });

    function actualizarBotonesAgregar() {
        botonesAgregar = document.querySelectorAll(".producto-agregar");
        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    let productosEnCarrito;

    let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
        actualizarNumerito();
    } else {
        productosEnCarrito = [];
    }

    function agregarAlCarrito(e) {
        const idBoton = e.currentTarget.id;
        const productoAgregado = productos.find(producto => producto.name === idBoton);

        if (productosEnCarrito.some(producto => producto.name === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.name === idBoton);
            productosEnCarrito[index].stock++;
        } else {
            productoAgregado.stock = 1;
            productosEnCarrito.push(productoAgregado);
        }

        actualizarNumerito();

        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }

    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.stock, 0);
        numerito.innerText = nuevoNumerito;
    }
});
 */
