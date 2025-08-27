import React, { useState } from 'react';

const SearchFilters: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [bedrooms, setBedrooms] = useState(1);
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleFilterChange = () => {
    onFilterChange({ priceRange, bedrooms, amenities });
  };

  return (
    <div>
      <h3>Filters</h3>
      <label>
        Price Range:
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
        />
        to
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
        />
      </label>
      <label>
        Bedrooms:
        <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3+</option>
        </select>
      </label>
      <label>
        Amenities:
        <input
          type="checkbox"
          checked={amenities.includes('furnished')}
          onChange={() => setAmenities((prev) => prev.includes('furnished') ? prev.filter(a => a !== 'furnished') : [...prev, 'furnished'])}
        />
        Furnished
      </label>
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default SearchFilters; 