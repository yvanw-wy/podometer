from rest_framework import routers
from googlefit.views import DoctorViewSet

router = routers.DefaultRouter()
router.register('doctors', DoctorViewSet)