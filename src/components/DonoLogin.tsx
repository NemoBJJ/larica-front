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

    try {
      const response = await api.post('/auth/donos/login', { email, senha });
      const { token, restauranteId, nome } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({ tipo: 'DONO', nome, restauranteId })
      );

      setNomeDono(nome);
      setRestauranteId(restauranteId);
    } catch (err: any) {
      const status = err?.response?.status;
      setErro(
        status
          ? `Erro ${status}: ${err?.response?.data || 'Falha no login'}`
          : 'Falha no login'
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SE LOGOU → PAINEL COMPLETO DO RESTAURANTE
  if (restauranteId) {
    return (
      <div>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2>🍽️ Painel do {nomeDono}</h2>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setRestauranteId(null);
            }}
          >
            Sair
          </button>
        </div>

        {/* 🔥 AQUI ESTÁ O SEGREDO */}
        <PainelRestaurante restauranteId={restauranteId} />
      </div>
    );
  }

  // 🔒 TELA DE LOGIN
  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>

        {erro && <div className="alert-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="loginD-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonoLogin;
