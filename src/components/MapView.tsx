import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import L from 'leaflet';

interface Location {
  id: string;
  ElephantMarker: string;
  date: string;
  latitude: number;
  longitude: number;
  name: string;
}

interface MapViewProps {
  locations: Location[];
  onLocationChange: (location: Location) => void;
}

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView: React.FC<MapViewProps> = ({ locations, onLocationChange }) => {
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [path, setPath] = useState<Location[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (locations.length === 0) return;

    const updateLocation = () => {
      setCurrentLocationIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= locations.length) {
          clearInterval(intervalId!);
          return prevIndex; // Keep the index at the last position
        }
        const newLocation = locations[newIndex];
        onLocationChange(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]);
        return newIndex;
      });
    };

    // Clear any existing interval before setting a new one
    if (intervalId) {
      clearInterval(intervalId);
    }

    const id = setInterval(updateLocation, 2000); // Change location every 2 seconds
    setIntervalId(id);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [locations, onLocationChange, intervalId]);

  return (
    <MapContainer center={[locations[0]?.latitude || 0, locations[0]?.longitude || 0]} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.length > 0 && (
        <>
          <Marker
            position={[
              locations[currentLocationIndex]?.latitude || 0,
              locations[currentLocationIndex]?.longitude || 0,
            ]}
          >
            <Popup>Current Location</Popup>
          </Marker>
          <Polyline
            positions={path.map(loc => [loc.latitude, loc.longitude])}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        </>
      )}
    </MapContainer>
  );
};

export default MapView;
