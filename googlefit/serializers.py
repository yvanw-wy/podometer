
from rest_framework import serializers
from googlefit.models import Doctors

class DoctorSerializer (serializers.ModelSerializer):

    class Meta:
        model = Doctors
        fields = '__all__'