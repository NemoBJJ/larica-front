// src/pages/App.tsx - VERSÃO FINAL
import React, { useEffect, useMemo, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link, 
  useParams, 
  Navigate,
  useLocation 
} from 'react-router-dom';
import api from '../services/api';
import HomePage from './HomePage';
import LandingPage from './LandingPage';
import ListaRestaurantes from '../components/ListaRestaurantes';
import CadastroUsuario from '../components/CadastroUsuario';
import CadastroDono from '../components/CadastroDono';
import UsuarioLogin from '../components/UsuarioLogin';
import DonoLogin from '../components/DonoLogin';
import PainelRestaurante from '../components/PainelRestaurante';
import CardapioRestaurante from '../components/CardapioRestaurante';
import HistoricoUsuario from '../components/HistoricoUsuario';
import HistoricoGeral from '../components/HistoricoGeral';
import VerificarUsuario from '../components/VerificarUsuario';
import TelaEntregador from '../components/TelaEntregador';
import InstallPWAButton from '../components/InstallPWAButton';
import './App.css';

/* ========================= Helpers ========================= */
const useIsStandalone = () => {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    const check = () => {
      setStandalone(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    };
    check();
    window.addEventListener('appinstalled', check);
    return () => window.removeEventListener('appinstalled', check);
  }, []);
  return standalone;
};

const getUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/* ========================= Wrappers ========================= */
const PainelWrapper: React.FC = () => {
  const user = getUser();
  
  console.log('🔄 PainelWrapper - Verificando usuário:', user);
  
  if (!user || user.tipo !== 'DONO' || !user.restauranteId) {
    console.log('🚫 Usuário não autorizado ou sem restauranteId, redirecionando para login-dono');
    return <Navigate to="/login-dono" replace />;
  }
  
  return <PainelRestaurante restauranteId={user.restauranteId} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const user = getUser();
  
  console.log('📋 CardapioWrapper - User:', user, 'RestauranteId:', restauranteId);
  
  if (!user?.id) {
    console.log('🔒 Usuário não logado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  const id = Number(restauranteId);
  if (isNaN(id)) {
    console.log('❌ ID do restaurante inválido:', restauranteId);
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <CardapioRestaurante
      restauranteId={id}
      usuarioId={user.id}
      nomeRestaurante={`Restaurante #${id}`}
      onVoltar={() => window.history.back()}
    />
  );
};

const HistoricoUsuarioWrapper: React.FC = () => {
  const user = getUser();
  
  console.log('📜 HistoricoUsuarioWrapper - User:', user);
  
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  
  return <HistoricoUsuario usuarioId={user.id} onVoltar={() => window.history.back()} />;
};

/* ========================= App Content ========================= */
const AppContent: React.FC = () => {
  const isStandalone = useIsStandalone();
  const user = getUser();
  const location = useLocation();
  
  // ✅ DETECTA SE ESTÁ NA LANDING PAGE
  const isLandingPage = location.pathname === '/landing';
  
  // ✅ VERIFICA SE É O DESENVOLVEDOR (Nemin)
  const isDeveloper = user && user.email === 'nemo@neemindev.com'; // ALTERE PARA SEU EMAIL
  
  console.log('📍 Path:', location.pathname, 'Landing?', isLandingPage, 'Dev?', isDeveloper);

  const PwaNavbar = useMemo(() => {
    if (!user) return null;
    
    if (user.tipo === 'CLIENTE') {
      return (
        <nav className="navbar">
          <Link to="/dashboard" className="nav-link">📍 Restaurantes</Link>
          <Link to="/historico-usuario" className="nav-link">📋 Meu Histórico</Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="nav-link"
            style={{ color: '#dc3545', marginLeft: 'auto' }}
          >
            🚪 Sair
          </button>
        </nav>
      );
    }
    
    if (user.tipo === 'DONO') {
      return (
        <nav className="navbar">
          <Link to="/painel-restaurante" className="nav-link">🏪 Meu Painel</Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="nav-link"
            style={{ color: '#dc3545', marginLeft: 'auto' }}
          >
            🚪 Sair
          </button>
        </nav>
      );
    }
    
    return null;
  }, [user]);

  const WebNavbar = useMemo(() => {
    // ✅ NA LANDING: MOSTRA MENU APENAS PARA O DESENVOLVEDOR
    if (isLandingPage && !isDeveloper) {
      return null;
    }
    
    return (
      <nav className="navbar">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/landing" className="nav-link">🎬 Landing Page</Link>
        <Link to="/login" className="nav-link">🔓 Login Cliente</Link>
        <Link to="/login-dono" className="nav-link">🍽️ Login Restaurante</Link>
        <Link to="/cadastro" className="nav-link">👤 Cadastro Cliente</Link>
        <Link to="/cadastro-dono" className="nav-link">🏪 Cadastro Dono</Link>
        <Link to="/dashboard" className="nav-link">📍 Ver Restaurantes</Link>
        <Link to="/historico-geral" className="nav-link">📊 Histórico Geral</Link>
        <Link to="/debug-usuario" className="nav-link">🔍 Debug</Link>
        <InstallPWAButton />
        
        {user && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              👋 {user.nome || user.email}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              style={{
                padding: '5px 10px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Sair
            </button>
          </div>
        )}
      </nav>
    );
  }, [user, isLandingPage, isDeveloper]);

  return (
    <>
      {isStandalone ? PwaNavbar : WebNavbar}
      
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<HomePage />} />
        
        {/* Landing Page com Vídeo - SEM MENU PARA VISITANTES */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Cliente */}
        <Route path="/login" element={<UsuarioLogin />} />
        <Route path="/cadastro" element={<CadastroUsuario onVoltar={() => window.history.back()} />} />
        <Route path="/dashboard" element={<ListaRestaurantes />} />
        <Route path="/cardapio/:restauranteId" element={<CardapioWrapper />} />
        <Route path="/historico-usuario" element={<HistoricoUsuarioWrapper />} />
        
        {/* Dono/Restaurante */}
        <Route path="/login-dono" element={<DonoLogin />} />
        <Route path="/cadastro-dono" element={<CadastroDono />} />
        <Route path="/painel-restaurante" element={<PainelWrapper />} />
        
        {/* Manager/Admin */}
        <Route path="/historico-geral" element={<HistoricoGeral />} />
        
        {/* Debug */}
        <Route path="/debug-usuario" element={<VerificarUsuario />} />
        
        {/* Entregador */}
        <Route path="/entregador/pedido/:pedidoId" element={<TelaEntregador />} />
        
        {/* Fallback para rotas inválidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

/* ========================= App Principal ========================= */
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;