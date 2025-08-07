// src/components/PainelRestaurante.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PainelRestaurante.css';

// 👇 importa o histórico só para uso aqui
import HistoricoRestaurante from './HistoricoRestaurante';

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

  const [nomeProd, setNomeProd] = useState('');
  const [descProd, setDescProd] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [msgOk, setMsgOk] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  // nome do restaurante
  const [nomeRestaurante, setNomeRestaurante] = useState<string>('');

  // 👇 controla a visualização do histórico LOCAL (apenas nesta página)
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const navigate = useNavigate();

  const carregarPedidos = async () => {
    try {
      const res = await api.get(`/api/restaurantes/${restauranteId}/pedidos`, {
        params: { page: 0, size: 10 },
      });
      setPedidos(res.data?.content || []);
      setErro(null);
    } catch (err: any) {
      const status = err?.response?.status;
      setErro(
        status === 404
          ? 'Restaurante não encontrado. Verifique o ID utilizado.'
          : 'Erro ao carregar pedidos. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  // buscar nome do restaurante (tenta /api e depois sem /api)
  const carregarNomeRestaurante = async () => {
    try {
      const r1 = await api.get(`/api/restaurantes/${restauranteId}`);
      setNomeRestaurante(r1.data?.nome || '');
      return;
    } catch (_) {
      try {
        const r2 = await api.get(`/restaurantes/${restauranteId}`);
        setNomeRestaurante(r2.data?.nome || '');
        return;
      } catch (err) {
        console.error('Erro ao buscar restaurante:', err);
        setNomeRestaurante(''); // fallback vazio
      }
    }
  };

  useEffect(() => {
    carregarPedidos();
    carregarNomeRestaurante();
  }, [restauranteId]);

  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    try {
      await api.patch(
        `/api/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`,
        null,
        { params: { status: novoStatus } }
      );
      await carregarPedidos();
    } catch {
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

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgOk(null);
    setMsgErro(null);

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
      setNomeProd('');
      setDescProd('');
      setPrecoProd('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao cadastrar produto.';
      setMsgErro(`❌ ${msg}`);
    } finally {
      setSalvando(false);
      setTimeout(() => {
        setMsgErro(null);
        setMsgOk(null);
      }, 4000);
    }
  };

  // 👉 quando o histórico estiver aberto, a página mostra somente o histórico
  if (mostrarHistorico) {
    return (
      <div className="painel-container">
        <HistoricoRestaurante
          restauranteId={restauranteId}
          onVoltar={() => setMostrarHistorico(false)}
        />
      </div>
    );
  }

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
      <button onClick={() => (onVoltar ? onVoltar() : navigate(-1))} className="btn-voltar">
        &larr; Voltar
      </button>

      {/* nome do restaurante em destaque */}
      <h2 className="painel-nome-restaurante">
        {nomeRestaurante || `Restaurante #${restauranteId}`}
      </h2>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <h1 className="painel-titulo" style={{ margin: 0 }}>Painel de Pedidos</h1>
        {/* 👇 botão para abrir o histórico local */}
        <button
          className="btn-historico"
          onClick={() => setMostrarHistorico(true)}
          title="Ver histórico por restaurante"
        >
          📜 Ver histórico
        </button>
      </div>
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
            <input value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} required />
          </div>
          <div className="grid-2">
            <div>
              <label>Descrição</label>
              <input value={descProd} onChange={(e) => setDescProd(e.target.value)} required />
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
                required
              />
            </div>
          </div>
          <div className="acoes">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => {
                setNomeProd('');
                setDescProd('');
                setPrecoProd('');
                setMsgErro(null);
                setMsgOk(null);
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
          <div className="sem-pedidos"><p>Nenhum pedido encontrado.</p></div>
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
                <p><strong>Data:</strong> {new Date(pedido.data).toLocaleString()}</p>
                <p><strong>Cliente:</strong> {pedido.nomeCliente}</p>
                <p><strong>Telefone:</strong> {pedido.telefoneCliente}</p>
                <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
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
                    <button onClick={() => atualizarStatus(pedido.id, 'EM_PREPARO')} className="btn-aceitar">
                      Aceitar Pedido
                    </button>
                    <button onClick={() => atualizarStatus(pedido.id, 'CANCELADO')} className="btn-recusar">
                      Recusar Pedido
                    </button>
                  </>
                )}
                {(pedido.status.toUpperCase() === 'EM_PREPARO' || pedido.status.toUpperCase() === 'PRONTO') && (
                  <button onClick={() => atualizarStatus(pedido.id, 'ENTREGUE')} className="btn-entregue">
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
