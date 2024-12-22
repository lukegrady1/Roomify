import React from 'react';
import styles from '../styles/components/SearchBar.module.css';

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Campus/City" />
      <input type="date" />
      <input type="date" />
      <button>Find Sublet</button>
    </div>
  );
};

export default SearchBar;
