from django.apps import AppConfig
import ee

class ImageryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'imagery'

    def ready(self):
        try:
            ee.Initialize()
        except Exception as e:
            print("GEE initialization error:", e)