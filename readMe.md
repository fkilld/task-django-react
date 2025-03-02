# Sentinel-2 Imagery Viewer

This is a full-stack project built with React and Django that lets users view Sentinel-2 satellite images on a map. The backend uses Google Earth Engine (GEE) to fetch and process the satellite data, and the frontend displays the images on an interactive Leaflet map with easy-to-use controls.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend (Django) Setup](#backend-django-setup)
  - [Frontend (React) Setup](#frontend-react-setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Additional Notes](#additional-notes)
- [Contact](#contact)

---

## Overview

This project allows users to select a date range and see monthly composite images of Sentinel-2 satellite data over a specific area. The backend (Django) fetches and processes satellite imagery from GEE using a service account and sends Tile Map Service (TMS) URLs to the frontend. The React frontend uses these URLs to show the imagery on a Leaflet map, complete with controls to toggle different layers.

---

## Features

- **Date Range Selection:** Choose start and end dates for imagery.
- **Interactive Map:** View satellite data on an interactive map using Leaflet.
- **Layer Control:** Easily switch between different monthly image composites.
- **Backend Integration:** Uses Django and Google Earth Engine to fetch and process satellite imagery.
- **React Frontend:** Clean, responsive interface built with React and react-leaflet.

---

## Tech Stack

- **Frontend:** React, React-Leaflet, Leaflet.js, CSS
- **Backend:** Django, Django REST Framework, Google Earth Engine API
- **Other:** Google Earth Engine, REST API, CORS configuration

---

## Project Structure

```
project/
├── backend/
│   ├── manage.py
│   ├── gee_backend/
│   │   ├── settings.py         # Django settings with CORS and GEE initialization
│   │   ├── urls.py             # URL routing for the backend API
│   │   ├── wsgi.py
│   │   └── ...
│   └── myapp/
│       ├── views.py            # Contains get_sentinel_tiles for fetching satellite data
│       ├── urls.py
│       └── ...
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js            # Entry point for React app
│       ├── components/
│       │   ├── SentinelViewer.js   # Main component to view imagery
│       │   └── MapInitializer.js   # Helps initialize the Leaflet map
│       └── styles/
│           └── styles.js       # Custom styles for the app
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Python 3.8+**
- **Node.js & npm (or yarn)**
- **Django 5.1+**
- **Google Earth Engine Account & Service Account Credentials** (JSON key file)

### Backend (Django) Setup

1. **Navigate to the Backend Folder:**

   ```bash
   cd backend
   ```
2. **Create a Virtual Environment and Activate It:**

   ```bash
   python -m venv env
   source env/bin/activate   # On Windows: env\Scripts\activate
   ```
3. **Install Dependencies:**

   ```bash
   pip install django djangorestframework django-cors-headers earthengine-api
   ```
4. **Place Your GEE JSON Key File:**

   Copy your `geoproject-452111-9ebb3eedcd68.json` file into the backend directory. This file contains the credentials to access Google Earth Engine.
5. **Run Migrations:**

   ```bash
   python manage.py migrate
   ```
6. **Start the Django Server:**

   ```bash
   python manage.py runserver
   ```

   The backend API will run on [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

### Frontend (React) Setup

1. **Navigate to the Frontend Folder:**

   ```bash
   cd frontend
   ```
2. **Install Node.js Dependencies:**

   ```bash
   npm install
   ```
3. **Start the React Development Server:**

   ```bash
   npm start
   ```

   Your React app will open at [http://localhost:3000/](http://localhost:3000/).
4. **API Endpoint Configuration:**

   In the React code (`SentinelViewer.js`), the API URL is set to:

   ```javascript
   const apiUrl = `https://geo-django-react-task.onrender.com/get_sentinel_tiles/?${params.toString()}`
   ```

   Update this URL if you are running the backend locally or have a different deployment URL.

---

## Usage

1. **Open the Application:**Visit your React app (usually at [http://localhost:3000/](http://localhost:3000/)).
2. **Select Dates:**Use the date pickers to choose a start date and an end date.
3. **Load Imagery:**Click the "Load Sentinel-2 Imagery" button to fetch the satellite images.
4. **View on Map:**
   The map will show the background (OpenStreetMap) and the satellite imagery layers as overlays. Use the layer control on the map to toggle between different monthly image composites.

---

## Deployment

For production, build the React app and serve it using Django or deploy the frontend and backend separately.

### Building the React App for Production

1. **Build the React App:**

   ```bash
   npm run build
   ```
2. **Serve the Build Output:**

   Copy the contents of the `build` folder to your Django static files directory or deploy on a static hosting service. Update Django settings accordingly to serve static files.
3. **Configure CORS:**

   Ensure that your Django backend allows requests from your frontend domain by updating the `CORS_ALLOWED_ORIGINS` in `settings.py`.

---

## Additional Notes

- **Error Handling:**The app validates input parameters (dates and map coordinates) and alerts the user if there are issues.
- **Map Interaction:**Users can pan and zoom the map. The Leaflet map is initialized in `MapContainer`, and additional layers are added using `LayersControl`.
- **Google Earth Engine:**The backend fetches and processes satellite imagery from GEE using a service account. The processed imagery is sent to the frontend as TMS URLs for display.
- **React-Django Integration:**
  The React frontend communicates with the Django backend via API calls. The backend processes data from GEE and returns it in JSON format, which the frontend then uses to render map layers.

---

## Contact

For more information, please refer to the GitHub repository .
