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
import VerificarUsuario from '../components/VerificarUsuario';
import TelaEntregador from '../components/TelaEntregador';


OS ERROS DE DEPLOY INICIARAM APÓS VOCE ALTERAR MEU App.tsx, faço mais alguns comentários a diante. 

import './App.css';

const PainelWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId);
  return <PainelRestaurante restauranteId={id} onVoltar={() => window.history.back()} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    console.error('🚨 ERRO: Nenhum usuário logado!');
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Acesso não autorizado</h2>
        <p>Você precisa fazer login para acessar o cardápio.</p>
        <button 
          onClick={() => window.location.href = '/login'}
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
    
    console.log('✅ Usuário logado. ID:', usuarioId);
    
    const id = Number(restauranteId ?? 1);
    return (
      <CardapioRestaurante
        restauranteId={id}
        nomeRestaurante={`Restaurante #${id}`}
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
          onClick={() => window.location.href = '/login'}
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
        <Link to="/historico-usuario" className="nav-link">📋 Meu Histórico</Link>
        <Link to="/historico-geral" className="nav-link">≡ Histórico Geral</Link>
        <Link to="/debug-usuario" className="nav-link">🔍 Debug</Link>
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

        {/* Debug */}
        <Route path="/debug-usuario" element={<VerificarUsuario />} />

        {/* ✅ NOVA ROTA DO ENTREGADOR - ADICIONA ISSO AQUI */}
        <Route path="/entregador/pedido/:pedidoId" element={<TelaEntregador />} />
      </Routes>
    </Router>
  );
};

export default App;