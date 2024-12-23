import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue) {
      navigate(`/search?location=${encodeURIComponent(searchValue)}`);
    }
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${searchValue}&school.degrees_awarded.predominant=2,3&fields=school.name&api_key=Xpxl6fdwzfjF8paehVPMXKOaxSFvmvtOL2vFUHZw`
        );
        const data = await response.json();
        const formattedSuggestions = data.results.map((item: any) => ({
          name: item['school.name'],
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

  const handleSuggestionClick = (suggestion: { name: string }) => {
    setSearchValue(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div id="root">
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720"
              alt="Apartment"
            />
          </div>

          <div className="hero-content">
            <h1>Find Your Sublet, Your Way</h1>
            <p>Discover the best sublets near your campus in just a few clicks.</p>
            <div className="search-box">
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
              <div className="date-inputs">
                <div className="date-input-wrapper">
                  <label>Check-in</label>
                  <input
                    type="date"
                    placeholder="Add Date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                <div className="date-input-wrapper">
                  <label>Check-out</label>
                  <input
                    type="date"
                    placeholder="Add Date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features">
            <div className="feature">
              <h3>Enjoy Some Flexibility</h3>
              <p>Stay flexible with options that fit your schedule.</p>
            </div>
            <div className="feature">
              <h3>Popular Listings</h3>
              <p>Discover sublets near major campuses and cities.</p>
            </div>
            <div className="feature">
              <h3>Trusted Connections</h3>
              <p>Connect with renters and list your sublet securely.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
