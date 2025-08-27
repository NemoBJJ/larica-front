// src/pages/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

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
import VerificarUsuario from '../components/VerificarUsuario'; // ✅ IMPORT ADICIONADO

import './App.css';

const PainelWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId);
  return <PainelRestaurante restauranteId={id} onVoltar={() => window.history.back()} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  // ✅ CORREÇÃO: Adicionado usuarioId do localStorage
  const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1', 10);
  const id = Number(restauranteId ?? 1);
  return (
    <CardapioRestaurante
      restauranteId={id}
      nomeRestaurante={`Restaurante #${id}`}
      onVoltar={() => window.history.back()}
      usuarioId={usuarioId} // ✅ AGORA COM usuarioId
    />
  );
};

const HistoricoUsuarioWrapper: React.FC = () => {
  const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1', 10);
  return <HistoricoUsuario usuarioId={usuarioId} onVoltar={() => window.history.back()} />;
};

const HistoricoGeralWrapper: React.FC = () => {
  return <HistoricoGeral />;
};

const App: React.FC = () => {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const handleVoltar = () => setMostrarCadastro(false);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/cadastro" className="nav-link">👤 Cadastro Cliente</Link>
        <Link to="/cadastro-dono" className="nav-link">🏪 Cadastro Dono</Link>
        <Link to="/painel-restaurante" className="nav-link">🍽️ Painel Restaurante</Link>
        <Link to="/login-dono" className="nav-link">🔐 Login Dono</Link>
        <Link to="/login" className="nav-link">🔓 Login Cliente</Link>
        <Link to="/historico-geral" className="nav-link">≡ Histórico</Link>
        <Link to="/debug-usuario" className="nav-link">🔍 Debug</Link> {/* ✅ LINK ADICIONADO */}
      </nav>

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
        <Route path="/painel-restaurante" element={<PainelRestaurante restauranteId={4} onVoltar={handleVoltar} />} />
        <Route path="/painel-restaurante/:restauranteId" element={<PainelWrapper />} />

        {/* Lista geral */}
        <Route path="/restaurantes" element={<ListaRestaurantes />} />

        {/* Manager */}
        <Route path="/historico-geral" element={<HistoricoGeralWrapper />} />

        {/* ✅ ROTA ADICIONADA PARA DEBUG */}
        <Route path="/debug-usuario" element={<VerificarUsuario />} />
      </Routes>
    </Router>
  );
};

export default App;