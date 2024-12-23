import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/components/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Link for Roomify */}
        <Link to="/" className={styles.navbarBrand}>
          Roomify
        </Link>
        <div className={styles.navbarLinks}>
          <Link to="/search" className={styles.navbarLink}>Find Sublets</Link>
          <Link to="/list" className={styles.navbarLink}>List Your Sublet</Link>
          <Link to="/dashboard" className={styles.navbarLink}>Dashboard</Link>
          <Link to="/login" className={styles.navbarLink}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
