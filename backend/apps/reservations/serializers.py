from rest_framework import serializers
from django.utils import timezone
from .models import Reservation
from apps.rooms.models import Room


class ReservationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Reservation
        fields = ['id', 'room', 'room_name', 'user', 'user_email', 'user_name', 
                  'title', 'description', 'start_time', 'end_time', 
                  'duration_minutes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate(self, data):
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        room = data.get('room')
        
        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError(
                    "La hora de inicio debe ser anterior a la hora de fin."
                )
            
            if start_time < timezone.now():
                raise serializers.ValidationError(
                    "No se puede reservar en el pasado."
                )
            
            if room:
                overlapping = Reservation.objects.filter(
                    room=room,
                    start_time__lt=end_time,
                    end_time__gt=start_time
                )
                
                if self.instance:
                    overlapping = overlapping.exclude(pk=self.instance.pk)
                
                if overlapping.exists():
                    conflicting = overlapping.first()
                    raise serializers.ValidationError(
                        f"La sala ya está reservada en ese horario. "
                        f"Conflicto con: '{conflicting.title}' "
                        f"({conflicting.start_time.strftime('%H:%M')} - {conflicting.end_time.strftime('%H:%M')})"
                    )
        
        return data


class AvailabilityCheckSerializer(serializers.Serializer):
    room = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    
    def validate_room(self, value):
        try:
            Room.objects.get(id=value)
        except Room.DoesNotExist:
            raise serializers.ValidationError("La sala no existe.")
        return value
    
    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError(
                "La hora de inicio debe ser anterior a la hora de fin."
            )
        return data
