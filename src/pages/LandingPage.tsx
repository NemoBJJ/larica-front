// src/pages/LandingPage.tsx - VERSÃO FINAL COM UM BOTÃO
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
        
        <h1 className="landing-title">🍔 LARICA FOOD</h1>
        <p className="landing-subtitle"> Bateu comeu</p>
        
        {/* VÍDEO DE DIVULGAÇÃO */}
        <div className="video-container">
          <div className="video-wrapper">
            <iframe 
              width="100%" 
              height="400"
              src="https://www.youtube.com/embed/SEU_VIDEO_AQUI" 
              title="Food Delivery" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <p className="video-caption"></p>
          </div>
        </div>
        
        {/* APENAS UM BOTÃO QUE LEVA PARA A HOME PAGE PRINCIPAL */}
        <div className="landing-cta">
          <button 
            onClick={() => window.location.href = 'https://larica.neemindev.com/'}
            className="btn-landing btn-primary"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)',
              color: '#000',
              border: 'none',
              padding: '22px 40px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              margin: '0 auto',
              maxWidth: '500px',
              width: '100%'
            }}
          >
            🚀 ACESSAR LARICA FOOD
          </button>
          
          <p className="cta-note" style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#FF6B35',
            fontSize: '1.1rem'
          }}>
            📱  celular: <br />
            💻  WEB
          </p>
        </div>
      </div>

      {/* OFERTA ESPECIAL */}
      <div className="offer-section">
        <div className="offer-badge">🔥 PROMOÇÃO DE LANÇAMENTO</div>
        <h2>✨ 30 DIAS GRÁTIS PARA O SEU DELIVERY</h2>
        <p className="offer-description">
          Cadastre-se AGORA, TENHA 30 dias gratuitos e Concorra a R$ 1.000,00 em dinheiro!
        </p>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>App para Clientes</h3>
            <p>Indique um amigo e concorra a R$ 1.000,00</p>
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
            <small>*Durante o Lançamento, Apenas Restaurantes com entregadores</small>
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
              <span>30 dias de cardápio gratuito + marketing por nossa conta, depois APENAS 3% POR PEDIDO</span>
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
              onClick={() => window.location.href = 'https://larica.neemindev.com/'}
              className="btn-landing btn-cta"
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)',
                color: '#000',
                border: 'none',
                padding: '20px 35px',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                margin: '0 auto',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              🚀 INSTALAR AGORA 
            </button>
            <p className="cta-note">Aproveite 30 dias grátis , Depois 3% por pedido!</p>
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
          <p className="footer-tagline">A Larica é sua, O Rango é nosso</p>
        </div>
        
        <div className="footer-info">
          <p>© 2024 LARICA Food Delivery - Todos os direitos reservados a NEMO SYSTEMS LTDA</p>
          <p>📱 App disponível para iOS e Android</p>
          <p>📧 Contato: contato@larica.com | 📞 (91) 998744-6061</p>
          <p>📍 Natal - RN, Brasil</p>
        </div>
        
        <div className="footer-actions">
          <button 
            onClick={() => window.location.href = 'https://larica.neemindev.com/'}
            className="footer-btn"
            style={{
              background: 'rgba(255, 107, 53, 0.1)',
              color: '#FF6B35',
              border: '2px solid #FF6B35',
              padding: '15px 25px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: 'bold'
            }}
          >
            🚀 INSTALAR AGORA !
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