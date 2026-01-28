// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import laricaLogo from '../assets/larica-logo.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verifica se já tá instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Detecta iOS
    const isIOSDevice = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(isIOSDevice);

    // Captura evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt && installPrompt.prompt) {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou instalar');
        setIsInstallable(false);
      }
      setInstallPrompt(null);
    }
  };

  const showInstallButton = isInstallable && !isStandalone;

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

        {/* BOTÃO DE INSTALAR - SÓ APARECE QUANDO POSSÍVEL */}
        {showInstallButton && (
          <button
            className="btn install-btn"
            onClick={handleInstallClick}
          >
            📲 INSTALAR APP
          </button>
        )}

        {/* iOS precisa de instrução diferente */}
        {isIOS && !isStandalone && !isInstallable && (
          <div className="ios-instructions">
            <p style={{ color: '#FF6B35', fontSize: '0.9rem', marginTop: '10px', textAlign: 'center' }}>
              📱 Para instalar: toque em <strong>Compartilhar</strong> → <strong>"Adicionar à Tela de Início"</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;