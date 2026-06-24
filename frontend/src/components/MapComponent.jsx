import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const MapComponent = ({ places }) => {
  // Filter out places without coordinates
  const validPlaces = places.filter(p => p.lat && p.lon);
  
  const defaultCenter = validPlaces.length > 0 
    ? [validPlaces[0].lat, validPlaces[0].lon] 
    : [0, 0];

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px] w-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={defaultCenter} />
        {validPlaces.map((place, idx) => (
          <Marker key={idx} position={[place.lat, place.lon]}>
            <Popup>
              <div className="text-slate-900">
                <p className="font-bold">{place.name}</p>
                <p className="text-xs">{place.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
