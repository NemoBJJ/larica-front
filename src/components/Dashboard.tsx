import React, { useState } from 'react';
import ListaRestaurantes from './ListaRestaurantes';
import HistoricoUsuario from './HistoricoUsuario';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'restaurantes' | 'historico'>('restaurantes');

  // ✅ Pegar usuarioId do localStorage CORRETAMENTE
  const userData = localStorage.getItem('user');
  let usuarioId: number | null = null;
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      usuarioId = user?.id || null;
    } catch (error) {
      console.error('Erro ao parsear user data:', error);
    }
  }

  if (!usuarioId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Acesso não autorizado</h2>
        <p>Você precisa fazer login para acessar o dashboard.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* ✅✅✅ ABAS DE NAVEGAÇÃO - AGORA VAI APARECER! */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${abaAtiva === 'restaurantes' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('restaurantes')}
        >
          🏪 Restaurantes
        </button>
        <button 
          className={`tab-button ${abaAtiva === 'historico' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('historico')}
        >
          📜 Meu Histórico
        </button>
      </div>

      {/* ✅✅✅ CONTEÚDO DAS ABAS */}
      <div className="dashboard-content">
        {abaAtiva === 'restaurantes' ? (
          <ListaRestaurantes />
        ) : (
          <HistoricoUsuario 
            usuarioId={usuarioId} 
            onVoltar={() => setAbaAtiva('restaurantes')}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;