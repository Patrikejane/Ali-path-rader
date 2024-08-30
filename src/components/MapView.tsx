import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import L from 'leaflet';

interface Location {
  id: string;
  route: string;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocationIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % locations.length;
        const newLocation = locations[newIndex];
        onLocationChange(newLocation);

        setPath((prevPath) => [...prevPath, newLocation]);

        return newIndex;
      });
    }, 2000); // Change location every 2 seconds

    return () => clearInterval(interval);
  }, [locations.length, onLocationChange]);

  return (
    <MapContainer center={[locations[0]?.latitude, locations[0]?.longitude]} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        
      />
      {locations.length > 0 && (
       <>
       <Marker
         position={[
           locations[currentLocationIndex].latitude,
           locations[currentLocationIndex].longitude,
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
