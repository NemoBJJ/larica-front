import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import ListaRestaurantes from '../components/ListaRestaurantes';
import Dashboard from '../components/Dashboard';
import CadastroUsuario from '../components/CadastroUsuario';
import PainelRestaurante from '../components/PainelRestaurante';
import DonoLogin from '../components/DonoLogin';
import CadastroDono from '../components/CadastroDono';
import CardapioRestaurante from '../components/CardapioRestaurante';
import UsuarioLogin from '../components/UsuarioLogin';
import HistoricoUsuario from '../components/HistoricoUsuario'; // ✅ NOVO COMPONENTE
import './App.css';

const PainelWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId);
  return <PainelRestaurante restauranteId={id} onVoltar={() => window.history.back()} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId ?? 1);
  return (
    <CardapioRestaurante
      restauranteId={id}
      nomeRestaurante={`Restaurante #${id}`}
      onVoltar={() => window.history.back()}
    />
  );
};

const HistoricoWrapper: React.FC = () => {
  const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1'); // ✅ pega o ID logado
  return <HistoricoUsuario usuarioId={usuarioId} />;
};

const App: React.FC = () => {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const handleVoltar = () => setMostrarCadastro(false);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/cadastro" className="nav-link">Cadastro</Link>
        <Link to="/cadastro-dono" className="nav-link">Cadastro Dono</Link>
        <Link to="/painel-restaurante" className="nav-link">Painel (teste ID fixo)</Link>
        <Link to="/login-dono" className="nav-link">Login Dono</Link>
        <Link to="/login" className="nav-link">Login Cliente</Link>
        <Link to="/cardapio/1" className="nav-link">Cardápio (rest. 1)</Link>
        <Link to="/historico-usuario" className="nav-link">📜 Meu Histórico</Link> {/* ✅ NOVO LINK */}
      </nav>

      <Routes>
        <Route path="/" element={<ListaRestaurantes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro" element={<CadastroUsuario onVoltar={handleVoltar} />} />
        <Route path="/cadastro-dono" element={<CadastroDono />} />
        <Route path="/painel-restaurante" element={<PainelRestaurante restauranteId={4} onVoltar={handleVoltar} />} />
        <Route path="/painel-restaurante/:restauranteId" element={<PainelWrapper />} />
        <Route path="/login-dono" element={<DonoLogin />} />
        <Route path="/login" element={<UsuarioLogin />} />
        <Route path="/cardapio/:restauranteId" element={<CardapioWrapper />} />
        <Route path="/historico-usuario" element={<HistoricoWrapper />} /> {/* ✅ NOVA ROTA */}
      </Routes>
    </Router>
  );
};

export default App;
