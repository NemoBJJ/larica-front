import { useState } from 'react';
import axios from 'axios';

type Props = {
  onVoltar: () => void;
};

function CadastroUsuario({ onVoltar }: Props) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        dataCadastro: formData.dataCadastro
      };

      await axios.post('http://localhost:8086/api/auth/usuarios/register', dadosParaEnviar);

      setMensagemSucesso('Usuário cadastrado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
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
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginTop: 0, color: '#333' }}>Cadastro de Usuário</h2>

      {mensagemSucesso && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {mensagemSucesso}
        </div>
      )}

      {erros.servidor && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {erros.servidor}
        </div>
      )}

      <form onSubmit={cadastrar} style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: erros.nome ? '1px solid #dc3545' : '1px solid #ced4da',
              fontSize: '16px'
            }}
          />
          {erros.nome && <span style={{ color: '#dc3545', fontSize: '14px' }}>{erros.nome}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: erros.email ? '1px solid #dc3545' : '1px solid #ced4da',
              fontSize: '16px'
            }}
          />
          {erros.email && <span style={{ color: '#dc3545', fontSize: '14px' }}>{erros.email}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha *</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: erros.senha ? '1px solid #dc3545' : '1px solid #ced4da',
              fontSize: '16px'
            }}
          />
          {erros.senha && <span style={{ color: '#dc3545', fontSize: '14px' }}>{erros.senha}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefone *</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
            maxLength={15}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: erros.telefone ? '1px solid #dc3545' : '1px solid #ced4da',
              fontSize: '16px'
            }}
          />
          {erros.telefone && <span style={{ color: '#dc3545', fontSize: '14px' }}>{erros.telefone}</span>}
        </div>

        <input type="hidden" name="dataCadastro" value={formData.dataCadastro} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onVoltar}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Voltar
          </button>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroUsuario;
