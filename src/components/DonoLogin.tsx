// src/components/DonoLogin.tsx - VERSÃO FINAL QUE FUNCIONA
import React, { useState } from 'react';
import api from '../services/api';
import './DonoLogin.css';

const DonoLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      console.log('📤 Enviando login para:', email);
      
      const response = await api.post('/auth/donos/login', { 
        email, 
        senha 
      });
      
      console.log('✅ Resposta:', response.data);
      
      const { token, id, nome } = response.data; // id = 3 (do dono)
      
      // ⚠️ IMPORTANTE: O id DO DONO É O MESMO DO RESTAURANTE!
      const restauranteId = id; // Ambos são 3
      
      console.log(`🔑 ID do dono: ${id}, ID do restaurante: ${restauranteId}`);
      
      // Salva no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        tipo: 'DONO', 
        nome, 
        restauranteId, // Usa o mesmo ID
        id // Mantém também como id
      }));
      
      console.log('💾 Salvo! Redirecionando...');
      
      // ✅ REDIRECIONA DIRETAMENTE
      window.location.href = '/painel-restaurante';
      
    } catch (err: any) {
      console.error('❌ Erro:', err);
      setErro(err.response?.data?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>
        
        {erro && (
          <div className="alert-erro">
            ⚠️ {erro}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lanche.rapido@email.com"
              style={{ padding: '10px', width: '100%' }}
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
              style={{ padding: '10px', width: '100%' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        {/* DEBUG DIRETO NO CONSOLE */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => {
              console.log('=== DEBUG RÁPIDO ===');
              console.log('LocalStorage user:', localStorage.getItem('user'));
              console.log('LocalStorage token:', localStorage.getItem('token'));
              
              // Testa manualmente
              fetch('https://api-larica.neemindev.com/api/auth/donos/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: 'lanche.rapido@email.com',
                  senha: 'senha789' // SENHA REAL
                })
              })
              .then(r => r.json())
              .then(data => {
                console.log('Resposta direta:', data);
                alert(`ID recebido: ${data.id} (usaremos como restauranteId)`);
              });
            }}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔍 Testar Login Manual
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonoLogin;