import React from 'react';
import styles from '../styles/components/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <h1 className={styles.title}>Roomify</h1>
      <nav>
        <ul className={styles.navList}>
          <li><a href="#find-sublets">Find Sublets</a></li>
          <li><a href="#list-sublets">List Your Sublet</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
