from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicRoomViewSet

router = DefaultRouter()
router.register('rooms', PublicRoomViewSet, basename='public-room')

urlpatterns = [
    path('', include(router.urls)),
]
