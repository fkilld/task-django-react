# Importing necessary modules from Django

# `admin` module is used to enable Django's built-in admin panel.
# It allows administrators to manage the application’s database models via a web interface.
from django.contrib import admin

# `path` is a function used to define URL patterns.
# It maps URLs to their corresponding view functions.
from django.urls import path

# Importing the `get_sentinel_tiles` function from the `myapp.views` module.
# This view function handles requests for Sentinel-2 satellite image tiles.
from myapp.views import get_sentinel_tiles

# Defining URL patterns for the application.
urlpatterns = [
    # The first URL pattern routes requests to the Django admin interface.
    # When users visit `/admin/` in the browser, they are taken to Django's
    # built-in administration panel, where they can manage database records.
    path('admin/', admin.site.urls),

    # The second URL pattern maps requests to `/get_sentinel_tiles/` 
    # to the `get_sentinel_tiles` view function.
    # This endpoint is used to fetch Sentinel-2 satellite imagery from Google Earth Engine (GEE).
    # The `name='get_sentinel_tiles'` provides a reference name for this route,
    # which can be used in Django's reverse URL resolution.
    path('get_sentinel_tiles/', get_sentinel_tiles, name='get_sentinel_tiles'),
]
