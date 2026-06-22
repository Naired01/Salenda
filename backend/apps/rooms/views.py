from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Room
from .serializers import RoomSerializer, RoomStatusSerializer
from apps.reservations.models import Reservation
from apps.reservations.serializers import ReservationSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_admin


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.filter(is_active=True)
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        room = self.get_object()
        serializer = RoomStatusSerializer(room)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedule(self, request, pk=None):
        room = self.get_object()
        date_str = request.query_params.get('date')
        
        if date_str:
            from datetime import datetime
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            date = timezone.now().date()
        
        start_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
        end_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.max.time()))
        
        reservations = Reservation.objects.filter(
            room=room,
            start_time__gte=start_of_day,
            end_time__lte=end_of_day
        ).order_by('start_time')
        
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
