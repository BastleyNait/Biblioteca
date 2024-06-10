from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import AlumnoViewSet, LibroViewSet, NotificacionViewSet, ReporteViewSet, UsuarioViewSet, ReservaViewSet, PrestamoViewSet

router = DefaultRouter()
router.register(r'alumnos', AlumnoViewSet)
router.register(r'libros', LibroViewSet)
router.register(r'notificaciones', NotificacionViewSet)
router.register(r'reportes', ReporteViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'prestamos', PrestamoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]