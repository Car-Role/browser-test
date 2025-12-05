import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import StreamerSetup from './StreamerSetup';
import ViewerSetup from './ViewerSetup';

function getViewFromHash() {
  const hash = window.location.hash;
  if (hash === '#dashboard') return 'dashboard';
  if (hash === '#streamer-setup') return 'streamer-setup';
  if (hash === '#viewer-setup') return 'viewer-setup';
  return 'landing';
}

function App() {
  // Simple hash-based routing
  const [view, setView] = useState(getViewFromHash());

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  switch (view) {
    case 'dashboard':
      return <Dashboard />;
    case 'streamer-setup':
      return <StreamerSetup />;
    case 'viewer-setup':
      return <ViewerSetup />;
    default:
      return <LandingPage />;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
