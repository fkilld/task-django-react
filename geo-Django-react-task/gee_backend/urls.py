
from django.contrib import admin

from django.urls import path


from myapp.views import get_sentinel_tiles


urlpatterns = [

    path('admin/', admin.site.urls),

    path('get_sentinel_tiles/', get_sentinel_tiles, name='get_sentinel_tiles'),
]
