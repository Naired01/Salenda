from django.contrib import admin
from .models import Reservation

# Register your models here.

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['title', 'room', 'user', 'start_time', 'end_time', 'created_at']
    list_filter = ['room', 'start_time', 'created_at']
    search_fields = ['title', 'description', 'user__email', 'room__name']
    date_hierarchy = 'start_time'