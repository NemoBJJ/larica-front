import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import laricaLogo from '../assets/larica-logo.png';

// Declaração do tipo para beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verifica se o app já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Detecta iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Event listener para instalação PWA
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LARICA Food Delivery',
        text: 'Baixe o app LARICA para pedir comida de forma rápida e fácil!',
        url: window.location.href,
      });
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado! Compartilhe com seus amigos!');
    }
  };

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
          <h1 className="home-title">🍔 LARICA Food Delivery</h1>
          <p className="home-subtitle">Seu delivery favorito a um clique de distância</p>
          
          {/* Badge de App */}
          <div className="app-badge">
            📱 <strong>APP NATIVO EXPERIENCE</strong>
          </div>
        </div>

        <div className="home-buttons">
          {/* ... seus botões existentes ... */}

          {/* BOTÃO DE INSTALAR APP */}
          {showInstallButton && !isStandalone && (
            <button 
              onClick={handleInstallClick}
              className="home-btn home-btn-install"
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white',
                animation: 'pulse 2s infinite',
                marginTop: '10px'
              }}
            >
              ⬇️ INSTALAR APP NO CELULAR
            </button>
          )}

          {/* INSTRUÇÕES PARA iOS */}
          {isIOS && !isStandalone && (
            <div className="ios-instructions">
              <p style={{ color: '#ff8c00', fontSize: '0.9rem', margin: '10px 0' }}>
                📱 Para instalar no iPhone/iPad:
              </p>
              <ol style={{ 
                textAlign: 'left', 
                fontSize: '0.8rem', 
                color: '#ccc',
                paddingLeft: '20px',
                margin: '10px 20px'
              }}>
                <li>Clique no botão "Compartilhar"</li>
                <li>Role para baixo e selecione "Adicionar à Tela de Início"</li>
                <li>Clique em "Adicionar" no canto superior direito</li>
              </ol>
            </div>
          )}

          {/* BOTÃO DE COMPARTILHAR */}
          <button 
            onClick={handleShareClick}
            className="home-btn home-btn-secondary"
            style={{ marginTop: '10px' }}
          >
            📤 Compartilhar App com Amigos
          </button>

          {/* DIVISOR */}
          <div className="home-divider"></div>

          {/* ... resto dos botões ... */}
        </div>

        {/* RODAPÉ COM ÍCONES DE APP STORE */}
        <div className="home-footer">
          {/* ... conteúdo existente do footer ... */}
          
          {/* LINKS PARA APP STORES */}
          <div className="app-store-links">
            <p style={{ color: '#ccc', marginBottom: '15px' }}>Disponível também em:</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                className="store-btn"
                style={{
                  background: '#000',
                  border: '1px solid #333',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => window.open('https://apps.apple.com', '_blank')}
              >
                <span style={{ fontSize: '24px' }}>🍎</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.7rem' }}>Download on the</div>
                  <div style={{ fontWeight: 'bold' }}>App Store</div>
                </div>
              </button>
              
              <button 
                className="store-btn"
                style={{
                  background: '#000',
                  border: '1px solid #333',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => window.open('https://play.google.com', '_blank')}
              >
                <span style={{ fontSize: '24px' }}>🤖</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.7rem' }}>GET IT ON</div>
                  <div style={{ fontWeight: 'bold' }}>Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;