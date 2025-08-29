import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// ⬇️ importa a logo (ajusta o path se usar outra pasta)
import laricaLogo from '../assets/larica-logo.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        {/* HERO COM LOGO */}
        <div className="home-hero">
          <img
            src={laricaLogo}
            alt="LARICA food - logo"
            className="home-logo"
            loading="eager"
            decoding="async"
          />
          {/* Mantém o h1 para SEO/acessibilidade, mas visual vem da logo */}
          <h1 className="home-title"></h1>
          <p className="home-subtitle"></p>
        </div>

        <div className="home-buttons">
          <button
            onClick={() => navigate('/login')}
            className="home-btn home-btn-primary"
          >
            👤 Cliente
          </button>

          <button
            onClick={() => navigate('/login-dono')}
            className="home-btn home-btn-primary"
          >
            🍽️ Restaurante
          </button>

          <div className="home-divider"></div>

          <button
            onClick={() => navigate('/cadastro')}
            className="home-btn home-btn-secondary"
          >
            ➕ Cadastrar Cliente
          </button>

          <button
            onClick={() => navigate('/cadastro-dono')}
            className="home-btn home-btn-secondary"
          >
            🏪 Cadastrar Dono + Restaurante
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
