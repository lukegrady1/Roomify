import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const containerStyle = {
  width: '100%',
  height: '600px', // Increased the height to make the map more prominent
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
};

const center = {
    lat: 42.2746, // Latitude for WPI campus
    lng: -71.8063, // Longitude for WPI campus
  };

const Home: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB2Z_STUVum1L3BPl1SqgcUDsVXM50f12s', // Replace with your API key
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Header */}
      <Navbar />

      {/* Map Background */}
      {isLoaded ? (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          gestureHandling: 'auto', // Enables touch gestures like pan and zoom
          draggable: true, // Ensures the map can be dragged
          scrollwheel: true, // Allows zooming with the mouse wheel
          fullscreenControl: true, // Adds a fullscreen button on the map
          mapTypeControl: true, // Adds map/satellite type controls
        }}
      />
      ) : (
        <div>Loading map...</div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <h1>Find Your Sublet, Your Way</h1>
        <p>Discover the best sublets near your campus in just a few clicks.</p>
        <div className="search-bar">
          <input type="text" placeholder="Campus/City" />
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
            <img src="https://th.bing.com/th/id/R.548d5f091281ff83e819a3b01156b4ad?rik=mQZy7dm%2f4TvaNQ&pid=ImgRaw&r=0" alt="Sublet 1" />
            <h3>Cozy 1-Bedroom Apartment</h3>
            <p>$800/month - 5 min from campus</p>
          </div>
          <div className="sublet-card">
            <img src="https://images1.apartments.com/i2/KOBkf5EUHWgcJ6oNIvyT-BFIA0_fDZiunX6u8M_Vnkk/111/stonegate-luxury-furnished-apartments-mesa-az-1-bedroom.jpg" alt="Sublet 2" />
            <h3>Modern Studio</h3>
            <p>$700/month - Near library</p>
          </div>
          <div className="sublet-card">
            <img src="https://www.mues.us/wp-content/uploads/2021/03/exterior_new-scaled-e1616805070908-2048x1024.jpg" alt="Sublet 3" />
            <h3>Spacious 2-Bedroom</h3>
            <p>$1,200/month - Great amenities</p>
          </div>
          <div className="sublet-card">
            <img src="https://th.bing.com/th/id/OIP.Xr-3ixTHZnRhEUReDiamrAHaE6?rs=1&pid=ImgDetMain" alt="Sublet 4" />
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
