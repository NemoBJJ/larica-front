import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App';

// 🚫 SERVICE WORKER DESATIVADO TEMPORARIAMENTE
// Motivo: evitar cache quebrando login e rotas protegidas

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in index.html');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
