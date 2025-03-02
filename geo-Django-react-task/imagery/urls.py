from django.urls import path
from . import views

urlpatterns = [
    path('sentinel-tiles/', views.fetch_imagery, name='sentinel-tiles'),
]