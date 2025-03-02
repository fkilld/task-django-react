from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import ee

from google.oauth2 import service_account

# Directly specify the path to the service account JSON file
SERVICE_ACCOUNT_FILE = "/path/to/geo_project/keys/service-account.json"

# Authenticate with Google Earth Engine using the service account
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)
ee.Initialize(credentials=credentials)

@api_view(['GET'])
def fetch_imagery(request):
    # Extract parameters
    start_date = request.query_params.get('start')
    end_date = request.query_params.get('end')
    bbox = request.query_params.get('bbox')

    # Validate dates
    if not start_date or not end_date:
        return Response({'error': 'Start and end dates are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Parse bounding box
    roi = None
    if bbox:
        try:
            coords = list(map(float, bbox.split(',')))
            if len(coords) != 4:
                raise ValueError
            roi = ee.Geometry.Rectangle(coords)
        except ValueError:
            return Response({'error': 'Invalid bbox format. Use min_lon,min_lat,max_lon,max_lat'}, status=400)

    try:
        # Fetch and filter Sentinel-2 imagery
        collection = (ee.ImageCollection('COPERNICUS/S2_SR')
                      .filterDate(start_date, end_date)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)))
        
        if roi:
            collection = collection.filterBounds(roi)

        if collection.size().getInfo() == 0:
            return Response({'error': 'No images found'}, status=status.HTTP_404_NOT_FOUND)

        # Process image
        image = collection.median().clip(roi) if roi else collection.median()
        rgb = image.select(['B4', 'B3', 'B2']).divide(10000)  # Scale to reflectance

        # Generate tile URL
        vis_params = {'min': 0, 'max': 0.3, 'gamma': 1.4}
        map_id = rgb.getMapId(vis_params)
        tile_url = map_id['tile_fetcher'].url_format

        return Response({'tile_url': tile_url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    