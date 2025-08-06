import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PainelRestaurante.css';

interface ItemPedido {
  id: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

interface Pedido {
  id: number;
  data: string;
  status: string;
  nomeCliente: string;
  telefoneCliente: string;
  itens: ItemPedido[];
  total: number;
}

interface PainelProps {
  restauranteId: number;
  onVoltar?: () => void;
}

const PainelRestaurante: React.FC<PainelProps> = ({ restauranteId, onVoltar }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Novo Produto
  const [nomeProd, setNomeProd] = useState('');
  const [descProd, setDescProd] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [msgOk, setMsgOk] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  const navigate = useNavigate();

  const carregarPedidos = async () => {
    try {
      const res = await api.get(`/api/restaurantes/${restauranteId}/pedidos`, {
        params: { page: 0, size: 10 },
      });
      setPedidos(res.data?.content || []);
      setErro(null);
    } catch (err: any) {
      console.error('Erro ao carregar pedidos:', err);
      const status = err?.response?.status;
      if (status === 404) {
        setErro('Restaurante não encontrado. Verifique o ID utilizado.');
      } else {
        setErro('Erro ao carregar pedidos. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, [restauranteId]);

  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    try {
      await api.patch(
        `/api/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`,
        null,
        { params: { status: novoStatus } }
      );
      await carregarPedidos();
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      setErro('Erro ao atualizar status do pedido.');
    }
  };

  const getStatusClass = (status: string) => {
    const s = status?.toUpperCase?.() || '';
    if (s === 'AGUARDANDO') return 'status-aguardando';
    if (s === 'EM_PREPARO' || s === 'PREPARANDO') return 'status-preparo';
    if (s === 'PRONTO') return 'status-pronto';
    if (s === 'ENTREGUE') return 'status-entregue';
    if (s === 'CANCELADO' || s === 'RECUSADO') return 'status-cancelado';
    return '';
  };

  const voltar = () => (onVoltar ? onVoltar() : navigate(-1));

  const limparMensagens = () => {
    setMsgOk(null);
    setMsgErro(null);
  };

  const resetForm = () => {
    setNomeProd('');
    setDescProd('');
    setPrecoProd('');
  };

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    limparMensagens();

    if (!nomeProd.trim() || !descProd.trim() || !precoProd.trim()) {
      setMsgErro('Preencha nome, descrição e preço.');
      return;
    }

    const precoNumber = Number(precoProd.replace(',', '.'));
    if (Number.isNaN(precoNumber) || precoNumber < 0) {
      setMsgErro('Informe um preço válido (ex.: 28.90).');
      return;
    }

    setSalvando(true);
    try {
      await api.post(`/api/produtos/por-restaurante/${restauranteId}`, {
        nome: nomeProd.trim(),
        descricao: descProd.trim(),
        preco: precoNumber,
      });

      setMsgOk('✅ Produto cadastrado com sucesso!');
      resetForm();
    } catch (err: any) {
      console.error('Erro ao cadastrar produto:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Erro ao cadastrar produto.';
      setMsgErro(`❌ ${msg}`);
    } finally {
      setSalvando(false);
      setTimeout(() => {
        limparMensagens();
      }, 4000);
    }
  };

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="painel-container">
      <button onClick={voltar} className="btn-voltar">
        &larr; Voltar
      </button>

      <h1 className="painel-titulo">Painel de Pedidos</h1>
      <p className="painel-subtitulo">Usando ID: {restauranteId}</p>

      {msgOk && <div className="alert sucesso">{msgOk}</div>}
      {msgErro && <div className="alert erro">{msgErro}</div>}
      {erro && <div className="alert erro">{erro}</div>}

      {/* Novo Produto */}
      <div className="novo-produto-card">
        <h2>Novo produto</h2>

        <form onSubmit={criarProduto} className="novo-produto-form">
          <div>
            <label>Nome</label>
            <input
              value={nomeProd}
              onChange={(e) => setNomeProd(e.target.value)}
              placeholder="Ex.: X-Bacon"
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label>Descrição</label>
              <input
                value={descProd}
                onChange={(e) => setDescProd(e.target.value)}
                placeholder="Ex.: Pão, carne, queijo e bacon"
                required
              />
            </div>

            <div>
              <label>Preço (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={precoProd}
                onChange={(e) => setPrecoProd(e.target.value)}
                placeholder="Ex.: 28.90"
                required
              />
            </div>
          </div>

          <div className="acoes">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => {
                resetForm();
                limparMensagens();
              }}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primario" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Pedidos */}
      <div className="pedidos-lista">
        {pedidos.length === 0 ? (
          <div className="sem-pedidos">
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <h3>Pedido #{pedido.id}</h3>
                <span className={`status-badge ${getStatusClass(pedido.status)}`}>
                  {pedido.status}
                </span>
              </div>

              <div className="pedido-info">
                <p>
                  <strong>Data:</strong>{' '}
                  {new Date(pedido.data).toLocaleString()}
                </p>
                <p>
                  <strong>Cliente:</strong> {pedido.nomeCliente}
                </p>
                <p>
                  <strong>Telefone:</strong> {pedido.telefoneCliente}
                </p>
                <p>
                  <strong>Total:</strong> R$ {pedido.total.toFixed(2)}
                </p>
              </div>

              <div className="itens-container">
                <h4>Itens:</h4>
                <ul className="itens-lista">
                  {pedido.itens.map((item) => (
                    <li key={item.id}>
                      <span className="item-quantidade">{item.quantidade}x</span>
                      <span className="item-nome">{item.nomeProduto}</span>
                      <span className="item-preco">
                        R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="acoes-pedido">
                {pedido.status.toUpperCase() === 'AGUARDANDO' && (
                  <>
                    <button
                      onClick={() => atualizarStatus(pedido.id, 'EM_PREPARO')}
                      className="btn-aceitar"
                    >
                      Aceitar Pedido
                    </button>
                    <button
                      onClick={() => atualizarStatus(pedido.id, 'CANCELADO')}
                      className="btn-recusar"
                    >
                      Recusar Pedido
                    </button>
                  </>
                )}

                {(pedido.status.toUpperCase() === 'EM_PREPARO' ||
                  pedido.status.toUpperCase() === 'PRONTO') && (
                  <button
                    onClick={() => atualizarStatus(pedido.id, 'ENTREGUE')}
                    className="btn-entregue"
                  >
                    Marcar como Entregue
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PainelRestaurante;
