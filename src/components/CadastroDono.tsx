// src/components/CadastroDono.tsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CadastroDono: React.FC = () => {
  const navigate = useNavigate();

  // Dono
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  // Restaurante
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [enderecoRestaurante, setEnderecoRestaurante] = useState('');
  const [telefoneRestaurante, setTelefoneRestaurante] = useState('');

  // UI
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    // validações simples
    if (!nomeRestaurante.trim() || !enderecoRestaurante.trim()) {
      setErro('Preencha Nome do Restaurante e Endereço.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        // Dono
        nome,
        email,
        senha,
        telefone,
        // Restaurante (tem que bater com o que você testou no Postman)
        nomeRestaurante,
        enderecoRestaurante,
        telefoneRestaurante,
      };

      const { data } = await api.post('/api/auth/donos/register', payload);
      setSucesso(typeof data === 'string' ? data : 'Dono e restaurante cadastrados com sucesso');

      // Redireciona pro login do dono depois de 1.5s
      setTimeout(() => navigate('/login-dono'), 1500);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data || 'Erro ao cadastrar';
      setErro(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ marginTop: 0 }}>Cadastro de Dono + Restaurante</h2>

      {erro && <div style={{ marginBottom: 12, padding: 10, background: '#fdecea', color: '#b71c1c', borderRadius: 6 }}>{erro}</div>}
      {sucesso && <div style={{ marginBottom: 12, padding: 10, background: '#e8f5e9', color: '#2e7d32', borderRadius: 6 }}>{sucesso}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <legend style={{ padding: '0 6px' }}>Dados do Dono</legend>
          <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
          <input type="tel" placeholder="Telefone (opcional)" value={telefone} onChange={e => setTelefone(e.target.value)} />
        </fieldset>

        <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <legend style={{ padding: '0 6px' }}>Dados do Restaurante</legend>
          <input
            type="text"
            placeholder="Nome do Restaurante"
            value={nomeRestaurante}
            onChange={e => setNomeRestaurante(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Endereço do Restaurante"
            value={enderecoRestaurante}
            onChange={e => setEnderecoRestaurante(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefone do Restaurante (opcional)"
            value={telefoneRestaurante}
            onChange={e => setTelefoneRestaurante(e.target.value)}
          />
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: '#0d6efd', color: '#fff', cursor: 'pointer' }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default CadastroDono;
