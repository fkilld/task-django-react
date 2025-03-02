// import React, { useState, useRef } from 'react'
// import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'

// const MapComponent = () => {
//   const [startDate, setStartDate] = useState('2023-01-01')
//   const [endDate, setEndDate] = useState('2023-01-02')
//   const [sentinelLayers, setSentinelLayers] = useState([])
//   const mapRef = useRef()
// const handleLoadImagery = async () => {
//   console.log('🛰️ Loading Sentinel-2 Imagery')
//   if (!mapRef.current) {
//     console.error('Map not initialized')
//     return
//   }

//   // Get current map bounds
//   const bounds = mapRef.current.getBounds()
//   const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`
//   console.log('🌐 Bounding Box:', bbox)

//   // Construct API URL
//   const params = new URLSearchParams({
//     start_date: startDate,
//     end_date: endDate,
//     bbox: bbox,
//   }).toString()
//   const url = `http://127.0.0.1:8000/get_sentinel_tiles/?${params}`
//   console.log('📡 API Request URL:', url)

//   try {
//     const response = await fetch(url)
//     console.log('🔔 Response Status:', response.status)

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()
//     console.log('📦 Backend Response Data:', data)

//     // Transform layers for state
//     const layers = data.layers.map((layer) => ({
//       name: layer.label,
//       url: layer.tms_url,
//       start: layer.start,
//       end: layer.end,
//       images: layer.images,
//     }))

//     console.log('🔄 Transformed Layers:', layers)
//     // Append new layers to existing ones
//     setSentinelLayers((prevLayers) => [...prevLayers, ...layers])
//   } catch (error) {
//     console.error('❌ Error fetching Sentinel tiles:', error)
//     alert('Error loading imagery. Check console for details.')
//   }
// }


//   return (
//     <div
//       style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
//     >
//       {/* Date Selectors */}
//       <div style={{ margin: '10px', display: 'flex', gap: '10px' }}>
//         <div>
//           <label>Start Date: </label>
//           <input
//             type='date'
//             value={startDate}
//             onChange={(e) => {
//               console.log('📅 New Start Date:', e.target.value)
//               setStartDate(e.target.value)
//             }}
//           />
//         </div>
//         <div>
//           <label>End Date: </label>
//           <input
//             type='date'
//             value={endDate}
//             onChange={(e) => {
//               console.log('📅 New End Date:', e.target.value)
//               setEndDate(e.target.value)
//             }}
//           />
//         </div>
//       </div>

//       {/* Load Imagery Button */}
//       <button
//         onClick={handleLoadImagery}
//         style={{
//           padding: '10px 20px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//         }}
//       >
//         Load Sentinel-2 Imagery
//       </button>

//       {/* Leaflet Map */}
//       <MapContainer
//         ref={mapRef}
//         center={[51.48, -0.1265]} // London area coordinates
//         zoom={9}
//         style={{ height: '600px', width: '90vw', margin: '20px' }}
//       >
//         <LayersControl position='topright'>
//           {/* Base Layer */}
//           <LayersControl.BaseLayer checked name='OpenStreetMap'>
//             <TileLayer
//               url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//               attribution='&copy; OpenStreetMap contributors'
//             />
//           </LayersControl.BaseLayer>

//           {/* Dynamic Sentinel-2 Layers */}
//           {sentinelLayers.map((layer, index) => (
//             <LayersControl.Overlay
//               key={index}
//               name={`${layer.name} (${layer.start} to ${layer.end})`}
//             >
//               <TileLayer
//                 url={layer.url}
//                 attribution='Google Earth Engine'
//                 opacity={0.8}
//                 eventHandlers={{
//                   add: () => console.log('🗺️ Layer added:', layer.name),
//                   remove: () => console.log('🗺️ Layer removed:', layer.name),
//                 }}
//               />
//             </LayersControl.Overlay>
//           ))}
//         </LayersControl>
//       </MapContainer>
//     </div>
//   )
// }

// export default MapComponent

// import React, { useState, useRef } from 'react'
// import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'

// const MapComponent = () => {
//   const [startDate, setStartDate] = useState('2023-01-01')
//   const [endDate, setEndDate] = useState('2023-01-02')
//   const [sentinelLayers, setSentinelLayers] = useState([])
//   const mapRef = useRef()

//   const handleLoadImagery = async () => {
//     console.log('🛰️ Loading Sentinel-2 Imagery')
//     if (!mapRef.current) {
//       console.error('Map not initialized')
//       return
//     }

//     // Get current map bounds
//     const bounds = mapRef.current.getBounds()
//     const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`
//     console.log('🌐 Bounding Box:', bbox)

//     // Construct API URL
//     const params = new URLSearchParams({
//       start_date: startDate,
//       end_date: endDate,
//       bbox: bbox,
//     }).toString()
//     const url = `http://127.0.0.1:8000/get_sentinel_tiles/?${params}`
//     console.log('📡 API Request URL:', url)

//     try {
//       const response = await fetch(url)
//       console.log('🔔 Response Status:', response.status)

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log('📦 Backend Response Data:', data)

//       // Transform layers for state
//       const layers = data.layers.map((layer) => ({
//         name: layer.label,
//         url: layer.tms_url,
//         start: layer.start,
//         end: layer.end,
//         images: layer.images,
//       }))

  //     console.log('🔄 Transformed Layers:', layers)
  //     // Append new layers to existing ones
  //     setSentinelLayers((prevLayers) => [...prevLayers, ...layers])
  //   } catch (error) {
  //     console.error('❌ Error fetching Sentinel tiles:', error)
  //     alert('Error loading imagery. Check console for details.')
  //   }
  // }

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#f9f9f9',
//         fontFamily: 'sans-serif',
//       }}
//     >
//       {/* Header / Title */}
//       <header
//         style={{
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           padding: '1rem',
//           textAlign: 'center',
//           fontSize: '1.5rem',
//         }}
//       >
//         Sentinel-2 Imagery Viewer
//       </header>

//       {/* Controls */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: '1rem',
//           margin: '1rem 0',
//         }}
//       >
//         {/* Date Selectors */}
//         <div
//           style={{
//             display: 'flex',
//             gap: '0.5rem',
//             alignItems: 'center',
//             backgroundColor: '#fff',
//             padding: '0.75rem 1rem',
//             borderRadius: '8px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           }}
//         >
//           <label htmlFor='start-date' style={{ fontWeight: 'bold' }}>
//             Start Date:
//           </label>
//           <input
//             id='start-date'
//             type='date'
//             value={startDate}
//             onChange={(e) => {
//               console.log('📅 New Start Date:', e.target.value)
//               setStartDate(e.target.value)
//             }}
//             style={{ padding: '0.25rem' }}
//           />
//         </div>

//         <div
//           style={{
//             display: 'flex',
//             gap: '0.5rem',
//             alignItems: 'center',
//             backgroundColor: '#fff',
//             padding: '0.75rem 1rem',
//             borderRadius: '8px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           }}
//         >
//           <label htmlFor='end-date' style={{ fontWeight: 'bold' }}>
//             End Date:
//           </label>
//           <input
//             id='end-date'
//             type='date'
//             value={endDate}
//             onChange={(e) => {
//               console.log('📅 New End Date:', e.target.value)
//               setEndDate(e.target.value)
//             }}
//             style={{ padding: '0.25rem' }}
//           />
//         </div>

//         {/* Load Imagery Button */}
//         <button
//           onClick={handleLoadImagery}
//           style={{
//             padding: '0.75rem 1.5rem',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//           }}
//         >
//           Load Sentinel-2 Imagery
//         </button>
//       </div>

//       {/* Map Container */}
//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           justifyContent: 'center',
//           marginBottom: '1rem',
//         }}
//       >
//         <MapContainer
//           ref={mapRef}
//           center={[51.48, -0.1265]} // London area coordinates
//           zoom={9}
//           style={{
//             height: '600px',
//             width: '90%',
//             maxWidth: '1200px',
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//             boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//           }}
//         >
//           <LayersControl position='topright'>
//             {/* Base Layer */}
//             <LayersControl.BaseLayer checked name='OpenStreetMap'>
//               <TileLayer
//                 url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//                 attribution='&copy; OpenStreetMap contributors'
//               />
//             </LayersControl.BaseLayer>

