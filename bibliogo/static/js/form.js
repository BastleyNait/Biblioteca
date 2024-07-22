
const fetchSource = "https://bibliotecabackend-1.onrender.com";
function initializePrestamosForm() {
    // Inicializar Select2 para el campo de libros
    $('#isbn').select2({
        placeholder: 'Buscar libro por ISBN o título',
        ajax: {
            url: 'https://bibliotecabackend-1.onrender.com/libros',
            dataType: 'json',
            delay: 0,
            processResults: function (data) {
                return {
                    results: data.map(function (libro) {
                        return {
                            id: libro.isbn,
                            text: `${libro.isbn} - ${libro.titulo}`
                        };
                    })
                };
            },
            cache: true
        },
    });
    // Inicializar Select2 para el campo de usuarios
    $('#id').select2({
        placeholder: 'Buscar usuario por DNI o nombre',
        ajax: {
            url: 'https://bibliotecabackend-1.onrender.com/alumnos',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: data.map(function (alumno) {
                        return {
                            id: alumno.dni,
                            text: `${alumno.dni} - ${alumno.nombres} ${alumno.apellidoPat}`
                        };
                    })
                };
            },
            cache: true
        },
    });

    
   
}

// Llama a esta función cuando el DOM esté listo
$(document).ready(function () {
    initializePrestamosForm();
});
// Inicializar el formulario de devolución


document.addEventListener("DOMContentLoaded", function () {
    // FORMULARIO DE PRESTAMO
    document
        .getElementById("prestamoForm")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

            // Capturar los datos del formulario
            const isbn =$('#isbn').val();
            const dni =$('#id').val();
            console.log(isbn);
            console.log(dni);

            // Crear el objeto de datos
            const libroData = {
                isbn: isbn,
                dni: dni,
            };
            console.log(libroData.isbn);
            console.log(libroData.dni);

            // Realizar el fetch con el método POST
            fetch("https://bibliotecabackend-1.onrender.com/prestamos/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(libroData),
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
    // API DNI https://apiperu.dev/api/dni/71002707?api_token=de5ca7555c68b88604aaf9ddc0245c9ea44f7a087f1e79b29b1579d42ec1d6b4
    document
        .getElementById("alumnoForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();

            const identificacion = document.getElementById("identificacion").value;
            const nombres = document.getElementById("nombres").value;
            const apellidoPat = document.getElementById("apellidoPat").value;
            const apellidoMat = document.getElementById("apellidoMat").value;

            const alumnoData = {
                dni: identificacion,
                nombres: nombres,
                apellidoPat: apellidoPat,
                apellidoMat: apellidoMat,
            };

            fetch(`https://apiperu.dev/api/dni/${identificacion}?api_token=de5ca7555c68b88604aaf9ddc0245c9ea44f7a087f1e79b29b1579d42ec1d6b4`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(typeof (data.success))
                    console.log(data.data);
                    if (!data.success) {
                        // La API no encontró ningún registro con ese DNI
                        Swal.fire({
                            icon: "warning",
                            title: "DNI no encontrado",
                            text: data.message,
                        });
                        return;
                    }
                    else if (
                        data.data.nombres === alumnoData.nombres.toUpperCase().trim() &&
                        data.data.apellido_paterno === alumnoData.apellidoPat.toUpperCase().trim() &&
                        data.data.apellido_materno === alumnoData.apellidoMat.toUpperCase().trim()
                    ) {
                        fetch("https://bibliotecabackend-1.onrender.com/alumnos/", {
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
                                            Swal.fire({
                                                icon: "error",
                                                title: "Error 400",
                                                text: "Solicitud incorrecta: " + JSON.stringify(errorData),
                                            });
                                            throw new Error("Error 400: " + JSON.stringify(errorData));
                                        });
                                    } else {
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
                                return response.json();
                            })
                            .then((data) => {
                                Swal.fire({
                                    title: "¡Éxito!",
                                    text: "Alumno agregado exitosamente",
                                    icon: "success",
                                });
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


                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "Datos incorrectos",
                            text: "Los datos ingresados no coinciden con el DNI",
                        });
                    }

                })
                .catch((error) => {
                    console.error("Error: ", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al consultar la API de DNI: " + error.message,
                    });
                });
        });

    // FORM LIBROS
    document
        .getElementById("libroForm")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

            // Capturar los datos del formulario
            const isbn = document.getElementById("isbn").value;
            const titulo = document.getElementById("titulo").value;
            const autor = document.getElementById("autor").value;
            const categoria = document.getElementById("categoria").value;
            const cantidad = document.getElementById("cantidad").value;


            // Crear el objeto de datos
            const libroData = {
                isbn: isbn,
                titulo: titulo,
                autor: autor,
                categoria: categoria,
                cantidad: cantidad
            };
            console.log(libroData.isbn);

            // Realizar el fetch con el método POST
            fetch("https://bibliotecabackend-1.onrender.com/libros/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(libroData),
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

});

