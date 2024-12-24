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
          <Link to="/list" className={styles.navbarLink}>List Your Sublet</Link>
          <Link to="/auth" className={styles.navbarLink}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
