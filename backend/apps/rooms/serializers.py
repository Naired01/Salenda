from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'uuid', 'name', 'capacity', 'location', 'amenities', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at']


class RoomStatusSerializer(serializers.ModelSerializer):
    current_reservation = serializers.SerializerMethodField()
    is_occupied = serializers.SerializerMethodField()
    next_reservation = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ['id', 'uuid', 'name', 'capacity', 'location', 'is_occupied', 'current_reservation', 'next_reservation']
    
    def get_is_occupied(self, obj):
        from apps.reservations.models import Reservation
        from django.utils import timezone
        now = timezone.now()
        return Reservation.objects.filter(
            room=obj,
            start_time__lte=now,
            end_time__gt=now
        ).exists()
    
    def get_current_reservation(self, obj):
        from apps.reservations.models import Reservation
        from apps.reservations.serializers import ReservationSerializer
        from django.utils import timezone
        now = timezone.now()
        reservation = Reservation.objects.filter(
            room=obj,
            start_time__lte=now,
            end_time__gt=now
        ).first()
        if reservation:
            return ReservationSerializer(reservation).data
        return None
    
    def get_next_reservation(self, obj):
        from apps.reservations.models import Reservation
        from apps.reservations.serializers import ReservationSerializer
        from django.utils import timezone
        now = timezone.now()
        reservation = Reservation.objects.filter(
            room=obj,
            start_time__gt=now
        ).order_by('start_time').first()
        if reservation:
            return ReservationSerializer(reservation).data
        return None
