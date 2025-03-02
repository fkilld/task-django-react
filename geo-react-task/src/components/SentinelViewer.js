import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapInitializer from './MapInitializer'
import styles from '../styles/styles'

const SentinelViewer = () => {
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-01-31')
  const [sentinelLayerGroups, setSentinelLayerGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  const mapRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort()
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  // Callback when the map is ready; stores the map instance and sets the mapReady flag
  const handleMapReady = useCallback((mapInstance) => {
    mapRef.current = mapInstance
    setMapReady(true)
  }, [])

  // Validate the date inputs and coordinate bounds
  const validateParameters = useCallback(
    (bounds) => {
      const errors = []
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (isNaN(start)) errors.push('Invalid start date')
      if (isNaN(end)) errors.push('Invalid end date')
      if (start > end) errors.push('End date must be after start date')

      const isValidCoord = (num, max) => !isNaN(num) && Math.abs(num) <= max
      const coords = {
        west: bounds.getWest(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        north: bounds.getNorth(),
      }

      if (!isValidCoord(coords.west, 180))
        errors.push('Invalid west coordinate')
      if (!isValidCoord(coords.east, 180))
        errors.push('Invalid east coordinate')
      if (!isValidCoord(coords.south, 90))
        errors.push('Invalid south coordinate')
      if (!isValidCoord(coords.north, 90))
        errors.push('Invalid north coordinate')

      return errors
    },
    [startDate, endDate]
  )

  // Fetch Sentinel-2 imagery layers from the backend based on the current date range and map bounds
  const handleLoadImagery = useCallback(async () => {
    if (!mapRef.current || loading || !mapReady) return

    setLoading(true)
    // Abort any ongoing request and create a new controller
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()

    try {
      const bounds = mapRef.current.getBounds()
      const validationErrors = validateParameters(bounds)
      if (validationErrors.length > 0) {
        alert(`Invalid parameters:\n${validationErrors.join('\n')}`)
        return
      }

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
      })

      const apiUrl = `https://geo-django-react-task.onrender.com/get_sentinel_tiles/?${params.toString()}`
      const response = await fetch(apiUrl, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorBody}`)
      }

      const data = await response.json()
      if (!data?.layers) throw new Error('Missing layers in response')

      // Construct a new layer group with the returned layers
      const newGroup = {
        id: Date.now(),
        loadDate: new Date().toISOString(),
        startDate,
        endDate,
        bounds: bounds.toBBoxString(),
        layers: data.layers.map((layer) => ({
          id: `${layer.label}-${Date.now()}`,
          name: layer.label,
          url: layer.tms_url,
          start: layer.start,
          end: layer.end,
          images: layer.images,
        })),
      }

      setSentinelLayerGroups((prev) => [newGroup, ...prev])
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('API call failed:', error)
        alert(`Failed to load imagery: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, loading, mapReady, validateParameters])

  return (
    <div style={styles.container}>
      <header style={styles.header}>Sentinel-2 Imagery Viewer</header>

      <div style={styles.controls}>
        <div style={styles.inputGroup}>
          <label htmlFor='start-date'>Start Date:</label>
          <input
            id='start-date'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor='end-date'>End Date:</label>
          <input
            id='end-date'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleLoadImagery}
          disabled={!mapReady || loading}
          style={styles.button}
        >
          {loading ? 'Loading...' : 'Load Sentinel-2 Imagery'}
        </button>
      </div>

      <div style={styles.mapContainer}>
        <div style={styles.mapWrapper}>
          <MapContainer
            center={[51.48, -0.1265]}
            zoom={9}
            style={{ height: '100%', width: '100%' }}
          >
            <MapInitializer onMapReady={handleMapReady} />
            <LayersControl position='topright'>
              <LayersControl.BaseLayer checked name='OpenStreetMap'>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; OpenStreetMap contributors'
                />
              </LayersControl.BaseLayer>

              {sentinelLayerGroups.map((group) =>
                group.layers.map((layer) => (
                  <LayersControl.Overlay
                    key={layer.id}
                    name={`${layer.name} (${group.startDate} to ${group.endDate})`}
                  >
                    <TileLayer
                      url={layer.url}
                      attribution='Google Earth Engine'
                      opacity={0.8}
                    />
                  </LayersControl.Overlay>
                ))
              )}
            </LayersControl>
          </MapContainer>
        </div>
      </div>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} Sentinel-2 Viewer
      </footer>
    </div>
  )
}

export default SentinelViewer
