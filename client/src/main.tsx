import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/App.css'; // Your global styles

// Get the base URL for routing (supports both dev and GitHub Pages)
const basename = import.meta.env.DEV ? '' : '/Roomify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
