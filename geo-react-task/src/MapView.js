import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fake API Response for Testing
const fakeApiResponse = {
  layers: [
    {
      label: '2023-01 (Sentinel-2)',
      tms_url:
        'https://earthengine.googleapis.com/v1/projects/geoproject-452111/maps/7908961629f15341bafad39ead155c38-104c87a1a8f15e57d26735885bb50d19/tiles/{z}/{x}/{y}',
      start: '2023-01-01',
      end: '2023-01-31',
    },
  ],
  start_date: '2023-01-01',
  end_date: '2023-01-31',
}

// Update Map View on BBox Change
const UpdateMapView = ({ bbox }) => {
  const map = useMap()
  useEffect(() => {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number)
    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2
    console.log(`📍 Updating map center: [${centerLat}, ${centerLon}]`)
    map.setView([centerLat, centerLon], 8)
  }, [bbox, map])
  return null
}

const MapView = ({ sentinelLayers, bbox }) => {
  // Uncomment below to use Fake API response instead of actual API data
  // const sentinelLayers = fakeApiResponse.layers;

  console.log('📡 API Response (sentinelLayers):', sentinelLayers)

  return (
    <MapContainer
      key={bbox}
      center={[37.7, -122.4]}
      zoom={8}
      style={{ height: '600px', width: '100%' }}
    >
      <UpdateMapView bbox={bbox} />
      <LayersControl position='topright'>
        <LayersControl.BaseLayer checked name='OpenStreetMap'>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        </LayersControl.BaseLayer>

        {sentinelLayers.map((layer, index) => {
          const formattedTMSUrl = layer.tms_url
            .replace(/{z}/g, '{z}')
            .replace(/{x}/g, '{x}')
            .replace(/{y}/g, '{y}')

          console.log(`🛰️ Adding Layer: ${layer.label}`)
          console.log(`🔗 TMS URL: ${formattedTMSUrl}`)

          return (
            <LayersControl.BaseLayer key={index} name={layer.label}>
              <TileLayer
                attribution='Map data © Google Earth Engine'
                url={formattedTMSUrl}
                tileSize={256}
                tms={true}
              />
            </LayersControl.BaseLayer>
          )
        })}
      </LayersControl>
    </MapContainer>
  )
}

export default MapView
