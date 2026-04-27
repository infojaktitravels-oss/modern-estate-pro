import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ Import BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// Ensure root element exists
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    {/* ✅ Wrap App with BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);