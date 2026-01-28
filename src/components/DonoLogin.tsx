import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './DonoLogin.css';

const DonoLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/donos/login', { email, senha });
      const { token, restauranteId, nome } = response.data;

      // ✅ salva sessão do dono
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          tipo: 'DONO',
          nome,
          restauranteId
        })
      );

      // ✅ REDIRECIONA PARA O PAINEL
      navigate('/painel-restaurante', { replace: true });

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

  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>

        {erro && <div className="alert-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="loginD-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
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
