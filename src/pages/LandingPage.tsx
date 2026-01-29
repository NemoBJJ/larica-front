// src/pages/LandingPage.tsx - VERSÃO LIMPA COM WHATSAPP
import React from 'react';
import './LandingPage.css';
import laricaLogo from '../assets/larica-logo.png';
import nemodevLogo from '../assets/logonemindev.png';

const LandingPage: React.FC = () => {
  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const phone = '91987446061'; // Número sem espaços e parênteses
    const message = 'Olá! Quero participar da promoção do Larica Food! Como faço para indicar meus amigos?';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <div className="landing-hero">
        {/* LOGO PRINCIPAL MAIOR */}
        <div className="landing-logo-container" style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img 
            src={laricaLogo} 
            alt="LARICA Food Delivery" 
            style={{
              height: '120px',
              width: 'auto',
              maxWidth: '100%'
            }}
          />
        </div>
        
        <h1 className="landing-title">🍔 LARICA FOOD</h1>
        <p className="landing-subtitle">Bateu comeu</p>
        
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
          </div>
        </div>
        
        {/* BOTÃO PRINCIPAL */}
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
            🚀 INSTALE/CADASTRE AGORA 
          </button>
          
          <p className="cta-note" style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#FF6B35',
            fontSize: '1.1rem'
          }}>
            📱 celular • 💻 WEB
          </p>
        </div>
      </div>

      {/* OFERTA ESPECIAL */}
      <div className="offer-section">
        <div className="offer-badge">🔥 PROMOÇÃO DE LANÇAMENTO</div>
        <h2>✨ 30 DIAS GRÁTIS PARA O SEU DELIVERY</h2>
        <p className="offer-description">
          Concorra a R$ 1.000,00 em dinheiro e após a promoção APENAS 3% POR PEDIDO.
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
            <p>Gerencie seus pedidos, Rota pronta para o seu entregador</p>
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
            <p>Todas as Funcionalidades, em apenas 01 toque</p>
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
              <span>Concorra a R$ 1.000,00 apenas ao se cadastrar</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✅</span>
              <span>Apenas 3% por pedido após os 30 dias grátis</span>
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
            <p className="cta-note">Aproveite 30 dias grátis, depois apenas 3% por pedido!</p>
          </div>
        </div>
      </div>

      {/* BOTÃO DO WHATSAPP - NOVO! */}
      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        margin: '50px auto 0 auto',
        borderRadius: '15px',
        maxWidth: '800px',
        width: '90%',
        border: '2px dashed #25D366'
      }}>
        <h3 style={{ 
          color: '#25D366', 
          marginBottom: '15px',
          fontSize: '1.8rem'
        }}>
          💬 INDICAR AMIGOS E GANHAR R$ 1.000,00
        </h3>
        <p style={{ 
          color: '#666', 
          marginBottom: '25px',
          fontSize: '1.2rem'
        }}>
          <strong>Como participar:</strong> Indique 3 amigos pelo WhatsApp do Larica e concorra!
        </p>
        
        <button 
          onClick={openWhatsApp}
          style={{
            background: '#25D366',
            color: 'white',
            border: 'none',
            padding: '20px 45px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#128C7E';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#25D366';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📱</span>
          FALAR NO WHATSAPP (91) 98744-6061
        </button>
        
        <p style={{ 
          marginTop: '20px', 
          color: '#666',
          fontSize: '1rem'
        }}>
          Clique acima para conversar diretamente com nosso suporte!
        </p>
      </div>

      {/* FOOTER */}
      <div className="landing-footer">
        <div className="footer-logo-container">
          <img 
            src={laricaLogo} 
            alt="LARICA Food Delivery" 
            className="footer-logo"
          />
          <p className="footer-tagline">A Larica é sua, O Rango é nosso</p>
          
          {/* LOGO DA NEMO SYSTEMS - MAIOR! */}
          <div style={{ 
            marginTop: '40px', 
            paddingTop: '25px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            width: '100%'
          }}>
            <img 
              src={nemodevLogo} 
              alt="Nemo Systems - Desenvolvimento de Software" 
              style={{ 
                height: '70px',
                width: 'auto',
                filter: 'brightness(1.1)',
                opacity: '0.9',
                marginBottom: '8px'
              }}
            />
            <p style={{ 
              fontSize: '1rem', 
              color: '#aaa', 
              marginTop: '0',
              fontWeight: 'bold'
            }}>
              NEMO SYSTEMS LTDA
            </p>
          </div>
        </div>
        
        <div className="footer-info">
          <p>© 2026 LARICA Food Delivery - Todos os direitos reservados a NEMO SYSTEMS LTDA</p>
          <p>📱 App disponível para iOS e Android</p>
          <p>📧 Contato: engnfaraujo@gmail.com | 📞 (91) 998744-6061</p>
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
            *Promoção válida durante o período de lançamento. 
            Sorteio em 01/03/2024. Clientes devem indicar 3 amigos pelo WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;