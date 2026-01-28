// E:\larica-frontend\src\pages\LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <div className="landing-hero">
        <h1 className="landing-title">🍔 LARICA Food Delivery</h1>
        <p className="landing-subtitle">Sistema completo de delivery para seu restaurante</p>
        
        {/* VÍDEO DE DIVULGAÇÃO - COLOQUE SEU LINK AQUI */}
        <div className="video-container">
          <div className="video-wrapper">
            <iframe 
              width="100%" 
              height="400"
              src="https://www.youtube.com/embed/SEU_CODIGO_DO_VIDEO_AQUI" 
              title="Demonstração LARICA - Sistema de Delivery" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <p className="video-caption">🎬 Assista à demonstração do sistema</p>
          </div>
        </div>
        
        {/* CALL TO ACTION */}
        <div className="landing-cta">
          <button 
            onClick={() => navigate('/login-dono')}
            className="btn-landing btn-primary"
          >
            🍽️ Começar Agora - Para Restaurantes
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-landing btn-secondary"
          >
            ← Voltar para Home Simples
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2>✨ Por que escolher o LARICA?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>App para Clientes</h3>
            <p>Interface intuitiva para pedir comida com facilidade</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Painel Restaurante</h3>
            <p>Controle total de pedidos, cardápio e entregas</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Pagamento Online</h3>
            <p>Integração com Mercado Pago - seguro e rápido</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Sistema de Entregas</h3>
            <p>Roteamento inteligente + WhatsApp para entregadores</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Relatórios</h3>
            <p>Dashboard completo com métricas de vendas</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>PWA</h3>
            <p>Funciona offline e pode ser instalado como app</p>
          </div>
        </div>
      </div>

      {/* PARA RESTAURANTES */}
      <div className="for-restaurants">
        <h2>🏪 Para Donos de Restaurante</h2>
        <div className="restaurant-benefits">
          <ul>
            <li>✅ Cadastro gratuito do restaurante</li>
            <li>✅ Painel administrativo completo</li>
            <li>✅ Gerenciamento de cardápio em tempo real</li>
            <li>✅ Controle de pedidos e status</li>
            <li>✅ Sistema de entregas integrado</li>
            <li>✅ Relatórios de vendas detalhados</li>
            <li>✅ Suporte técnico</li>
          </ul>
          
          <button 
            onClick={() => navigate('/cadastro-dono')}
            className="btn-landing btn-cta"
          >
            🚀 Cadastrar Meu Restaurante Gratuitamente
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="landing-footer">
        <p>© 2024 LARICA Food Delivery - Todos os direitos reservados</p>
        <p>Contato: contato@larica.com | (84) 99999-9999</p>
        <div className="footer-links">
          <button onClick={() => navigate('/login')}>Área do Cliente</button>
          <button onClick={() => navigate('/login-dono')}>Área do Restaurante</button>
          <button onClick={() => navigate('/debug-usuario')}>Debug/Status</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;