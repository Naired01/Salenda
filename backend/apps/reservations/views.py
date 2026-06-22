from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Reservation
from .serializers import ReservationSerializer, AvailabilityCheckSerializer
from apps.rooms.models import Room


class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        serializer = AvailabilityCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        room_id = serializer.validated_data['room']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        
        overlapping = Reservation.objects.filter(
            room_id=room_id,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        
        if overlapping.exists():
            conflicting = ReservationSerializer(overlapping, many=True).data
            return Response({
                'available': False,
                'conflicts': conflicting
            })
        
        return Response({'available': True, 'conflicts': []})
    
    @action(detail=False, methods=['get'])
    def my_reservations(self, request):
        reservations = Reservation.objects.filter(user=request.user).order_by('-start_time')
        page = self.paginate_queryset(reservations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        now = timezone.now()
        start_of_day = timezone.make_aware(timezone.datetime.combine(now.date(), timezone.datetime.min.time()))
        end_of_day = timezone.make_aware(timezone.datetime.combine(now.date(), timezone.datetime.max.time()))
        
        reservations = Reservation.objects.filter(
            start_time__gte=start_of_day,
            end_time__lte=end_of_day
        ).order_by('start_time')
        
        page = self.paginate_queryset(reservations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)
