import uuid
from django.db import models


class Room(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='UUID')
    name = models.CharField(max_length=100, verbose_name='Nombre')
    capacity = models.PositiveIntegerField(verbose_name='Capacidad')
    location = models.CharField(max_length=200, blank=True, verbose_name='Ubicación')
    amenities = models.JSONField(default=list, blank=True, verbose_name='Servicios')
    description = models.TextField(blank=True, verbose_name='Descripción')
    is_active = models.BooleanField(default=True, verbose_name='Activa')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Sala'
        verbose_name_plural = 'Salas'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} (Capacidad: {self.capacity})"
