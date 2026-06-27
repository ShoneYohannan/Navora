import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG Icons creator
const createCustomIcon = (type) => {
  let color = '#3b82f6'; // Default: blue
  
  // Normalize type
  const lowerType = (type || '').toLowerCase();
  if (lowerType.includes('attraction')) {
    color = '#10b981'; // Emerald
  } else if (lowerType.includes('restaurant') || lowerType.includes('food')) {
    color = '#ef4444'; // Red
  } else if (lowerType.includes('mall') || lowerType.includes('shopping')) {
    color = '#f59e0b'; // Amber
  } else if (lowerType.includes('theatre') || lowerType.includes('cinema') || lowerType.includes('movie')) {
    color = '#8b5cf6'; // Violet
  }

  return L.divIcon({
    html: `<div style="color: ${color}; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
             </svg>
           </div>`,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const ChangeView = ({ places }) => {
  const map = useMap();
  
  useEffect(() => {
    if (places && places.length > 0) {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [places, map]);

  return null;
};

const MapComponent = ({ places }) => {
  // Filter out places without coordinates and deduplicate
  const seen = new Set();
  const validPlaces = (places || []).filter(p => {
    if (!p.lat || !p.lon) return false;
    const key = `${p.name}-${p.lat}-${p.lon}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  const defaultCenter = validPlaces.length > 0 
    ? [validPlaces[0].lat, validPlaces[0].lon] 
    : [0, 0];

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-full w-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView places={validPlaces} />
        {validPlaces.map((place, idx) => (
          <Marker 
            key={idx} 
            position={[place.lat, place.lon]}
            icon={createCustomIcon(place.type || 'attraction')}
          >
            <Popup>
              <div className="text-slate-900 p-1">
                <p className="font-extrabold text-sm text-slate-800 leading-tight">{place.name}</p>
                {place.address && <p className="text-[10px] text-slate-500 mt-1">{place.address}</p>}
                {place.rating && <p className="text-[10px] text-amber-500 font-bold mt-0.5">Rating: ★ {place.rating}</p>}
                <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 bg-slate-100 rounded-full mt-1.5 uppercase text-slate-600 tracking-wide">
                  {place.type || 'Attraction'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
