from django.db import models

# Create your models here.

class Doctors (models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    kbis = models.CharField(max_length=255)
    refreshToken = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now=True)

    def __str__ (self) -> str:
        return self.name

