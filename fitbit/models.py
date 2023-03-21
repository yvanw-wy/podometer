from django.db import models

class Fitbit(models.Model):
    name = models.CharField(max_length=256, default="none")
    refresh_token = models.CharField(max_length=256, default="none")

    def __str__(self):
        return self.name + '' + self.refresh_token