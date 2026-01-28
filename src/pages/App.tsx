// src/pages/App.tsx - VERSÃO DEFINITIVA
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

// ✅ FUNÇÃO PARA VERIFICAR SE É O DESENVOLVEDOR (VOCÊ - Nemin)
const isDeveloperUser = (user: any): boolean => {
  if (!user || !user.email) return false;
  
  // 🔥 SEUS EMAILS CADASTRADOS
  const developerEmails = [
    'engnfaraujo@gmail.com',     // Seu email principal
    'jiunemojitsu@gmail.com',    // Seu segundo email
    'nemo@neemindev.com',        // Email do domínio
    'admin@larica.com'           // Email admin
  ];
  
  // ✅ VERIFICA SE O EMAIL DO USUÁRIO É UM DOS SEUS
  const isDev = developerEmails.includes(user.email.toLowerCase());
  
  // 🔐 VERIFICAÇÃO EXTRA DE SENHA (PARA MAIOR SEGURANÇA)
  if (isDev && user.senha) {
    // Senha: "eujamereergui"
    const senhaCorreta = user.senha === 'eujamereergui';
    console.log('🔐 Verificação dev:', user.email, 'Senha correta?', senhaCorreta);
    return senhaCorreta;
  }
  
  return isDev;
};

/* ========================= Wrappers ========================= */
const PainelWrapper: React.FC = () => {
  const user = getUser();
  
  if (!user || user.tipo !== 'DONO' || !user.restauranteId) {
    return <Navigate to="/login-dono" replace />;
  }
  
  return <PainelRestaurante restauranteId={user.restauranteId} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const user = getUser();
  
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  
  const id = Number(restauranteId);
  if (isNaN(id)) {
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
  
  // ✅ VERIFICA SE É O DESENVOLVEDOR (VOCÊ)
  const isDeveloper = isDeveloperUser(user);
  
  console.log('🔐 DEBUG - Usuário:', user?.email, 'É dev?', isDeveloper, 'Path:', location.pathname);

  // ✅ NAVBAR PARA PWA (APENAS PARA USUÁRIOS LOGADOS COMUNS)
  const PwaNavbar = useMemo(() => {
    if (!user) return null;
    
    // ❌ NÃO MOSTRA MENU PWA PARA O DESENVOLVEDOR (pra não duplicar)
    if (isDeveloper) return null;
    
    if (user.tipo === 'CLIENTE') {
      return (
        <nav className="navbar" style={{ background: '#333', padding: '8px 15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/dashboard" className="nav-link">📍 Restaurantes</Link>
            <Link to="/historico-usuario" className="nav-link">📋 Histórico</Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                marginLeft: 'auto',
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
        </nav>
      );
    }
    
    if (user.tipo === 'DONO') {
      return (
        <nav className="navbar" style={{ background: '#333', padding: '8px 15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/painel-restaurante" className="nav-link">🏪 Meu Painel</Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                marginLeft: 'auto',
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
        </nav>
      );
    }
    
    return null;
  }, [user, isDeveloper]);

  // ✅ NAVBAR PARA WEB (APENAS PARA O DESENVOLVEDOR - VOCÊ)
  const WebNavbar = useMemo(() => {
    // ❌ SE NÃO FOR O DESENVOLVEDOR → SEM MENU COMPLETO
    if (!isDeveloper) {
      return null;
    }
    
    // ✅ SE FOR O DESENVOLVEDOR → MOSTRA MENU COMPLETO COM DESTAQUE
    return (
      <nav className="navbar" style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
        padding: '12px 20px',
        borderBottom: '3px solid #FF6B35',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <span style={{ 
            color: '#FF6B35', 
            fontWeight: 'bold',
            marginRight: '10px',
            fontSize: '14px'
          }}>
            🔧 DEV PANEL:
          </span>
          
          <Link to="/" className="nav-link" style={{ color: '#FFFFFF' }}>🏠 Home</Link>
          <Link to="/landing" className="nav-link" style={{ color: '#FFFFFF' }}>🎬 Landing</Link>
          <Link to="/login" className="nav-link" style={{ color: '#FFFFFF' }}>🔓 Login Cliente</Link>
          <Link to="/login-dono" className="nav-link" style={{ color: '#FFFFFF' }}>🍽️ Login Restaurante</Link>
          <Link to="/cadastro" className="nav-link" style={{ color: '#FFFFFF' }}>👤 Cadastro Cliente</Link>
          <Link to="/cadastro-dono" className="nav-link" style={{ color: '#FFFFFF' }}>🏪 Cadastro Dono</Link>
          <Link to="/dashboard" className="nav-link" style={{ color: '#FFFFFF' }}>📍 Restaurantes</Link>
          <Link to="/historico-geral" className="nav-link" style={{ color: '#FFFFFF' }}>📊 Histórico Geral</Link>
          <Link to="/debug-usuario" className="nav-link" style={{ color: '#FFFFFF' }}>🔍 Debug</Link>
          
          <InstallPWAButton />
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: '#FF6B35',
              fontWeight: 'bold',
              background: 'rgba(255, 107, 53, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              👑 DEV: {user?.nome || user?.email || 'Nemin'}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              style={{
                padding: '6px 15px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </nav>
    );
  }, [user, isDeveloper]);

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