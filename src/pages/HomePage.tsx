// src/pages/HomePage.tsx - VERSÃO COMPLETA COM LOGO NO RODAPÉ
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
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
            style={{
              maxWidth: '180px',
              filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))'
            }}
          />
          <h1 className="home-title" style={{
            color: '#FF6B35',
            fontSize: '2.5rem',
            margin: '20px 0 10px 0',
            textShadow: '0 0 10px rgba(255, 107, 53, 0.3)'
          }}>
            🍔 LARICA Food Delivery
          </h1>
          <p className="home-subtitle" style={{
            color: '#CCCCCC',
            fontSize: '1.2rem',
            marginBottom: '40px'
          }}>
            Seu delivery favorito a um clique de distância
          </p>
        </div>

        <div className="home-buttons" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {/* BOTÕES PRINCIPAIS */}
          <button 
            onClick={() => navigate('/login')} 
            className="home-btn home-btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)',
              color: '#000000',
              border: '2px solid #FF6B35',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(255, 107, 53, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 107, 53, 0.4)';
            }}
          >
            👤 ENTRAR COMO CLIENTE
          </button>
          
          <button 
            onClick={() => navigate('/login-dono')} 
            className="home-btn home-btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              color: '#FF6B35',
              border: '2px solid #FF6B35',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🍽️ ENTRAR COMO RESTAURANTE
          </button>

          <div className="home-divider" style={{
            width: '100%',
            borderTop: '1px solid rgba(255, 107, 53, 0.3)',
            margin: '25px 0',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#000000',
              color: '#FF6B35',
              padding: '0 15px',
              fontSize: '0.9rem'
            }}>
              ou
            </span>
          </div>
          
          {/* BOTÕES SECUNDÁRIOS */}
          <button 
            onClick={() => navigate('/cadastro')} 
            className="home-btn home-btn-secondary"
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255, 107, 53, 0.05)',
              color: '#FF6B35',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
              e.currentTarget.style.borderColor = '#FF6B35';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 53, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
            }}
          >
            👤 Cadastrar como Cliente
          </button>
          
          <button 
            onClick={() => navigate('/cadastro-dono')} 
            className="home-btn home-btn-secondary"
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255, 107, 53, 0.05)',
              color: '#FF6B35',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
              e.currentTarget.style.borderColor = '#FF6B35';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 53, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
            }}
          >
            🏪 Cadastrar Restaurante
          </button>
          
          {/* LINK PARA LANDING PAGE */}
          <button 
            onClick={() => navigate('/landing')}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: '10px',
              opacity: 0.8,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = '#FF6B35';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            🎬 Conhecer mais sobre a plataforma →
          </button>
        </div>

        {/* ✅ RODAPÉ COM LOGO */}
        <div className="home-footer">
          <div style={{ marginBottom: '20px' }}>
            <img 
              src={laricaLogo}
              alt="LARICA Food Delivery" 
              className="home-footer-logo"
            />
            <p className="home-footer-tagline">Sua fome, nossa entrega</p>
          </div>
          
          <div className="home-footer-info">
            <p>© 2024 LARICA Food Delivery - Todos os direitos reservados</p>
            <p>📱 App disponível para iOS e Android</p>
            <p>📍 Natal - RN, Brasil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;