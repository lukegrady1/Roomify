import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import CombinedAuth from './pages/CombinedAuth';
import SearchPage from './pages/SearchPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import './styles/App.css'; // Correct way to import CSS for global styles

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<CombinedAuth />} /> {/* Replaced Login with CombinedAuth */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/listing/:id/:slug?" element={<ListingDetailPage />} />
      <Route path="/list-your-place" element={<CreateListingPage />} />
    </Routes>
  );
};

export default App;
