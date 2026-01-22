import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './DonoLogin.css';

const DonoLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // 🔥 NOVOS ESTADOS PARA O PAINEL
  const [donoLogado, setDonoLogado] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);

  // Função para carregar pedidos do restaurante
  const carregarPedidosRestaurante = async (restauranteId: number) => {
    try {
      setCarregandoPedidos(true);
      const res = await api.get(`/restaurantes/${restauranteId}/pedidos`, {
        params: { page: 0, size: 50 }
      });
      const pedidosData = res.data?.content || res.data || [];
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setCarregandoPedidos(false);
    }
  };

  // 🔥 FUNÇÃO DE LOGIN ATUALIZADA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/donos/login', { email, senha });
      const { token, id, nome, email: donoEmail, telefone } = response.data;

      localStorage.setItem('token', token);
      
      const donoData = {
        id,
        nome,
        email: donoEmail,
        telefone,
        tipo: 'DONO'
      };
      
      localStorage.setItem('user', JSON.stringify(donoData));
      setDonoLogado(donoData);
      
      // 🔥 CARREGAR PEDIDOS DIRETO (sem navegar)
      await carregarPedidosRestaurante(id);
      
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

  // 🔥 ATUALIZAR PEDIDO A CADA 30s SE ESTIVER LOGADO
  useEffect(() => {
    if (!donoLogado?.id) return;
    
    const interval = setInterval(() => {
      carregarPedidosRestaurante(donoLogado.id);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [donoLogado]);

  // 🔥 FUNÇÕES DE AÇÃO
  const aceitarPedido = async (pedidoId: number) => {
    try {
      await api.patch(
        `/restaurantes/${donoLogado.id}/pedidos/${pedidoId}/status`,
        null,
        { params: { status: 'EM_PREPARO' } }
      );
      await carregarPedidosRestaurante(donoLogado.id);
    } catch (error) {
      console.error('Erro ao aceitar pedido:', error);
    }
  };

  const recusarPedido = async (pedidoId: number) => {
    try {
      await api.patch(
        `/restaurantes/${donoLogado.id}/pedidos/${pedidoId}/status`,
        null,
        { params: { status: 'CANCELADO' } }
      );
      await carregarPedidosRestaurante(donoLogado.id);
    } catch (error) {
      console.error('Erro ao recusar pedido:', error);
    }
  };

  // 🔥 SE ESTIVER LOGADO, MOSTRA O PAINEL
  if (donoLogado) {
    return (
      <div className="painel-container">
        <h2>🍽️ Painel do {donoLogado.nome}</h2>
        <button onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setDonoLogado(null);
          setPedidos([]);
        }}>
          Sair
        </button>

        {carregandoPedidos ? (
          <p>Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map((pedido) => {
              const statusUp = (pedido.status || '').toUpperCase();
              
              return (
                <div key={pedido.id} className="pedido-card">
                  <h3>Pedido #{pedido.id} - {pedido.status}</h3>
                  <p>Cliente: {pedido.nomeCliente}</p>
                  <p>Total: R$ {pedido.total?.toFixed(2)}</p>
                  
                  {/* 🔥 BOTÕES DE AÇÃO */}
                  {(statusUp === 'AGUARDANDO' || statusUp === 'PAGO') && (
                    <div>
                      <button onClick={() => aceitarPedido(pedido.id)}>
                        Aceitar Pedido
                      </button>
                      <button onClick={() => recusarPedido(pedido.id)}>
                        Recusar Pedido
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 🔥 SE NÃO ESTIVER LOGADO, MOSTRA O FORMULÁRIO
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