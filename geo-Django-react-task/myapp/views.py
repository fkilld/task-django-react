# -------------------------------------------------------------
# IMPORTS
# -------------------------------------------------------------

# JsonResponse is a Django utility for returning JSON data.
# By default, it sets the response's content type to application/json.
from django.http import JsonResponse

# The `api_view` decorator from Django REST Framework (DRF) makes it simpler
# to specify which HTTP methods (GET, POST, etc.) a view should accept.
from rest_framework.decorators import api_view

# Importing Earth Engine (ee) library to interact with Google Earth Engine.
# This library provides functions to fetch, process, and analyze geospatial data.
import ee

# The `datetime` module helps handle and manipulate date and time objects,
# which is crucial for working with date ranges (start date and end date).
import datetime


# -------------------------------------------------------------
# GOOGLE EARTH ENGINE INITIALIZATION
# -------------------------------------------------------------

# 1. Initialize Google Earth Engine (GEE)

# The service account email you created in the Google Cloud Console for Earth Engine access.
SERVICE_ACCOUNT = "geo-task@geoproject-452111.iam.gserviceaccount.com"

# The JSON key file is a private key that allows the code to authenticate
# as the service account. Ensure its path is correct relative to this file.
JSON_KEY_FILE = "geoproject-452111-9ebb3eedcd68.json"

try:
    # Create Earth Engine credentials using the service account email and private key file.
    credentials = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, JSON_KEY_FILE)
    
    # Initialize the Earth Engine library with these credentials.
    # The `project` parameter should match your Google Cloud project ID.
    ee.Initialize(credentials, project='geoproject-452111')

    # If initialization succeeds, print a confirmation message in the console.
    print("✅ GEE initialized successfully.")

except Exception as e:
    # If there's an error (e.g., missing file, invalid credentials), this block prints the error.
    print("❌ Error initializing GEE:", e)


# -------------------------------------------------------------
# VIEW FUNCTION
# -------------------------------------------------------------

