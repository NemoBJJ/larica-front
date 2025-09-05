// src/components/InstallPWAButton.tsx
import React, { useMemo, useState } from 'react';
import usePWAInstall from '../hooks/usePWAInstall';

const InstallPWAButton: React.FC = () => {
  const { canInstall, install, installed } = usePWAInstall();
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  // ——— helpers de plataforma ———
  const isStandalone = typeof window !== 'undefined'
    && (window.matchMedia?.('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  // Safari “puro” no iOS (não Chrome/Edge em cima do WebKit)
  const isSafari = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    const isMobileSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua);
    return isMobileSafari;
  }, []);

  // já instalado? não mostra nada
  if (installed || isStandalone) return null;

  // ANDROID/CHROME (tem prompt): botão instalar
  if (canInstall) {
    return (
      <button
        onClick={install}
        title="Instalar aplicativo"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 22px',
          borderRadius: 14,
          border: '2px solid #ff8c00',
          background: 'linear-gradient(135deg, #ff8c00, #ff6a00)',
          color: '#000',
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: '.4px',
          cursor: 'pointer',
          boxShadow: '0 16px 34px rgba(255,140,0,.35)'
        }}
      >
        📲 Instalar App
      </button>
    );
  }

  // iOS/Safari: sem prompt — mostra botão que abre instruções
  if (isIOS && isSafari) {
    return (
      <>
        <button
          onClick={() => setShowIOSHelp(true)}
          title="Como instalar no iPhone"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 18px',
            borderRadius: 12,
            border: '1px solid #ff8c00',
            background: 'transparent',
            color: '#ff8c00',
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: '.3px',
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(255,140,0,.18)'
          }}
        >
          📲 Instalar no iPhone
        </button>

        {showIOSHelp && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.55)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 9999
            }}
            onClick={() => setShowIOSHelp(false)}
          >
            <div
              style={{
                width: 'min(520px, 92vw)',
                background: '#0f0f0f',
                border: '1px solid #ff8c00',
                borderRadius: 14,
                boxShadow: '0 22px 44px rgba(0,0,0,.6)',
                color: '#f5f5f5',
                padding: 18
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0, color: '#ff8c00', fontWeight: 900 }}>Instalar no iPhone</h3>
                <button
                  onClick={() => setShowIOSHelp(false)}
                  aria-label="Fechar"
                  style={{
                    background: 'transparent',
                    color: '#ff8c00',
                    border: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              <ol style={{ margin: '8px 0 0 18px', lineHeight: 1.55 }}>
                <li>Toque no botão <strong>Compartilhar</strong> do Safari (ícone de seta para cima).</li>
                <li>Role a lista e escolha <strong>“Adicionar à Tela de Início”</strong>.</li>
                <li>Confirme o nome e toque em <strong>Adicionar</strong>.</li>
              </ol>

              <p style={{ marginTop: 14, color: '#cfcfcf' }}>
                Depois disso o Larica aparece como um app na sua tela inicial, com abertura em tela cheia e funcionamento offline básico.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setShowIOSHelp(false)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #ff8c00',
                    background: 'transparent',
                    color: '#ff8c00',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // outras plataformas sem prompt: não exibe nada
  return null;
};

export default InstallPWAButton;
