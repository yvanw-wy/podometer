"""podometer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls.conf import include
from django.contrib import admin
from django.urls import path
from core.views import index, getDatasGoogle, registerUserGoogle, login, signup
from googlefit.urls import router as doctor_router
from rest_framework import routers


router = routers.DefaultRouter()
router.registry.extend(doctor_router.registry)

urlpatterns = [
    path('', index, name='index'),
    path('googlefit/registeruser', registerUserGoogle, name='registeruser'),
    path('googlefit/getdatas', getDatasGoogle, name='datasgoogle'),
    path('account/logindoctor', login, name='login'),
    path('account/registerdoctor', signup, name='register'),
    path('doctors/', include(router.urls)),
    path('admin/', admin.site.urls),
]
