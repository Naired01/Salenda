from django.db import models
from django.conf import settings
from apps.rooms.models import Room


class Reservation(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reservations', verbose_name='Sala')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations', verbose_name='Usuario')
    title = models.CharField(max_length=200, verbose_name='Título de la junta')
    description = models.TextField(blank=True, verbose_name='Descripción')
    start_time = models.DateTimeField(verbose_name='Hora de inicio')
    end_time = models.DateTimeField(verbose_name='Hora de fin')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['room', 'start_time', 'end_time']),
            models.Index(fields=['user', 'start_time']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.room.name} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"
    
    @property
    def duration_minutes(self):
        return int((self.end_time - self.start_time).total_seconds() / 60)
