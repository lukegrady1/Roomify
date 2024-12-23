import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import SearchPage from './pages/SearchPage';

const App: React.FC = () => {
  return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
  );
};

export default App;
