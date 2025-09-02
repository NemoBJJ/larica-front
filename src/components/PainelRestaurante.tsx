// src/components/PainelRestaurante.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PainelRestaurante.css';
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
  restaurante?: {
    id: number;
    nome: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    telefone: string;
    latitude: number;
    longitude: number;
  };
  cliente?: {
    nome: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
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

  const [nomeRestaurante, setNomeRestaurante] = useState<string>('');
  const [enderecoRestaurante, setEnderecoRestaurante] = useState<string>('');
  const [telefoneRestaurante, setTelefoneRestaurante] = useState<string>('');

  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const navigate = useNavigate();

  const carregarPedidos = async () => {
    try {
      const res = await api.get(`/restaurantes/${restauranteId}/pedidos`, {
        params: { page: 0, size: 10 },
      });
      
      const pedidosCompletos = (res.data?.content || res.data || []).map((pedido: any) => ({
        ...pedido,
        restaurante: {
          id: restauranteId,
          nome: nomeRestaurante,
          endereco: enderecoRestaurante,
          telefone: telefoneRestaurante
        }
      }));
      
      setPedidos(pedidosCompletos);
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

  const carregarDadosRestaurante = async () => {
    try {
      const r = await api.get(`/restaurantes/${restauranteId}`);
      setNomeRestaurante(r.data?.nome || '');
      setEnderecoRestaurante(r.data?.endereco || '');
      setTelefoneRestaurante(r.data?.telefone || '');
    } catch (err) {
      console.error('Erro ao buscar restaurante:', err);
      setNomeRestaurante('');
      setEnderecoRestaurante('');
      setTelefoneRestaurante('');
    }
  };

  useEffect(() => {
    carregarDadosRestaurante().then(() => {
      carregarPedidos();
    });
  }, [restauranteId]);

  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    await api.patch(
      `/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`,
      null,
      { params: { status: novoStatus } }
    );
  };

  const coopStorageKey = (id: number) => `coop_whats_${id}`;
  const limparNaoDigitos = (s: string) => s.replace(/\D+/g, '');

  const normalizarNumero = (raw: string) => {
    let n = limparNaoDigitos(raw);
    if (!n.startsWith('55') && (n.length === 10 || n.length === 11)) {
      n = '55' + n;
    }
    return n;
  };

  const obterOuConfigurarCooperativa = (): string | null => {
    const key = coopStorageKey(restauranteId);
    const atual = localStorage.getItem(key);
    if (atual) return atual;

    const informado = window.prompt(
      'Informe o WhatsApp da cooperativa/motoboy (com DDI/DDD). Ex.: 5584XXXXXXXXX'
    );
    if (!informado) return null;

    const numero = normalizarNumero(informado);
    if (!/^55\d{10,13}$/.test(numero)) {
      alert('Número inválido. Use DDI 55 + DDD + número.');
      return null;
    }
    localStorage.setItem(key, numero);
    return numero;
  };

  const configurarCooperativa = () => {
    const key = coopStorageKey(restauranteId);
    const atual = localStorage.getItem(key) || '';
    const informado = window.prompt(
      'Definir/alterar WhatsApp da cooperativa (com DDI/DDD).',
      atual
    );
    if (!informado) return;
    const numero = normalizarNumero(informado);
    if (!/^55\d{10,13}$/.test(numero)) {
      alert('Número inválido. Use DDI 55 + DDD + número.');
      return;
    }
    localStorage.setItem(key, numero);
    alert('Número salvo com sucesso!');
  };

  // ✅ FUNÇÃO CORRIGIDA - AGORA COM /api NO LINK
  const chamarMeuEntregador = (pedido: Pedido) => {
    const numero = obterOuConfigurarCooperativa();
    if (!numero) return;
    
    const nomeRest = pedido.restaurante?.nome || nomeRestaurante || 'Restaurante';
    
    const mensagem = `🚚 *LARICA - ENTREGA DISPONÍVEL* 🚚%0A%0A` +
                     `*Pedido:* #${pedido.id}%0A` +
                     `*Restaurante:* ${nomeRest}%0A%0A` +
                     `📍 *ACESSE O MAPA COMPLETO:*%0A` +
                     `${window.location.origin}/api/entregador/pedido/${pedido.id}%0A%0A` + // ✅ CORRETO
                     `💰 *Valor sugerido:* R$ 15,00%0A` +
                     `⏰ *Prazo:* 30 minutos`;

    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
  };

  // ✅ FUNÇÃO CORRIGIDA - AGORA COM /api NO LINK
  const postarNoGrupoWhatsApp = (pedido: Pedido) => {
    const nomeRest = pedido.restaurante?.nome || nomeRestaurante || 'Restaurante';
    
    const mensagem = `🚚 *LARICA - ENTREGA DISPONÍVEL* 🚚%0A%0A` +
                     `*Pedido:* #${pedido.id}%0A` +
                     `*Restaurante:* ${nomeRest}%0A%0A` +
                     `📍 *ACESSE O MAPA COMPLETO:*%0A` +
                     `${window.location.origin}/api/entregador/pedido/${pedido.id}%0A%0A` + // ✅ CORRETO
                     `⚠️ *QUEM PEGAR COMENTA NO GRUPO!*`;

    window.open(`https://web.whatsapp.com/send?text=${mensagem}`, '_blank');
  };

  const handleAceitar = async (pedido: Pedido) => {
    try {
      await atualizarStatus(pedido.id, 'EM_PREPARO');
      await carregarPedidos();
    } catch {
      setErro('Erro ao aceitar o pedido.');
    }
  };

  const handleRecusar = async (pedidoId: number) => {
    try {
      await atualizarStatus(pedidoId, 'CANCELADO');
      await carregarPedidos();
    } catch {
      setErro('Erro ao atualizar status do pedido.');
    }
  };

  const marcarEntregue = async (pedidoId: number) => {
    try {
      await atualizarStatus(pedidoId, 'ENTREGUE');
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
      await api.post(`/produtos/por-restaurante/${restauranteId}`, {
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
      <button
        onClick={() => (onVoltar ? onVoltar() : navigate(-1))}
        className="btn-voltar"
      >
        &larr; Voltar
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 className="painel-nome-restaurante" style={{ margin: 0 }}>
          {nomeRestaurante || `Restaurante #${restauranteId}`}
        </h2>
        <button
          className="btn-historico"
          onClick={() => setMostrarHistorico(true)}
          title="Ver histórico por restaurante"
        >
          📜 Ver histórico
        </button>
        <button
          className="btn-secundario"
          onClick={configurarCooperativa}
          title="Definir/alterar WhatsApp da cooperativa"
        >
          ⚙️ Configurar Whats da cooperativa
        </button>
      </div>

      <p className="painel-subtitulo">Usando ID: {restauranteId}</p>

      {msgOk && <div className="alert sucesso">{msgOk}</div>}
      {msgErro && <div className="alert erro">{msgErro}</div>}
      {erro && <div className="alert erro">{erro}</div>}

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

      <div className="pedidos-lista">
        {pedidos.length === 0 ? (
          <div className="sem-pedidos">
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const statusUp = (pedido.status || '').toUpperCase();
            const podeChamarEntregador = statusUp === 'EM_PREPARO' || statusUp === 'PRONTO';

            return (
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

                <div className="acoes-pedido" style={{ gap: 8 }}>
                  {(statusUp === 'AGUARDANDO') && (
                    <>
                      <button
                        onClick={() => handleAceitar(pedido)}
                        className="btn-aceitar"
                      >
                        Aceitar Pedido
                      </button>
                      <button
                        onClick={() => handleRecusar(pedido.id)}
                        className="btn-recusar"
                      >
                        Recusar Pedido
                      </button>
                    </>
                  )}

                  {podeChamarEntregador && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <button
                        onClick={() => chamarMeuEntregador(pedido)}
                        className="btn-primario"
                        title="Chamar meu entregador próprio"
                      >
                        📞 Chamar Meu Entregador
                      </button>

                      <button
                        onClick={() => postarNoGrupoWhatsApp(pedido)}
                        className="btn-secundario"
                        title="Postar no grupo de entregadores"
                      >
                        📢 Chamar Grupo de Entregadores
                      </button>
                    </div>
                  )}

                  {(statusUp === 'EM_PREPARO' || statusUp === 'PRONTO') && (
                    <button
                      onClick={() => marcarEntregue(pedido.id)}
                      className="btn-entregue"
                    >
                      Marcar como Entregue
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PainelRestaurante;