import React, { useState } from 'react';
import api from '../services/api';
import './CadastroUsuario.css';

type Props = {
  onVoltar: () => void;
};

function CadastroUsuario({ onVoltar }: Props) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo: 'CLIENTE',
    dataCadastro: new Date().toISOString().split('T')[0]
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const formatarTelefone = (valor: string): string => {
    const nums = valor.replace(/\D/g, '').slice(0, 11);
    if (nums.length === 0) return '';
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatarTelefone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};
    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.email.includes('@')) novosErros.email = 'Email inválido';
    if (formData.senha.length < 6) novosErros.senha = 'Senha deve ter 6+ caracteres';
    if (formData.telefone.replace(/\D/g, '').length < 11) {
      novosErros.telefone = 'Celular inválido (11 dígitos com DDD)';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso('');
    setErros({});
    if (!validarFormulario()) return;

    try {
      const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone.replace(/\D/g, ''),
        tipo: formData.tipo,
        dataCadastro: formData.dataCadastro
      };

      await api.post('/auth/usuarios/register', dadosParaEnviar);

      setMensagemSucesso('Usuário cadastrado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        tipo: 'CLIENTE',
        dataCadastro: new Date().toISOString().split('T')[0]
      });
    } catch (erro: any) {
      console.error('Erro no cadastro:', erro);
      const status = erro?.response?.status;
      if (status === 409) {
        setErros({ servidor: 'Este e-mail já está cadastrado.' });
      } else {
        setErros({ servidor: 'Erro ao cadastrar usuário. Tente novamente.' });
      }
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Cadastro de Usuário</h2>
        <p className="cadastro-subtitle">Informe seus dados para criar a conta</p>

        {mensagemSucesso && <div className="alert-sucesso">{mensagemSucesso}</div>}
        {erros.servidor && <div className="alert-erro">{erros.servidor}</div>}

        <form onSubmit={cadastrar} className="cadastro-form">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className={erros.nome ? 'input-erro' : ''}
            />
            {erros.nome && <span className="msg-erro">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={erros.email ? 'input-erro' : ''}
            />
            {erros.email && <span className="msg-erro">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label>Senha *</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={erros.senha ? 'input-erro' : ''}
            />
            {erros.senha && <span className="msg-erro">{erros.senha}</span>}
          </div>

          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
              maxLength={15}
              className={erros.telefone ? 'input-erro' : ''}
            />
            {erros.telefone && <span className="msg-erro">{erros.telefone}</span>}
          </div>

          <div className="form-group">
            <label>Tipo de Usuário *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="CLIENTE">Cliente</option>
              <option value="DONO_RESTAURANTE">Dono de Restaurante</option>
            </select>
          </div>

          <input type="hidden" name="dataCadastro" value={formData.dataCadastro} />

          <div className="acoes">
            <button type="button" className="btn-voltar" onClick={onVoltar}>
              ← Voltar
            </button>
            <button type="submit" className="btn-primary">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuario;
