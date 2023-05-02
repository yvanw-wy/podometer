from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
# from django.conf import settings
# from celery.schedules import crontab
# from django_celery_beat.models import PeriodicTask

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'podometer.settings')

app = Celery('podometer')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Celery beat settings
# app.conf.beat_schedule = {
#     'alert-activity-each-month': {
#         'task': 'googlefit.tasks.',
#         'schedule': crontab(),
#         'args': ()
#     }
# }

app.autodiscover_tasks()