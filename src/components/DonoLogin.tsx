// src/components/DonoLogin.tsx
import React, { useState } from 'react';
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
      localStorage.setItem('user', JSON.stringify({ 
        tipo: 'DONO', 
        nome, 
        restauranteId,
        id: restauranteId // Para compatibilidade
      }));
      
      // Atualiza estado para mostrar painel
      setNomeDono(nome);
      setRestauranteId(restauranteId);
      
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

  // 🔥 SE LOGOU COM SUCESSO → MOSTRA O PAINEL
  if (restauranteId) {
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
              window.location.reload();
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
        
        {/* CHAMA O PAINEL RESTAURANTE COMPLETO */}
        <PainelRestaurante restauranteId={restauranteId} />
      </div>
    );
  }

  // 🔒 TELA DE LOGIN (SE NÃO ESTIVER LOGADO)
  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>
        
        {erro && (
          <div className="alert-erro" style={{ 
            color: '#721c24', 
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '12px', 
            borderRadius: '5px',
            marginBottom: '16px'
          }}>
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
              style={{ padding: '10px', fontSize: '16px', width: '100%' }}
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
              style={{ padding: '10px', fontSize: '16px', width: '100%' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              padding: '12px', 
              fontSize: '16px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '10px'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Não tem conta?{' '}
            <a 
              href="/cadastro-dono" 
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              Cadastre seu restaurante
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonoLogin;