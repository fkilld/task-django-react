import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

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

export default MapInitializer
