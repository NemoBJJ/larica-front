import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App';
import { register } from './service-worker-registration'; // <-- ADICIONE ESTA LINHA

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// registra o service worker para PWA
register(); // <-- ADICIONE ESTA LINHA
