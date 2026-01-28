// src/components/DonoLogin.tsx - VERSÃO QUE VAI FUNCIONAR
import React, { useState, useEffect } from 'react'; // ✅ ADICIONA useEffect
import api from '../services/api';
import PainelRestaurante from './PainelRestaurante';
import './DonoLogin.css';

const DonoLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [nomeDono, setNomeDono] = useState<string>('');

  // ✅ VERIFICA SE JÁ ESTÁ LOGADO AO CARREGAR
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.tipo === 'DONO' && user.restauranteId) {
          console.log('🔍 Usuário já logado encontrado:', user);
          setRestauranteId(user.restauranteId);
          setNomeDono(user.nome);
        }
      } catch (e) {
        console.error('Erro ao parsear user:', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    console.log('🔐 Tentando login do dono:', email);

    try {
      const response = await api.post('/auth/donos/login', { 
        email, 
        senha 
      });
      
      console.log('✅ Login bem-sucedido:', response.data);
      
      const { token, restauranteId, nome } = response.data;
      
      // Salva no localStorage
      localStorage.setItem('token', token);
      const userData = { 
        tipo: 'DONO', 
        nome, 
        restauranteId,
        id: restauranteId
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('💾 Salvo no localStorage:', userData);
      
      // ✅ FORÇA A ATUALIZAÇÃO DO ESTADO
      setNomeDono(nome);
      setRestauranteId(restauranteId);
      
      // ✅ FORÇA RE-RENDER EXPLÍCITO
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
      
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      
      let mensagemErro = 'Falha no login';
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          mensagemErro = 'E-mail ou senha incorretos';
        } else if (status === 404) {
          mensagemErro = 'Dono não encontrado';
        } else if (data?.message) {
          mensagemErro = data.message;
        } else {
          mensagemErro = `Erro ${status}: Falha no servidor`;
        }
      } else if (err.request) {
        mensagemErro = 'Sem resposta do servidor. Verifique sua conexão.';
      } else {
        mensagemErro = 'Erro ao configurar a requisição';
      }
      
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SE LOGOU → MOSTRA PAINEL
  if (restauranteId) {
    console.log('🎯 Renderizando PainelRestaurante com ID:', restauranteId);
    
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <h2 style={{ margin: 0 }}>🍽️ Painel do {nomeDono || 'Restaurante'}</h2>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setRestauranteId(null);
              setNomeDono('');
              window.location.href = '/login-dono';
            }}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
        
        <PainelRestaurante restauranteId={restauranteId} />
      </div>
    );
  }

  // 🔒 TELA DE LOGIN
  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>
        
        {erro && (
          <div className="alert-erro">
            ⚠️ {erro}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="loginD-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pizzaria.dovale@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        {/* ✅ BOTÃO DE DEBUG FORTE */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => {
              console.log('🔍 DEBUG COMPLETO:');
              console.log('- localStorage user:', localStorage.getItem('user'));
              console.log('- localStorage token:', localStorage.getItem('token'));
              console.log('- Estado restauranteId:', restauranteId);
              console.log('- Estado nomeDono:', nomeDono);
              
              // Testa forçar o painel
              const userStr = localStorage.getItem('user');
              if (userStr) {
                const user = JSON.parse(userStr);
                if (user.restauranteId) {
                  alert(`DEBUG: Usuário ${user.nome} com restauranteId ${user.restauranteId} encontrado! Forçando painel...`);
                  setRestauranteId(user.restauranteId);
                  setNomeDono(user.nome);
                }
              }
            }}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🐛 Debug Estado
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonoLogin;