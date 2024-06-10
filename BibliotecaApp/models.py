from django.db import models

class Usuario(models.Model):
    dni = models.CharField(max_length=8)
    nombres = models.CharField(max_length=75)
    apellidoPat = models.CharField(max_length=50)
    apellidoMat = models.CharField(max_length=50)
    nombreUsuario = models.CharField(max_length=20)
    correo = models.EmailField()
    contraseña = models.CharField(max_length=8)
    tipoUsuario = models.CharField(max_length=1) #Tipo p= profesor B=bibliotecario
    fechaCreada = models.DateTimeField(auto_now_add=True)     
    
    
    
class Alumno(models.Model):
    dni = models.CharField(max_length=8)
    nombres = models.CharField(max_length=75)
    apellidoPat = models.CharField(max_length=50)
    apellidoMat = models.CharField(max_length=50)

class Libro(models.Model):
    isbn = models.CharField(max_length=13)
    titulo = models.CharField()
    autor = models.CharField(max_length=50)
    categoria = models.CharField(max_length=50)
    cantidad = models.IntegerField(default=0)
    disponibilidad = models.BooleanField(default=True)
    
class Reserva(models.Model):
    fechaReserva = models.DateField()
    usuarioReserva = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libroReserva = models.ForeignKey(Libro, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20)
    
class Prestamo(models.Model):
    usuarioPrestado = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libroPrestado = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fechaPrestamo = models.DateField()
    fechaDevolucion = models.DateField()
    estado = models.CharField(max_length=20)

class Notificacion(models.Model):
    mensaje = models.TextField()
    fechaCreada = models.DateTimeField(auto_now_add=True)
    
class Reporte(models.Model):
    tipoReporte = models.CharField(max_length=20)
    contenido = models.TextField()
    fechaCreada = models.DateTimeField(auto_now_add=True)
 
    
    
    

    

