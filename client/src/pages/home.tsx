import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import { format } from "date-fns"
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const Home: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showValidation, setShowValidation] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchValue.trim() || isSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(() => {
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, isSelected]);

  const handleSearch = () => {
    setShowValidation(true);
    if (isFormValid) {
      navigate(`/search?location=${encodeURIComponent(searchValue)}`);
    }
  };

  // Add disabled state for button
  const isFormValid = searchValue && checkInDate && checkOutDate && guests.adults > 0;

  // Add this helper function at the top of your component
  const adjustForTimezone = (date: Date) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    return newDate;
  };

  // Add this handler for check-in date changes
  const handleCheckInChange = (date: Date | null) => {
    if (date) {
      date.setHours(20, 0, 0, 0);
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
                    placeholder="Search by College or University"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setIsSelected(false);
                    }}
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
                            setSuggestions([]);
                            setShowSuggestions(false);
                            setIsSelected(true);
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
                  <div className={styles.datePickerContainer}>
                    <button
                      className={styles.dateButton}
                      onClick={() => {
                        setShowCheckIn(!showCheckIn);
                        setShowCheckOut(false);
                      }}
                      type="button"
                    >
                      {checkInDate ? format(new Date(checkInDate), 'MMM d, yyyy') : 'Check in'}
                      <span className={styles.calendarIcon}>📅</span>
                    </button>
                    {showCheckIn && (
                      <div className={styles.calendarWrapper}>
                        <DayPicker
                          mode="single"
                          selected={checkInDate ? new Date(checkInDate + 'T20:00:00') : undefined}
                          onSelect={(date) => {
                            if (date) {
                              date.setHours(20, 0, 0, 0);
                              handleCheckInChange(date);
                              setShowCheckIn(false);
                            }
                          }}
                          disabled={{ before: new Date() }}
                          className={styles.calendar}
                        />
                      </div>
                    )}
                  </div>
                  {showValidation && !checkInDate && (
                    <div className={styles.validationMessage}>Please select a check-in date</div>
                  )}
                </div>

                <div className={styles.dateInput}>
                  <label>CHECK OUT</label>
                  <div className={styles.datePickerContainer}>
                    <button
                      className={styles.dateButton}
                      onClick={() => {
                        setShowCheckOut(!showCheckOut);
                        setShowCheckIn(false);
                      }}
                      type="button"
                      disabled={!checkInDate}
                    >
                      {checkOutDate ? format(new Date(checkOutDate), 'MMM d, yyyy') : 'Check out'}
                      <span className={styles.calendarIcon}>📅</span>
                    </button>
                    {showCheckOut && (
                      <div className={styles.calendarWrapper}>
                        <DayPicker
                          mode="single"
                          selected={checkOutDate ? new Date(checkOutDate + 'T20:00:00') : undefined}
                          onSelect={(date) => {
                            if (date) {
                              date.setHours(20, 0, 0, 0);
                              setCheckOutDate(date.toISOString().split('T')[0]);
                              setShowCheckOut(false);
                            }
                          }}
                          disabled={{
                            before: checkInDate ? new Date(checkInDate + 'T20:00:00') : new Date()
                          }}
                          className={styles.calendar}
                        />
                      </div>
                    )}
                  </div>
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