@api_view(['GET'])
def get_sentinel_tiles(request):
    """
    Fetches Sentinel-2 imagery as TMS tile URLs for the given date range
    and bounding box. Also extracts latitude and longitude for each image.
    """

    try:
        # ---------------------------------------------------------
        # 2. PARSE REQUEST PARAMETERS
        # ---------------------------------------------------------

        # Retrieve the start_date from the query parameters (e.g., ?start_date=2023-01-01).
        # If none is provided, default to '2023-01-01'.
        start_date = request.GET.get('start_date', '2023-01-01')

        # Retrieve the end_date from the query parameters (e.g., ?end_date=2023-12-31).
        # If none is provided, default to '2023-12-31'.
        end_date = request.GET.get('end_date', '2023-12-31')

        # Retrieve the bounding box from the query parameters (e.g., ?bbox=minLng,minLat,maxLng,maxLat).
        # This is required to define the area of interest.
        bbox = request.GET.get('bbox')  # Expected format: "minLng,minLat,maxLng,maxLat"

        # If bbox is missing, return a JSON error response (HTTP 400: Bad Request).
        if not bbox:
            return JsonResponse({"error": "Parameter 'bbox' is required"}, status=400)

        # Convert the bbox string into a list of floats and create an Earth Engine geometry.
        # The expected format is minLng,minLat,maxLng,maxLat. If the format is invalid,
        # a ValueError is raised, resulting in an error message.
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(','))
            region = ee.Geometry.Rectangle([min_lng, min_lat, max_lng, max_lat])
        except ValueError:
            return JsonResponse(
                {"error": "Invalid 'bbox' format. Expected 'minLng,minLat,maxLng,maxLat'"},
                status=400
            )

        # Convert the string dates into Python datetime objects.
        # strptime() with the format '%Y-%m-%d' ensures YYYY-MM-DD format parsing.
        start_dt = datetime.datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d')

        # Basic validation: start_date should not be later than end_date.
        if start_dt > end_dt:
            return JsonResponse({"error": "start_date cannot be after end_date"}, status=400)

        # ---------------------------------------------------------
        # 3. GENERATE MONTHLY DATE RANGES
        # ---------------------------------------------------------

        # We'll create a list of (month_start, month_end) tuples. Each tuple
        # represents a single month (e.g., 2023-01-01 to 2023-01-31).
        monthly_ranges = []

        # Start with the user-provided start date.
        current_dt = start_dt

        # Loop until current_dt goes beyond the end_dt.
        while current_dt <= end_dt:
            # month_start sets the day to 1, ensuring it’s the first day of that month.
            month_start = current_dt.replace(day=1)

            # Calculate the next month by taking the current month modulo 12 and adding 1.
            next_month = (month_start.month % 12) + 1

            # Calculate the year for the next month. If the current month is December,
            # we move to January of the next year.
            year_increment = month_start.year + (month_start.month // 12)

            # month_end is the last day of the current month. We do this by constructing
            # the date of the next month on day 1, then subtracting one day.
            month_end = (datetime.datetime(year_increment, next_month, 1) -
                         datetime.timedelta(days=1))

            # If the calculated month_end exceeds the user-specified end date,
            # we clip it to the end_dt to avoid going beyond the user range.
            if month_end > end_dt:
                month_end = end_dt

            # Append the tuple to our monthly_ranges list.
            monthly_ranges.append((month_start, month_end))

            # Move to the next month by adding one day to the month_end.
            current_dt = month_end + datetime.timedelta(days=1)

        # Prepare a list to store results for each monthly composite.
        tile_layers = []

        # ---------------------------------------------------------
        # 4. FETCH SENTINEL-2 DATA FOR EACH MONTH
        # ---------------------------------------------------------

        # Iterate over each monthly time window in monthly_ranges.
        for (m_start, m_end) in monthly_ranges:
            # Print debug info to track monthly fetch progress in logs/terminal.
            print(f"🔍 Fetching data for: {m_start.strftime('%Y-%m-%d')} to {m_end.strftime('%Y-%m-%d')}")

            # Build a Sentinel-2 image collection filtered by date range, region, and cloud coverage.
            s2_collection = (
                ee.ImageCollection('COPERNICUS/S2')
                .filterDate(m_start.strftime('%Y-%m-%d'), m_end.strftime('%Y-%m-%d'))
                .filterBounds(region)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            )

            # Check how many images are found in this date window.
            image_count = s2_collection.size().getInfo()
            print(f"📸 Found {image_count} images")

            # If no images are found, skip processing for this month.
            if image_count == 0:
                continue

            # -----------------------------------------------------
            # A) RETRIEVE & PRINT METADATA FOR EACH IMAGE
            # -----------------------------------------------------

            # Convert the image collection to a list so we can iterate over it.
            image_list = s2_collection.toList(image_count)
            images_metadata = []

            # Loop through each image in the collection to gather metadata.
            for i in range(image_count):
                img = ee.Image(image_list.get(i))    # Retrieve the i-th image
                img_id = img.id().getInfo()          # Unique Earth Engine ID
                date = img.date().format("YYYY-MM-dd").getInfo()  # Acquisition date

                # Get the geometry of the image, then compute its centroid.
                # Coordinates() returns a list [lon, lat].
                centroid = img.geometry().centroid().coordinates().getInfo()
                lat, lon = centroid[1], centroid[0]

                # Print debug info about this image’s metadata.
                print(f"🖼️ Image {i + 1}: ID = {img_id}, Date = {date}, Lat: {lat}, Lon: {lon}")

                # Store metadata in a dictionary, then append to our images_metadata list.
                images_metadata.append({
                    "id": img_id,
                    "date": date,
                    "latitude": lat,
                    "longitude": lon
                })

            # -----------------------------------------------------
            # B) CREATE A MEDIAN COMPOSITE
            # -----------------------------------------------------
            # For the images in this monthly range, we generate a median composite
            # to reduce cloud cover and get a representative image for the month.
            composite = s2_collection.median().clip(region)

            # Define visualization parameters for the composite: 
            # - We use bands B4, B3, B2 for natural color
            # - The pixel values range from 0 to 5000 for a bright, distinct image.
            vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 5000}

            # Attempt to generate a TMS (Tile Map Service) URL from the composite.
            # This URL can be used by frontends such as Leaflet or OpenLayers to
            # dynamically fetch image tiles for display on a web map.
            try:
                map_id_dict = composite.getMapId(vis_params)
                tms_url = map_id_dict['tile_fetcher'].url_format
            except Exception as e:
                # If there's an issue generating the TMS URL, print the warning and skip.
                print("⚠️ Error generating TMS URL:", e)
                continue

            # Append this month’s composite details (label, TMS URL, date range, and metadata) to our list.
            tile_layers.append({
                "label": f"{m_start.strftime('%Y-%m')} (Sentinel-2)",
                "tms_url": tms_url,
                "start": m_start.strftime('%Y-%m-%d'),
                "end": m_end.strftime('%Y-%m-%d'),
                "images": images_metadata  # List of metadata for each image within this composite
            })

        # If tile_layers is empty, it means no valid satellite images were found
        # in any of the monthly date ranges. Return a 400 status to indicate this.
        if not tile_layers:
            return JsonResponse(
                {"error": "No valid satellite images found for the given date range"},
                status=400
            )

        # ---------------------------------------------------------
        # 5. RETURN JSON RESPONSE
        # ---------------------------------------------------------

        # Send back a JSON response containing:
        # - The list of monthly tile layers (each with TMS URL and image metadata).
        # - The requested start_date and end_date for reference.
        return JsonResponse({
            "layers": tile_layers,
            "start_date": start_date,
            "end_date": end_date
        })

    except Exception as e:
        # Catch any unforeseen errors and return an error response with status 500.
        print("❌ Error processing request:", e)
        return JsonResponse({"error": str(e)}, status=500)
