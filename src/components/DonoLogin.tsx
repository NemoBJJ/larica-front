import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
      const loginRes = await api.post('/auth/donos/login', { email, senha });
      const donoId = Number(loginRes.data?.id);
      if (!Number.isFinite(donoId) || donoId <= 0) {
        setErro('Não foi possível identificar o usuário (ID inválido).');
        return;
      }
      navigate(`/painel-restaurante/${donoId}`);
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
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ marginTop: 0 }}>Login do Dono</h2>

      {erro && (
        <div style={{ marginBottom: 12, padding: 10, background: '#fdecea', color: '#b71c1c', borderRadius: 6 }}>
          {String(erro)}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="dono@exemplo.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: '#0d6efd', color: '#fff', cursor: 'pointer' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default DonoLogin;
