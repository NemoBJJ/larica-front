import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';

import HomePage from './pages/HomePage';
import ListaRestaurantes from './components/ListaRestaurantes';
import CadastroUsuario from './components/CadastroUsuario';
import PainelRestaurante from './components/PainelRestaurante';
import DonoLogin from './components/DonoLogin';
import CadastroDono from './components/CadastroDono';
import CardapioRestaurante from './components/CardapioRestaurante';
import UsuarioLogin from './components/UsuarioLogin';
import HistoricoUsuario from './components/HistoricoUsuario';
import HistoricoGeral from './components/HistoricoGeral';
import VerificarUsuario from './components/VerificarUsuario';
import TelaEntregador from './components/TelaEntregador';

import './App.css';

// Configuração direta da API - sem import de arquivo externo
const api = axios.create({
  baseURL: 'https://larica.neemindev.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interface para os dados do pedido
interface PedidoEntregador {
  pedidoId: number;
  status: string;
  enderecoRestaurante: string;
  latRestaurante: number;
  lngRestaurante: number;
  enderecoCliente: string;
  latCliente: number;
  lngCliente: number;
}

// Componente para redirecionar para o Google Maps
const RedirectMaps: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [message, setMessage] = useState('🔄 Redirecionando para Google Maps...');

  useEffect(() => {
    const redirectToMaps = async () => {
      if (!pedidoId) {
        setMessage('❌ ID do pedido não encontrado');
        return;
      }

      try {
        const response = await api.get<PedidoEntregador>(`/entregador/pedido/${pedidoId}`);
        const data = response.data;
        
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data.latCliente},${data.lngCliente}`;
        window.location.href = mapsUrl;
        
      } catch (error) {
        console.error('Erro ao carregar dados do pedido:', error);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=-5.7945,-35.211`;
        window.location.href = mapsUrl;
      }
    };

    redirectToMaps();
  }, [pedidoId]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>{message}</h2>
      <p>Pedido: #{pedidoId}</p>
      <Link to="/">Voltar para o Início</Link>
    </div>
  );
};

// Wrappers existentes
const PainelWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const id = Number(restauranteId);
  return <PainelRestaurante restauranteId={id} onVoltar={() => window.history.back()} />;
};

const CardapioWrapper: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  
  const userData = localStorage.getItem('user');
  
  if (!userData) {
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

// Componente principal
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
        <Link to="/maps/73" className="nav-link" style={{background: '#28a745', color: 'white'}}>
          🗺️ Testar Maps (Pedido 73)
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UsuarioLogin />} />
        <Route path="/cadastro" element={<CadastroUsuario onVoltar={handleVoltar} />} />
        <Route path="/dashboard" element={<ListaRestaurantes />} />
        <Route path="/cardapio/:restauranteId" element={<CardapioWrapper />} />
        <Route path="/historico-usuario" element={<HistoricoUsuarioWrapper />} />
        <Route path="/login-dono" element={<DonoLogin />} />
        <Route path="/cadastro-dono" element={<CadastroDono />} />
        <Route path="/painel-restaurante" element={<PainelRestaurante restauranteId={4} onVoltar={handleVoltar} />} />
        <Route path="/painel-restaurante/:restauranteId" element={<PainelWrapper />} />
        <Route path="/restaurantes" element={<ListaRestaurantes />} />
        <Route path="/historico-geral" element={<HistoricoGeralWrapper />} />
        <Route path="/debug-usuario" element={<VerificarUsuario />} />
        <Route path="/entregador/pedido/:pedidoId" element={<TelaEntregador />} />
        <Route path="/maps/:pedidoId" element={<RedirectMaps />} />
      </Routes>
    </Router>
  );
};

export default App;