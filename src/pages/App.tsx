// src/pages/App.tsx - COM IMPORTS CORRETOS
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

// 🔥 ADICIONE ESTE IMPORT
import api from '../services/api';

import HomePage from '../pages/HomePage';
import ListaRestaurantes from '../components/ListaRestaurantes';
import CadastroUsuario from '../components/CadastroUsuario';
import PainelRestaurante from '../components/PainelRestaurante';
import DonoLogin from '../components/DonoLogin';
import CadastroDono from '../components/CadastroDono';
import CardapioRestaurante from '../components/CardapioRestaurante';
import UsuarioLogin from '../components/UsuarioLogin';
import HistoricoUsuario from '../components/HistoricoUsuario';
import HistoricoGeral from '../components/HistoricoGeral';
import VerificarUsuario from '../components/VerificarUsuario';
import TelaEntregador from '../components/TelaEntregador';
import InstallPWAButton from '../components/InstallPWAButton';

import './App.css';

// ... resto do código (igual ao que já temos)

/** Detecta se está rodando em modo PWA (standalone) */
const getStandalone = () =>
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  // iOS Safari
  (window as any).navigator?.standalone === true;

const useIsStandalone = () => {
  const [standalone, setStandalone] = useState<boolean>(getStandalone());

  useEffect(() => {
    const mql = window.matchMedia('(display-mode: standalone)');
    const handler = () => setStandalone(getStandalone());
    if (mql && 'addEventListener' in mql) {
      mql.addEventListener('change', handler);
    } else if (mql && 'addListener' in mql) {
      // fallback antigo
      // @ts-ignore
      mql.addListener(handler);
    }
    window.addEventListener('appinstalled', handler);
    window.addEventListener('visibilitychange', handler);
    return () => {
      if (mql && 'removeEventListener' in mql) {
        mql.removeEventListener('change', handler);
      } else if (mql && 'removeListener' in mql) {
        // @ts-ignore
        mql.removeListener(handler);
      }
      window.removeEventListener('appinstalled', handler);
      window.removeEventListener('visibilitychange', handler);
    };
  }, []);

  return standalone;
};

/** Considera "cliente logado" se existir user no localStorage */
const useClienteLogado = () => {
  const [logged, setLogged] = useState<boolean>(() => !!localStorage.getItem('user'));
  useEffect(() => {
    const onStorage = () => setLogged(!!localStorage.getItem('user'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return logged;
};

const PainelWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId);
  return <PainelRestaurante restauranteId={id} onVoltar={() => window.history.back()} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const [nomeRestaurante, setNomeRestaurante] = useState('');

  useEffect(() => {
    if (restauranteId) {
      // Buscar nome do restaurante para mostrar
      api.get(`/restaurantes/${restauranteId}`)
        .then(res => setNomeRestaurante(res.data.nome))
        .catch(() => setNomeRestaurante(`Restaurante #${restauranteId}`));
    }
  }, [restauranteId]);

  const userData = localStorage.getItem('user');

  if (!userData) {
    console.error('🚨 ERRO: Nenhum usuário logado!');
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Acesso não autorizado</h2>
        <p>Você precisa fazer login para acessar o cardápio.</p>
        <button
          onClick={() => (window.location.href = '/login')}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  try {
    const user = JSON.parse(userData);
    const usuarioId = user?.id;

    if (!usuarioId) {
      throw new Error('ID do usuário não encontrado');
    }

    const id = Number(restauranteId ?? 1);
    return (
      <CardapioRestaurante
        restauranteId={id}
        nomeRestaurante={nomeRestaurante || `Restaurante #${id}`}
        onVoltar={() => window.history.back()}
        usuarioId={usuarioId}
      />
    );
  } catch (error) {
    console.error('❌ Erro ao processar dados do usuário:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Erro nos dados do usuário</h2>
        <p>Os dados de login estão corrompidos. Faça login novamente.</p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Fazer Login Novamente
        </button>
      </div>
    );
  }
};

const HistoricoUsuarioWrapper: React.FC = () => {
  const userData = localStorage.getItem('user');

  if (!userData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Acesso não autorizado</h2>
        <p>Você precisa fazer login para ver o histórico.</p>
        <button
          onClick={() => (window.location.href = '/login')}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  try {
    const user = JSON.parse(userData);
    const usuarioId = user?.id;

    if (!usuarioId) {
      throw new Error('ID do usuário não encontrado');
    }

    return <HistoricoUsuario usuarioId={usuarioId} onVoltar={() => window.history.back()} />;
  } catch (error) {
    console.error('Erro ao processar dados do usuário:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Erro nos dados do usuário</h2>
        <p>Os dados de login estão corrompidos. Faça login novamente.</p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Fazer Login Novamente
        </button>
      </div>
    );
  }
};

const HistoricoGeralWrapper: React.FC = () => <HistoricoGeral />;

const App: React.FC = () => {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const handleVoltar = () => setMostrarCadastro(false);

  const isStandalone = useIsStandalone();
  const clienteLogado = useClienteLogado();

  // navbar para WEB (não-standalone)
  const WebNavbar = useMemo(
    () => (
      <nav className="navbar">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/cadastro" className="nav-link">👤 Cadastro Cliente</Link>
        <Link to="/cadastro-dono" className="nav-link">🏪 Cadastro Dono</Link>
        {/* ❌ REMOVIDO: Link para painel fixo ID 4 */}
        <Link to="/login-dono" className="nav-link">🔐 Login Dono</Link>
        <Link to="/login" className="nav-link">🔓 Login Cliente</Link>
        <Link to="/historico-usuario" className="nav-link">📋 Meu Histórico</Link>
        <Link to="/historico-geral" className="nav-link">≡ Histórico Geral</Link>
        <Link to="/debug-usuario" className="nav-link">🔍 Debug</Link>
        {/* botão instalar só na web */}
        <InstallPWAButton />
      </nav>
    ),
    []
  );

  // navbar para PWA (standalone)
  const PwaNavbar = useMemo(() => {
    if (!clienteLogado) return null; // PWA sem login → sem navbar
    return (
      <nav className="navbar">
        <Link to="/historico-usuario" className="nav-link">📋 Meu Histórico</Link>
      </nav>
    );
  }, [clienteLogado]);

  return (
    <Router>
      {/* Navbar condicional */}
      {isStandalone ? PwaNavbar : WebNavbar}

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Cliente */}
        <Route path="/login" element={<UsuarioLogin />} />
        <Route path="/cadastro" element={<CadastroUsuario onVoltar={handleVoltar} />} />
        <Route path="/dashboard" element={<ListaRestaurantes />} />
        <Route path="/cardapio/:restauranteId" element={<CardapioWrapper />} />
        <Route path="/historico-usuario" element={<HistoricoUsuarioWrapper />} />

        {/* Dono */}
        <Route path="/login-dono" element={<DonoLogin />} />
        <Route path="/cadastro-dono" element={<CadastroDono />} />
        {/* ❌ REMOVIDO: Rota com ID fixo 4 */}
        {/* ✅ Mantido apenas: Rota dinâmica */}
        <Route path="/painel-restaurante/:restauranteId" element={<PainelWrapper />} />

        {/* Lista geral */}
        <Route path="/restaurantes" element={<ListaRestaurantes />} />

        {/* Manager */}
        <Route path="/historico-geral" element={<HistoricoGeralWrapper />} />

        {/* Debug */}
        <Route path="/debug-usuario" element={<VerificarUsuario />} />

        {/* ✅ Rota do entregador */}
        <Route path="/entregador/pedido/:pedidoId" element={<TelaEntregador />} />
      </Routes>
    </Router>
  );
};

export default App;