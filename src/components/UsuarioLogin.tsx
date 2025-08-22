import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UsuarioLogin.css';

const UsuarioLogin: React.FC = () => {
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
      const response = await api.post('/auth/usuarios/login', { email, senha });

      // ✅ SALVA TOKEN E DADOS DO USUÁRIO (em vez de só o ID)
      const { token, id, nome, email: userEmail } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id,
        nome,
        email: userEmail,
        tipo: 'CLIENTE'
      }));

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setErro(
        err.response?.data?.message ||
        'Falha no login. Verifique seu e-mail e senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🍔 Login do Cliente</h2>
        <p className="subtitle">Acesse para fazer pedidos</p>

        {erro && (
          <div className="alert erro">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@exemplo.com"
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

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="links">
          <a href="/cadastro">Não tem conta? Cadastre-se</a>
          <a href="/recuperar-senha">Esqueceu a senha?</a>
        </div>
      </div>
    </div>
  );
};

export default UsuarioLogin;
