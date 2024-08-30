import React, { useState } from 'react';
import Papa from 'papaparse';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MapView } from './index';

interface Location {
  id: string;
  ElephantMarker: string;
  date: string;
  latitude: number;
  longitude: number;
  name: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
          const parsedLocations: Location[] = (result.data as string[][])
            .map((location: string[]) => {
              const latitude = parseFloat(location[3]);
              const longitude = parseFloat(location[4]);

              // Validate latitude and longitude
              if (isNaN(latitude) || isNaN(longitude)) {
                console.error(`Invalid latitude or longitude in the data: ${location[3]}, ${location[4]}`);
                return null; // Skip this location if invalid
              }

              return {
                id: location[0],
                ElephantMarker: location[1],
                date: location[2],
                latitude,
                longitude,
                name: location[5],
              };
            })
            .filter((location): location is Location => location !== null); // Type guard to ensure location is Location

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
      <h1>Ali Location Redar</h1>
      {/* <TextField
      > */}

<Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileUpload}
        multiple
      />
    </Button>

      {/* </TextField> */}
      {locations.length > 0 && (
        <>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ElephantMarker</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell>Longitude</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.slice(0, 10).map((location, index) => (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: location === currentLocation ? '#d3d3d3' : 'transparent' }}
                  >
                    <TableCell>{location.id}</TableCell>
                    <TableCell>{location.ElephantMarker}</TableCell>
                    <TableCell>{location.date}</TableCell>
                    <TableCell>{location.latitude}</TableCell>
                    <TableCell>{location.longitude}</TableCell>
                    <TableCell>{location.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <MapView locations={locations} onLocationChange={handleLocationChange} />
        </>
      )}
    </div>
  );
};

export default CsvReader;