//             {/* Dynamic Sentinel-2 Layers */}
//             {sentinelLayers.map((layer, index) => (
//               <LayersControl.Overlay
//                 key={index}
//                 name={`${layer.name} (${layer.start} to ${layer.end})`}
//               >
//                 <TileLayer
//                   url={layer.url}
//                   attribution='Google Earth Engine'
//                   opacity={0.8}
//                   eventHandlers={{
//                     add: () => console.log('🗺️ Layer added:', layer.name),
//                     remove: () => console.log('🗺️ Layer removed:', layer.name),
//                   }}
//                 />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//         </MapContainer>
//       </div>

//       {/* Footer */}
//       <footer
//         style={{
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           textAlign: 'center',
//           padding: '0.5rem',
//         }}
//       >
//         © {new Date().getFullYear()} Sentinel-2 Viewer
//       </footer>
//     </div>
//   )
// }

// export default MapComponent
import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapInitializer = ({ onMapReady }) => {
  const map = useMap()
  const initialized = useRef(false)

  useEffect(() => {
    if (map && !initialized.current) {
      onMapReady(map)
      initialized.current = true
    }
  }, [map, onMapReady])

  return null
}

const SentinelViewer = () => {
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-01-31')
  const [sentinelLayerGroups, setSentinelLayerGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  const mapRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort()
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  const handleMapReady = (mapInstance) => {
    mapRef.current = mapInstance
    setMapReady(true)
  }

  const validateParameters = (bounds) => {
    const errors = []

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start > end) errors.push('End date must be after start date')
    if (isNaN(start)) errors.push('Invalid start date')
    if (isNaN(end)) errors.push('Invalid end date')

    const isValidCoord = (num, max) => !isNaN(num) && Math.abs(num) <= max
    const coords = {
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    }

    if (!isValidCoord(coords.west, 180)) errors.push('Invalid west coordinate')
    if (!isValidCoord(coords.east, 180)) errors.push('Invalid east coordinate')
    if (!isValidCoord(coords.south, 90)) errors.push('Invalid south coordinate')
    if (!isValidCoord(coords.north, 90)) errors.push('Invalid north coordinate')

    return errors
  }

  const handleLoadImagery = async () => {
    if (!mapRef.current || loading || !mapReady) return

    setLoading(true)
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

      const apiUrl = `http://127.0.0.1:8000/get_sentinel_tiles/?${params}`
      const response = await fetch(apiUrl, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorBody}`)
      }

      const data = await response.json()
      if (!data?.layers) throw new Error('Missing layers in response')

      // Store new layer group with date parameters
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
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif',
      }}
    >
      <header style={headerStyle}>Sentinel-2 Imagery Viewer</header>

      <div style={controlsStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor='start-date'>Start Date:</label>
          <input
            id='start-date'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div style={inputGroupStyle}>
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
          style={buttonStyle}
        >
          {loading ? 'Loading...' : 'Load Sentinel-2 Imagery'}
        </button>
      </div>

      <div style={mapContainerStyle}>
        <div style={mapWrapperStyle}>
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

      <footer style={footerStyle}>
        © {new Date().getFullYear()} Sentinel-2 Viewer
      </footer>
    </div>
  )
}

// Style constants
const headerStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)'
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  margin: '1rem',
  padding: '0 1rem'
};

const inputGroupStyle = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  minWidth: '215px'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  minWidth: '200px'
};

const mapContainerStyle = {
  flex: 1,
  padding: '0 1rem 1rem 1rem'
};

const mapWrapperStyle = {
  height: 'calc(100vh - 200px)',
  minHeight: '400px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  overflow: 'hidden'
};

const footerStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  textAlign: 'center',
  padding: '0.5rem'
};

export default SentinelViewer;