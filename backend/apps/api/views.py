from rest_framework import viewsets, permissions, status as http_status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.rooms.models import Room
from apps.rooms.serializers import RoomSerializer, RoomStatusSerializer
from apps.reservations.models import Reservation
from apps.reservations.serializers import ReservationSerializer


class PublicRoomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Room.objects.filter(is_active=True)
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'], url_path='uuid/(?P<room_uuid>[0-9a-f-]+)/status')
    def status_by_uuid(self, request, room_uuid=None):
        try:
            room = Room.objects.get(uuid=room_uuid, is_active=True)
        except Room.DoesNotExist:
            return Response(
                {'detail': 'Sala no encontrada.'},
                status=http_status.HTTP_404_NOT_FOUND
            )
        serializer = RoomStatusSerializer(room)
        return Response(serializer.data)
    
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
    
    @action(detail=False, methods=['get'])
    def all_status(self, request):
        rooms = self.get_queryset()
        serializer = RoomStatusSerializer(rooms, many=True)
        return Response(serializer.data)
