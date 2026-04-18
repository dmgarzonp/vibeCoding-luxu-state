'use client';

import { useEffect, useRef } from 'react';

interface PropertyMapProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

// Default center: Colombia
const DEFAULT_LAT = 4.5709;
const DEFAULT_LNG = -74.2973;
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 14;

export default function PropertyMap({ lat, lng, onChange }: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    // Leaflet must run only in the browser
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapRef.current || initializingRef.current) return;

    const initMap = async () => {
      if (mapRef.current || initializingRef.current) return;
      initializingRef.current = true;

      try {
        const L = (await import('leaflet')).default;

        // Final check: is there already a map instance on this DOM element?
        if ((mapContainerRef.current as any)?._leaflet_id) {
          initializingRef.current = false;
          return;
        }

        // Fix default icon paths that get broken by bundlers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const initialLat = lat ?? DEFAULT_LAT;
        const initialLng = lng ?? DEFAULT_LNG;
        const initialZoom = (lat && lng) ? SELECTED_ZOOM : DEFAULT_ZOOM;

        const map = L.map(mapContainerRef.current!, {
          center: [initialLat, initialLng],
          zoom: initialZoom,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // If coordinates already exist, place marker
        if (lat && lng) {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current.getLatLng();
            onChange(
              parseFloat(pos.lat.toFixed(7)),
              parseFloat(pos.lng.toFixed(7)),
            );
          });
        }

        // Click to place / move marker
        map.on('click', (e: any) => {
          const { lat: clickLat, lng: clickLng } = e.latlng;

          if (markerRef.current) {
            markerRef.current.setLatLng([clickLat, clickLng]);
          } else {
            markerRef.current = L.marker([clickLat, clickLng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', () => {
              const pos = markerRef.current.getLatLng();
              onChange(
                parseFloat(pos.lat.toFixed(7)),
                parseFloat(pos.lng.toFixed(7)),
              );
            });
          }

          onChange(
            parseFloat(clickLat.toFixed(7)),
            parseFloat(clickLng.toFixed(7)),
          );
        });

        mapRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      } finally {
        initializingRef.current = false;
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep marker in sync when lat/lng change externally (manual input)
  useEffect(() => {
    if (!mapRef.current) return;

    const doUpdate = async () => {
      const L = (await import('leaflet')).default;
      if (lat !== null && lng !== null) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current.getLatLng();
            onChange(
              parseFloat(pos.lat.toFixed(7)),
              parseFloat(pos.lng.toFixed(7)),
            );
          });
        }
        mapRef.current.setView([lat, lng], SELECTED_ZOOM);
      }
    };

    doUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div className="space-y-1">
      {/* Map container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* Leaflet CSS injected inline so no extra import needed */}
        <style>{`
          @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
          .leaflet-container { font-family: inherit; }
        `}</style>
        <div
          ref={mapContainerRef}
          style={{ height: '260px', width: '100%', zIndex: 0 }}
        />
        {/* Instruction overlay — only when no coords */}
        {!lat && !lng && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-[400]">
            <span className="bg-white/95 text-nordic px-3 py-1.5 rounded-full shadow-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap border border-gray-100">
              <span className="material-icons text-sm text-mosque">touch_app</span>
              Haz clic para fijar la ubicación
            </span>
          </div>
        )}
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Latitud</label>
          <input
            type="number"
            step="any"
            value={lat ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val, lng ?? DEFAULT_LNG);
            }}
            placeholder="0.0000"
            className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-nordic text-sm font-mono focus:ring-1 focus:ring-mosque focus:border-mosque outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Longitud</label>
          <input
            type="number"
            step="any"
            value={lng ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(lat ?? DEFAULT_LAT, val);
            }}
            placeholder="0.0000"
            className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-nordic text-sm font-mono focus:ring-1 focus:ring-mosque focus:border-mosque outline-none transition-all"
          />
        </div>
      </div>

      {(lat || lng) && (
        <p className="text-xs text-mosque flex items-center gap-1 pt-0.5">
          <span className="material-icons text-[13px]">check_circle</span>
          Ubicación fijada · puedes arrastrar el marcador para ajustar
        </p>
      )}
    </div>
  );
}
