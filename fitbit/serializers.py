from rest_framework import serializers
from .models import Fitbit

class FitbitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fitbit
        fields = ['id', 'name', 'refresh_token']