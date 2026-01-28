// src/pages/LandingPage.tsx - VERSÃO FINAL
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import laricaLogo from '../assets/larica-logo.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <div className="landing-hero">
        {/* LOGO NO TOPO */}
        <div className="landing-logo-container">
          <img 
            src={laricaLogo} 
            alt="LARICA Food Delivery" 
            className="landing-logo"
          />
        </div>
        
        <h1 className="landing-title">🍔 LARICA Food Delivery</h1>
        <p className="landing-subtitle">O SEU App de Delivery Mais Completo</p>
        
        {/* VÍDEO DE DIVULGAÇÃO */}
        <div className="video-container">
          <div className="video-wrapper">
            <iframe 
              width="100%" 
              height="400"
              src="https://www.youtube.com/embed/SEU_VIDEO_AQUI" 
              title="Demonstração LARICA - Sistema de Delivery" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <p className="video-caption">🎬 Assista à demonstração do sistema</p>
          </div>
        </div>
        
        {/* CALL TO ACTION - BOTÕES PARA CLIENTE E DONO */}
        <div className="landing-cta">
          {/* BOTÃO PRINCIPAL PARA DONO */}
          <button 
            onClick={() => navigate('/cadastro-dono')}
            className="btn-landing btn-primary"
          >
            🍽️ INSTALE AGORA E CONCORRA A R$ 1.000,00
          </button>
          
          {/* BOTÃO PARA CLIENTE */}
          <button 
            onClick={() => navigate('/cadastro')}
            className="btn-landing btn-secondary"
            style={{
              backgroundColor: 'transparent',
              color: '#FF6B35',
              border: '2px solid #FF6B35',
              marginTop: '15px'
            }}
          >
            👤 SOU CLIENTE - CADASTRE-SE GRATUITAMENTE
          </button>
          
          {/* BOTÃO DE VOLTAR */}
          <button 
            onClick={() => navigate('/')}
            className="btn-landing btn-tertiary"
            style={{
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              marginTop: '15px',
              fontSize: '0.9rem'
            }}
          >
            ← Voltar para Home Simples
          </button>
        </div>
      </div>

      {/* OFERTA ESPECIAL */}
      <div className="offer-section">
        <div className="offer-badge">🔥 PROMOÇÃO DE LANÇAMENTO</div>
        <h2>✨ 30 DIAS GRÁTIS PARA O SEU DELIVERY</h2>
        <p className="offer-description">
          Cadastre seu restaurante agora e ganhe 30 dias gratuitos + chance de ganhar R$ 1.000,00 em dinheiro!
        </p>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>App para Clientes</h3>
            <p>Indique um amigo restaurante e concorra a R$ 1.000,00</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Painel Restaurante</h3>
            <p>Cadastre produtos, administre pedidos, chame seu entregador</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Segurança do MercadoPago</h3>
            <p>Pagamento direto no app com PIX ou cartão</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Rota para Entregador</h3>
            <p>Link do mapa restaurante/cliente pronto para WhatsApp</p>
            <small>*Durante a promoção: use seu próprio entregador</small>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Relatórios Completos</h3>
            <p>Dashboard com métricas de vendas e faturamento</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>App no Celular</h3>
            <p>Instale direto na tela inicial do celular</p>
          </div>
        </div>
      </div>

      {/* BENEFÍCIOS PARA RESTAURANTES */}
      <div className="for-restaurants">
        <h2>🏪 VANTAGENS PARA SEU RESTAURANTE</h2>
        <div className="restaurant-benefits">
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>30 dias de cardápio gratuito + marketing por nossa conta</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Painel administrativo completo e intuitivo</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Gerenciamento de cardápio em tempo real</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Controle de pedidos e status automaticamente</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Rota pronta para seu entregador via WhatsApp</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Relatórios de vendas e faturamento mensal detalhado</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Suporte técnico direto pelo WhatsApp</span>
            </div>
          </div>
          
          <div className="cta-container">
            <button 
              onClick={() => navigate('/cadastro-dono')}
              className="btn-landing btn-cta"
            >
              🚀 QUERO ME CADASTRAR GRATUITAMENTE
            </button>
            <p className="cta-note">Aproveite a promoção de lançamento!</p>
          </div>
        </div>
      </div>

      {/* FOOTER COM LOGO */}
      <div className="landing-footer">
        <div className="footer-logo-container">
          <img 
            src={laricaLogo} 
            alt="LARICA Food Delivery" 
            className="footer-logo"
          />
          <p className="footer-tagline">Sua fome, nossa entrega</p>
        </div>
        
        <div className="footer-info">
          <p>© 2024 LARICA Food Delivery - Todos os direitos reservados</p>
          <p>📱 App disponível para iOS e Android</p>
          <p>📧 Contato: contato@larica.com | 📞 (84) 99999-9999</p>
          <p>📍 Natal - RN, Brasil</p>
        </div>
        
        <div className="footer-actions">
          <button onClick={() => navigate('/cadastro')} className="footer-btn">
            👤 Sou Cliente - Cadastrar
          </button>
          <button onClick={() => navigate('/cadastro-dono')} className="footer-btn">
            🍽️ Sou Restaurante - Cadastrar
          </button>
          <button onClick={() => navigate('/')} className="footer-btn">
            🏠 Página Inicial
          </button>
        </div>
        
        <div className="footer-legal">
          <p>Termos de Uso | Política de Privacidade</p>
          <p className="disclaimer">
            *Promoção válida durante o período de lançamento. Consulte regulamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;