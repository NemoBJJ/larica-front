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
      const { token, id, nome, email: donoEmail, telefone } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id,
        nome,
        email: donoEmail,
        telefone,
        tipo: 'DONO'
      }));

      navigate(`/painel-restaurante/${id}`);
    } catch (err: any) {
      console.error(err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      setErro(
        status
          ? `Erro ${status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`
          : 'Falha no login. Verifique as credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginD-container">
      <div className="loginD-card">
        <h2>Login do Dono</h2>

        {erro && <div className="alert-erro">{String(erro)}</div>}

        <form onSubmit={handleSubmit} className="loginD-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dono@exemplo.com"
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonoLogin;
