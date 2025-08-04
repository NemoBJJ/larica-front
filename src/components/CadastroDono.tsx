// src/components/CadastroDono.tsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CadastroDono: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    try {
      await api.post('/api/auth/donos/register', {
        nome,
        email,
        senha,
        telefone
      });

      setSucesso('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login-dono'), 2000);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data || 'Erro ao cadastrar';
      setErro(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ marginTop: 0 }}>Cadastro de Dono</h2>

      {erro && <div style={{ marginBottom: 12, padding: 10, background: '#fdecea', color: '#b71c1c', borderRadius: 6 }}>{erro}</div>}
      {sucesso && <div style={{ marginBottom: 12, padding: 10, background: '#e8f5e9', color: '#2e7d32', borderRadius: 6 }}>{sucesso}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <input type="tel" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
        <button type="submit" style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastroDono;
