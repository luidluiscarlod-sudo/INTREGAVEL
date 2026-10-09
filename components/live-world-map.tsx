'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Props = { country: string; cities: string[] }

const cityCoordinates: Record<string, [number, number]> = {
  'São Paulo': [-23.5505, -46.6333], 'Rio de Janeiro': [-22.9068, -43.1729], 'Belo Horizonte': [-19.9167, -43.9345], Curitiba: [-25.4284, -49.2733], 'Porto Alegre': [-30.0346, -51.2177], Brasília: [-15.7939, -47.8828], Salvador: [-12.9777, -38.5016], Recife: [-8.0476, -34.877], Fortaleza: [-3.7319, -38.5267], Belém: [-1.4558, -48.4902], Florianópolis: [-27.5954, -48.548], Goiânia: [-16.6869, -49.2648], Manaus: [-3.119, -60.0217], 'São Luís': [-2.5307, -44.3068],
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.flyTo(position, 5, { duration: 1.1 }) }, [map, position])
  return null
}

export function LiveWorldMap({ country, cities }: Props) {
  const locations = cities.map((city) => ({ city, position: cityCoordinates[city] })).filter((item): item is { city: string; position: [number, number] } => Boolean(item.position))
  const center: [number, number] = locations[0]?.position || [-14.235, -51.9253]
  const icon = L.divIcon({ className: 'live-map-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] })

  return <div className="live-world-map" aria-label={`Interactive map showing ${country} and nearby cities`}>
    <MapContainer center={center} zoom={locations.length ? 5 : 2} minZoom={2} maxZoom={12} scrollWheelZoom className="leaflet-map">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter position={center} />
      {locations.map(({ city, position }) => <Marker key={city} position={position} icon={icon}><Popup><strong>{city}</strong><br />Approximate area</Popup></Marker>)}
    </MapContainer>
    <div className="map-live-badge"><i /> LIVE MAP</div>
    <div className="map-legend"><strong>{country}</strong><span>{locations.length ? `${locations.length} city marker${locations.length > 1 ? 's' : ''}` : 'World view'}</span></div>
  </div>
}
