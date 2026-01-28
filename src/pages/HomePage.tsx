// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import laricaLogo from '../assets/larica-logo.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <img src={laricaLogo} alt="Larica Food" className="home-logo" />

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
  );
};

export default HomePage;
