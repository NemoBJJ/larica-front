import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UsuarioLogin.css'; // Estilo específico (opcional)

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
      // 1) Login do usuário (endpoint diferente do dono)
      const response = await api.post('/api/auth/usuarios/login', { email, senha });

      // 2) Extrair ID do usuário da resposta
      const usuarioId = response.data?.id;
      if (!usuarioId) {
        throw new Error('ID do usuário não encontrado na resposta');
      }

      // ✅ Salva o ID no localStorage
      localStorage.setItem("usuarioId", usuarioId.toString());

      // 3) Redirecionar para dashboard ou lista de restaurantes
      navigate('/dashboard'); // Ou `/usuario/${usuarioId}` se tiver perfil

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
