import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import ListingDetailPage from '../pages/ListingDetailPage';
import CreateListingPage from '../pages/CreateListingPage';
import MessagesPage from '../pages/MessagesPage';
import AuthPages from '../pages/AuthPages';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/listing/:id/:slug" element={<ListingDetailPage />} />
        <Route path="/list-your-place" element={<CreateListingPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:threadId" element={<MessagesPage />} />
        <Route path="/login" element={<AuthPages />} />
        <Route path="/signup" element={<AuthPages />} />
        <Route path="/profile" element={<AuthPages />} />
      </Routes>
    </div>
  );
}

export default App;