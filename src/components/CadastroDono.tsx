import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CadastroDono.css';

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

    const nomeR = nomeRestaurante.trim();
    const endR = enderecoRestaurante.trim();

    if (!nomeR || !endR) {
      setErro('Preencha Nome do Restaurante e Endereço.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        senha,
        telefone: telefone.trim(),
        nomeRestaurante: nomeR,
        enderecoRestaurante: endR,
        telefoneRestaurante: telefoneRestaurante.trim(),
      };

      const { data } = await api.post('/auth/donos/register', payload);

      setSucesso(typeof data === 'string' ? data : 'Dono e restaurante cadastrados com sucesso');
      setTimeout(() => navigate('/login-dono'), 1200);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data || 'Erro ao cadastrar';
      setErro(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-dono-container">
      <h2 className="cadastro-dono-title">Cadastro de Dono + Restaurante</h2>

      {erro && <div className="mensagem mensagem-erro">{erro}</div>}
      {sucesso && <div className="mensagem mensagem-sucesso">{sucesso}</div>}

      <form onSubmit={handleSubmit} className="cadastro-dono-form">
        <fieldset className="grupo">
          <legend>Dados do Dono</legend>

          <input
            className="input"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            className="input"
            type="tel"
            placeholder="Telefone (opcional)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </fieldset>

        <fieldset className="grupo">
          <legend>Dados do Restaurante</legend>

          <input
            className="input"
            type="text"
            placeholder="Nome do Restaurante"
            value={nomeRestaurante}
            onChange={(e) => setNomeRestaurante(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Endereço do Restaurante"
            value={enderecoRestaurante}
            onChange={(e) => setEnderecoRestaurante(e.target.value)}
            required
          />
          <input
            className="input"
            type="tel"
            placeholder="Telefone do Restaurante (opcional)"
            value={telefoneRestaurante}
            onChange={(e) => setTelefoneRestaurante(e.target.value)}
          />

          <small className="dica">
            Dica: Rua + Número + Bairro + Cidade (ex.: “Rua das Flores, 123 - Centro, Natal”).
          </small>
        </fieldset>

        <button type="submit" disabled={loading} className="btn-cadastro">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default CadastroDono;
