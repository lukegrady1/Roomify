import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import '../styles/SearchPage.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 42.3601, // Default to Boston
  lng: -71.0589,
};

const listings = [
  {
    title: "Cozy Apartment in Boston",
    price: "$1200/month",
    description: "2 beds, 1 bath, near NEU",
    image: "https://th.bing.com/th/id/R.90cbfa034c96ef58f7cf5b51a56c578e?rik=pWpeNT%2bi78Qs%2bw&riu=http%3a%2f%2fwww.gbdarchitects.com%2fwp-content%2fuploads%2f2013%2f09%2fKiln-Apartments-1.jpg&ehk=BGiAJDxgE3nzRbMVUNPLzH7hMpsk6IDC3TC2sQPkWYQ%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    title: "Modern Studio",
    price: "$900/month",
    description: "Studio near Harvard",
    image: "https://th.bing.com/th/id/OIP.7pvpLzOF0Lx-p4g1T_HdmwHaE8?rs=1&pid=ImgDetMain",
  },
  {
    title: "Shared Room in Student Housing",
    price: "$500/month",
    description: "Close to MIT, 1 bed available",
    image: "https://th.bing.com/th/id/OIP.qv81CG1f9L9B90cdsWB4GgHaE8?rs=1&pid=ImgDetMain",
  },
  {
    title: "Spacious 2-Bedroom Apartment",
    price: "$1400/month",
    description: "Located in Cambridge",
    image: "https://th.bing.com/th/id/R.85cbd0673b32ac840334cd11a500b0c0?rik=vsVCXZJrIl2Qew&riu=http%3a%2f%2fwww.chicagocondofinder.com%2fuploads%2fagent-1%2f_DSC0552_WEB.jpg&ehk=I9FETSHw9EIC5N429WFHx09pKK3Hi4c1mbjFbtQsLm0%3d&risl=&pid=ImgRaw&r=0",
  },
];

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
      {/* Include Navbar */}
      <Navbar />

      <div className="search-page">
        {/* Listings Section */}
        <div className="listings-section">
          <h2>Listings Near You</h2>
          {listings.map((listing, index) => (
            <div className="listing-card" key={index}>
              <img src={listing.image} alt={listing.title} className="listing-image" />
              <div className="listing-details">
                <h3>{listing.title}</h3>
                <p className="listing-price">{listing.price}</p>
                <p>{listing.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="map-section">
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
      </div>
    </div>
  );
};

export default SearchPage;
