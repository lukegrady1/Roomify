import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

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

  const handleSearch = () => {
    setShowValidation(true);
    if (isFormValid) {
      navigate(`/search?location=${encodeURIComponent(searchValue)}`);
    }
  };

  // Add disabled state for button
  const isFormValid = searchValue && checkInDate && checkOutDate && guests.adults > 0;

  // Add this handler for check-in date changes
  const handleCheckInChange = (date: Date | null) => {
    // Set the time to noon to avoid timezone issues
    if (date) {
      date.setHours(12, 0, 0, 0);
    }
    const newCheckInDate = date ? date.toISOString().split('T')[0] : '';
    setCheckInDate(newCheckInDate);
    
    // Clear check-out date if it's before or equal to the new check-in date
    if (checkOutDate && date && new Date(checkOutDate) <= date) {
      setCheckOutDate('');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.searchCard}>
            <h1>Find places to stay near campus</h1>
            <p>Discover student housing and sublets perfect for your academic journey</p>
            
            <div className={styles.searchForm}>
              <div className={styles.searchGroup}>
                <label>LOCATION</label>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    placeholder="Search by university or city"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {showValidation && !searchValue && (
                    <div className={styles.validationMessage}>Please enter a location</div>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchValue(suggestion.name);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.dateGroup}>
                <div className={styles.dateInput}>
                  <label>CHECK IN</label>
                  <DatePicker
                    selected={checkInDate ? new Date(checkInDate + 'T12:00:00') : null}
                    onChange={handleCheckInChange}
                    placeholderText="Check in"
                    className={styles.datePicker}
                    dateFormat="MMM d, yyyy"
                    minDate={new Date()}
                  />
                  {showValidation && !checkInDate && (
                    <div className={styles.validationMessage}>Please select a check-in date</div>
                  )}
                </div>
                <div className={styles.dateInput}>
                  <label>CHECK OUT</label>
                  <DatePicker
                    selected={checkOutDate ? new Date(checkOutDate + 'T12:00:00') : null}
                    onChange={(date) => {
                      if (date) {
                        date.setHours(12, 0, 0, 0);
                      }
                      setCheckOutDate(date ? date.toISOString().split('T')[0] : '');
                    }}
                    placeholderText="Check out"
                    className={styles.datePicker}
                    dateFormat="MMM d, yyyy"
                    minDate={checkInDate ? new Date(checkInDate + 'T12:00:00') : new Date()}
                    disabled={!checkInDate}
                  />
                  {showValidation && !checkOutDate && (
                    <div className={styles.validationMessage}>Please select a check-out date</div>
                  )}
                </div>
              </div>

              <div className={styles.guestsGroup}>
                <label>GUESTS</label>
                <div className={styles.guestInputs}>
                  <select
                    value={guests.adults}
                    onChange={(e) => setGuests({ ...guests, adults: Number(e.target.value) })}
                    aria-label="Number of adults"
                  >
                    {[...Array(16)].map((_, i) => (
                      <option key={i} value={i}>{i} adults</option>
                    ))}
                  </select>
                  {showValidation && guests.adults === 0 && (
                    <div className={styles.validationMessage}>Please select number of guests</div>
                  )}
                </div>
              </div>

              <button className={styles.searchButton} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className={styles.featuresSection}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <h3>Flexible Housing Options</h3>
            <p>Find accommodations that match your academic schedule</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🏛️</div>
            <h3>Campus-Centric Locations</h3>
            <p>Discover housing near universities across the country</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Smart Filters</h3>
            <p>Find the perfect student housing that fits your needs</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
