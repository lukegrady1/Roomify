import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
