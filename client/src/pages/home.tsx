//Homepage before redesign if I need to come back to this look at this commit in the github

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const containerStyle = {
  width: '100%',
  height: '600px',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
};

const defaultCenter = {
  lat: 42.2746, // Latitude for WPI campus
  lng: -71.8063, // Longitude for WPI campus
};

const Home: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB2Z_STUVum1L3BPl1SqgcUDsVXM50f12s', // Replace with your API key
  });

  // State for auto-fill functionality
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Map state for center and zoom
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(15);

  // Fetch suggestions based on user input
  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${searchValue}&school.degrees_awarded.predominant=2,3&fields=school.name,location.lat,location.lon&api_key=Xpxl6fdwzfjF8paehVPMXKOaxSFvmvtOL2vFUHZw`
        );
        const data = await response.json();

        const formattedSuggestions = data.results.map((item: any) => ({
          name: item['school.name'],
          lat: item['location.lat'],
          lng: item['location.lon'],
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: { name: string; lat: number; lng: number }) => {
    setSearchValue(suggestion.name);
    setMapCenter({ lat: suggestion.lat, lng: suggestion.lng });
    setMapZoom(15); // Zoom in to the selected location
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Header */}
      <Navbar />

      {/* Map Background */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          options={{
            gestureHandling: 'auto',
            draggable: true,
            scrollwheel: true,
            fullscreenControl: true,
            mapTypeControl: true,
          }}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <h1>Find Your Sublet, Your Way</h1>
        <p>Discover the best sublets near your campus in just a few clicks.</p>
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Campus/City"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input type="date" />
          <input type="date" />
          <button>Find Sublet</button>
        </div>
      </div>

      {/* Promoted Sublets Section */}
      <section className="sublets">
        <h2>Promoted Sublets Near You</h2>
        <div className="sublet-grid">
          {/* Example Sublet Cards */}
          <div className="sublet-card">
            <img
              src="https://th.bing.com/th/id/R.548d5f091281ff83e819a3b01156b4ad?rik=mQZy7dm%2f4TvaNQ&pid=ImgRaw&r=0"
              alt="Sublet 1"
            />
            <h3>Cozy 1-Bedroom Apartment</h3>
            <p>$800/month - 5 min from campus</p>
          </div>
          <div className="sublet-card">
            <img
              src="https://images1.apartments.com/i2/KOBkf5EUHWgcJ6oNIvyT-BFIA0_fDZiunX6u8M_Vnkk/111/stonegate-luxury-furnished-apartments-mesa-az-1-bedroom.jpg"
              alt="Sublet 2"
            />
            <h3>Modern Studio</h3>
            <p>$700/month - Near library</p>
          </div>
          <div className="sublet-card">
            <img
              src="https://www.mues.us/wp-content/uploads/2021/03/exterior_new-scaled-e1616805070908-2048x1024.jpg"
              alt="Sublet 3"
            />
            <h3>Spacious 2-Bedroom</h3>
            <p>$1,200/month - Great amenities</p>
          </div>
          <div className="sublet-card">
            <img
              src="https://th.bing.com/th/id/OIP.Xr-3ixTHZnRhEUReDiamrAHaE6?rs=1&pid=ImgDetMain"
              alt="Sublet 4"
            />
            <h3>Shared Room in Student Housing</h3>
            <p>$500/month - Close to park</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
