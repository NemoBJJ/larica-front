import React, { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  Navigate
} from 'react-router-dom';

import api from '../services/api';

import HomePage from './HomePage';
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

/* =========================
   Helpers
========================= */

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

/* =========================
   Wrappers
========================= */

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

  if (!user?.id) return <Navigate to="/login" replace />;

  const id = Number(restauranteId);

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
  if (!user?.id) return <Navigate to="/login" replace />;
  return <HistoricoUsuario usuarioId={user.id} onVoltar={() => window.history.back()} />;
};

/* =========================
   App
========================= */

const App: React.FC = () => {
  const isStandalone = useIsStandalone();
  const user = getUser();

  const WebNavbar = useMemo(
    () => (
      <nav className="navbar">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/login" className="nav-link">🔓 Login Cliente</Link>
        <Link to="/login-dono" className="nav-link">🍽️ Login Restaurante</Link>
        <Link to="/cadastro" className="nav-link">👤 Cadastro Cliente</Link>
        <Link to="/cadastro-dono" className="nav-link">🏪 Cadastro Dono</Link>
        <Link to="/historico-geral" className="nav-link">≡ Histórico Geral</Link>
        <Link to="/debug-usuario" className="nav-link">🔍 Debug</Link>
        <InstallPWAButton />
      </nav>
    ),
    []
  );

  const PwaNavbar = useMemo(() => {
    if (!user) return null;
    if (user.tipo === 'CLIENTE') {
      return (
        <nav className="navbar">
          <Link to="/historico-usuario" className="nav-link">📋 Meu Histórico</Link>
        </nav>
      );
    }
    return null;
  }, [user]);

  return (
    <Router>
      {isStandalone ? PwaNavbar : WebNavbar}

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Cliente */}
        <Route path="/login" element={<UsuarioLogin />} />
        <Route path="/cadastro" element={<CadastroUsuario onVoltar={() => {}} />} />
        <Route path="/dashboard" element={<ListaRestaurantes />} />
        <Route path="/cardapio/:restauranteId" element={<CardapioWrapper />} />
        <Route path="/historico-usuario" element={<HistoricoUsuarioWrapper />} />

        {/* Dono */}
        <Route path="/login-dono" element={<DonoLogin />} />
        <Route path="/cadastro-dono" element={<CadastroDono />} />
        <Route path="/painel-restaurante" element={<PainelWrapper />} />

        {/* Manager */}
        <Route path="/historico-geral" element={<HistoricoGeral />} />

        {/* Debug */}
        <Route path="/debug-usuario" element={<VerificarUsuario />} />

        {/* Entregador */}
        <Route path="/entregador/pedido/:pedidoId" element={<TelaEntregador />} />
      </Routes>
    </Router>
  );
};

export default App;
