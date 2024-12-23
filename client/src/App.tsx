import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import SearchPage from './pages/SearchPage';
import './styles/App.css'; // Correct way to import CSS for global styles

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