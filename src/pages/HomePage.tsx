// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import laricaLogo from '../assets/larica-logo.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <img src={laricaLogo} alt="Larica Food" className="home-logo" />
          <h1 className="home-title">Larica Food</h1>
          <p className="home-subtitle">
            O melhor delivery de comida da região
          </p>
        </div>

        <div className="home-actions">
          <button className="btn primary" onClick={() => navigate('/login')}>
            👤 CLIENTE
          </button>

          <button className="btn primary" onClick={() => navigate('/login-dono')}>
            🍽️ RESTAURANTE
          </button>

          <button className="btn secondary" onClick={() => navigate('/cadastro')}>
            ➕ CADASTRAR CLIENTE
          </button>

          <button
            className="btn secondary"
            onClick={() => navigate('/cadastro-dono')}
          >
            🏪 CADASTRAR DONO + RESTAURANTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;