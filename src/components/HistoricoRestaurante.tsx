// src/components/HistoricoRestaurante.tsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import styles from './HistoricoPedidos.module.css';

interface ItemPedidoDTO {
  id: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number | string;
}

interface HistoricoPedidoDTO {
  pedidoId: number;
  nomeRestaurante: string;
  data: string; // pode vir "2025-08-05" (YYYY-MM-DD) ou ISO: tratamos ambos
  status: string;
  itens: ItemPedidoDTO[];
}

type Props = {
  restauranteId: number;
  onVoltar: () => void;
};

const HistoricoRestaurante: React.FC<Props> = ({ restauranteId, onVoltar }) => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [nomeRestaurante, setNomeRestaurante] = useState<string>('');

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA || b.pedidoId - a.pedidoId;
    });
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedidoDTO[]) =>
    itens.reduce((acc, item) => {
      const preco =
        typeof item.precoUnitario === 'string'
          ? parseFloat(item.precoUnitario)
          : item.precoUnitario;
      return acc + (preco || 0) * item.quantidade;
    }, 0);

  const formatarData = (raw: string) => {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('AGUARDANDO')) return styles.statusAguardando;
    if (s.includes('EM_PREPARO') || s.includes('PREPARANDO')) return styles.statusPreparo;
    if (s.includes('PRONTO')) return styles.statusPronto;
    if (s.includes('ENTREGUE') || s.includes('CONCLUIDO')) return styles.statusEntregue;
    if (s.includes('CANCELADO') || s.includes('RECUSADO')) return styles.statusCancelado;
    return '';
  };

  const formatarStatus = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('AGUARDANDO')) return '🟡 Aguardando';
    if (s.includes('EM_PREPARO') || s.includes('PREPARANDO')) return '🔵 Em preparo';
    if (s.includes('PRONTO')) return '🟢 Pronto';
    if (s.includes('ENTREGUE') || s.includes('CONCLUIDO')) return '✅ Entregue';
    if (s.includes('CANCELADO') || s.includes('RECUSADO')) return '🔴 Cancelado';
    return status;
  };

  // Busca nome do restaurante (tenta /api e depois sem /api)
  const carregarNome = async () => {
    try {
      const r1 = await api.get(`/api/restaurantes/${restauranteId}`);
      setNomeRestaurante(r1.data?.nome || '');
    } catch {
      try {
        const r2 = await api.get(`/restaurantes/${restauranteId}`);
        setNomeRestaurante(r2.data?.nome || '');
      } catch (e) {
        console.error('Falha ao buscar nome do restaurante:', e);
        setNomeRestaurante('');
      }
    }
  };

  const carregarHistorico = async () => {
    try {
      setCarregando(true);
      const { data } = await api.get<HistoricoPedidoDTO[]>(
        `/pedidos/restaurante/${restauranteId}`
      );
      setPedidos(data || []);
      setErro(null);
    } catch (e) {
      console.error(e);
      setErro('Falha ao carregar histórico do restaurante.');
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarNome();
    carregarHistorico();
  }, [restauranteId]);

  if (carregando) return <div className={styles.loading}>Carregando...</div>;
  if (erro) return <div className={styles.error}>{erro}</div>;

  return (
    <div className={styles.historicoContainer}>
      <div className={styles.header}>
        <button onClick={onVoltar} className={styles.btnVoltar}>← Voltar</button>
        <h2>📜 Histórico — {nomeRestaurante || `Restaurante #${restauranteId}`}</h2>
      </div>

      {!pedidos.length ? (
        <div className={styles.empty}>Nenhum pedido encontrado</div>
      ) : (
        <div className={styles.pedidosGrid}>
          {pedidosOrdenados.map((pedido) => (
            <div key={pedido.pedidoId} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <h3>Pedido #{pedido.pedidoId}</h3>
                <span>{formatarData(pedido.data)}</span>
              </div>

              <div className={styles.statusContainer}>
                <span className={`${styles.status} ${getStatusStyle(pedido.status)}`}>
                  {formatarStatus(pedido.status)}
                </span>
              </div>

              <div className={styles.infoContainer}>
                <span className={styles.total}>
                  Total: R$ {calcularTotal(pedido.itens).toFixed(2)}
                </span>
              </div>

              <ul className={styles.itens}>
                {pedido.itens.map((item) => {
                  const preco =
                    typeof item.precoUnitario === 'string'
                      ? parseFloat(item.precoUnitario)
                      : item.precoUnitario;
                  return (
                    <li key={item.id}>
                      {item.quantidade}× {item.nomeProduto} — R$ {preco.toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoRestaurante;
