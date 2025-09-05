import React from 'react';
import usePWAInstall from '../hooks/usePWAInstall';

const InstallPWAButton: React.FC = () => {
  const { canInstall, install, installed } = usePWAInstall();

  // iOS não expõe prompt. Se quiser, aqui você pode abrir um modal com instruções.
  if (installed) return null;
  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        background: '#0ea5e9',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer'
      }}
      title="Instalar aplicativo"
    >
      📲 Instalar App
    </button>
  );
};

export default InstallPWAButton;
