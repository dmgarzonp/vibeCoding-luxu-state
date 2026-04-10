'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not showing correctly in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PropertyMapProps {
  locationString: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ locationString }) => {
  // In a real scenario, you'd use a Geocoding service to turn locationString into coordinates.
  // For this mock, we use a fixed coordinate or map based on string heuristically.
  const position: [number, number] = [37.4419, -122.1430]; // Default: Palo Alto approx.

  return (
    <div className="w-full h-full min-h-[300px] z-0 relative rounded-lg overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            {locationString}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
