import { Link } from 'react-router-dom';
import styles from '../styles/components/Navbar.module.css';
import type { FC } from 'react';

const Navbar: FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarBrand}>
          <span className={styles.logo}>🏠</span>
          <span className={styles.brandName}>Roomify</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link to="/list" className={styles.navLink}>
            List Your Space
          </Link>
          <Link to="/auth" className={styles.authButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
