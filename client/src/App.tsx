import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import CombinedAuth from './pages/CombinedAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import MessagesPage from './pages/MessagesPage';
import './styles/App.css'; // Correct way to import CSS for global styles

// Debug component to show what's happening with routing
const DebugRouting: React.FC = () => {
  const location = useLocation();
  console.log('Current location:', location);
  return null;
};

const App: React.FC = () => {
  return (
    <>
      <DebugRouting />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<CombinedAuth />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/listing/:id/:slug?" element={<ListingDetailPage />} />
        <Route path="/list-your-place" element={<CreateListingPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:threadId" element={<MessagesPage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">404 - Route Not Found</h2>
              <p><strong>Pathname:</strong> {window.location.pathname}</p>
              <p><strong>Search:</strong> {window.location.search}</p>
              <button onClick={() => window.location.href = '/'} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
};

export default App;
