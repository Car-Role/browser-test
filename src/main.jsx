import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

function App() {
  // Simple hash-based routing
  const [view, setView] = useState(window.location.hash === '#dashboard' ? 'dashboard' : 'landing');

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash === '#dashboard' ? 'dashboard' : 'landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return view === 'dashboard' ? <Dashboard /> : <LandingPage />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
