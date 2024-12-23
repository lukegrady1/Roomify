import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 42.3601, // Default to Boston
  lng: -71.0589,
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [center, setCenter] = useState(defaultCenter);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB2Z_STUVum1L3BPl1SqgcUDsVXM50f12s', // Replace with your Google Maps API key
  });

  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      const geocodeAddress = async () => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              location
            )}&key=AIzaSyB2Z_STUVum1L3BPl1SqgcUDsVXM50f12s`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            setCenter({ lat, lng });
          }
        } catch (error) {
          console.error('Error fetching geocoded data:', error);
        }
      };
      geocodeAddress();
    }
  }, [searchParams]);

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchPage;
