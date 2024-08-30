import React, { useState } from 'react';
import Papa from 'papaparse';
import { MapView } from './index';

interface Location {
  id: string;
  route: string;
  date: string;
  latitude: number;
  longitude: number;
  name: string;
}

const CsvReader: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: false, // Since your dataset doesn't have a header row
        skipEmptyLines: true,
        complete: (result) => {
          const parsedLocations = (result.data as string[][]).map((location: string[]) => {
            const latitude = parseFloat(location[3]);
            const longitude = parseFloat(location[4]);

            // Validate latitude and longitude
            if (isNaN(latitude) || isNaN(longitude)) {
              console.error(`Invalid latitude or longitude in the data: ${location[3]}, ${location[4]}`);
              return null; // Skip this location if invalid
            }

            return {
              id: location[0],
              route: location[1],
              date: location[2],
              latitude,
              longitude,
              name: location[5],
            };
          }).filter((location): location is Location => location !== null);

          setLocations(parsedLocations);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        }
      });
    }
  };

  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
  };

  return (
    <div>
      <h1>Ali location Redar</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {locations.length > 0 && (
        <>
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Date</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                 <tr key={index} style={{ backgroundColor: location === currentLocation ? '#d3d3d3' : 'transparent' }}>
                  <td>{location.id}</td>
                  <td>{location.route}</td>
                  <td>{location.date}</td>
                  <td>{location.latitude}</td>
                  <td>{location.longitude}</td>
                  <td>{location.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <MapView locations={locations} onLocationChange={handleLocationChange} />
        </>
      )}
    </div>
  );
};

export default CsvReader;
