from django.contrib import admin
from django.urls import path
from myapp.views import get_images

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_images/', get_images, name='get_images'),
]