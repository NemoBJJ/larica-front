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
  data: string;
  status: string;
  itens: ItemPedidoDTO[];
}

const HistoricoGeral: React.FC = () => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      const da = new Date(a.data).getTime();
      const db = new Date(b.data).getTime();
      return db - da || b.pedidoId - a.pedidoId;
    });
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedidoDTO[]) =>
    itens.reduce((tot, item) => {
      const p = typeof item.precoUnitario === 'string' ? parseFloat(item.precoUnitario) : item.precoUnitario;
      return tot + (p || 0) * item.quantidade;
    }, 0);

  const formatarData = (data: string) => {
    const d = new Date(data);
    return isNaN(d.getTime()) ? data : d.toLocaleDateString('pt-BR');
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

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('AGUARDANDO')) return styles.statusAguardando;
    if (s.includes('EM_PREPARO') || s.includes('PREPARANDO')) return styles.statusPreparo;
    if (s.includes('PRONTO')) return styles.statusPronto;
    if (s.includes('ENTREGUE') || s.includes('CONCLUIDO')) return styles.statusEntregue;
    if (s.includes('CANCELADO') || s.includes('RECUSADO')) return styles.statusCancelado;
    return '';
  };

  useEffect(() => {
    const load = async () => {
      try {
        setCarregando(true);
        // ✅✅✅ CORREÇÃO AQUI - remove a URL absoluta
        const response = await api.get<HistoricoPedidoDTO[]>('/pedidos/todos');
        setPedidos(response.data || []);
      } catch (err) {
        console.error('Erro ao carregar histórico geral:', err);
        setErro('Falha ao carregar histórico geral');
      } finally {
        setCarregando(false);
      }
    };
    load();
  }, []);

  if (carregando) return <div className={styles.loading}>Carregando...</div>;
  if (erro) return <div className={styles.error}>{erro}</div>;
  if (!pedidos.length) return <div className={styles.empty}>Nenhum pedido encontrado</div>;

  return (
    <div className={styles.historicoContainer}>
      <div className={styles.header}>
        <button onClick={() => window.history.back()} className={styles.btnVoltar}>← Voltar</button>
        <h2>📜 Histórico Geral (Manager)</h2>
      </div>

      <div className={styles.pedidosGrid}>
        {pedidosOrdenados.map((pedido) => (
          <div key={pedido.pedidoId} className={styles.pedidoCard}>
            <div className={styles.pedidoHeader}>
              <h3>{pedido.nomeRestaurante} — #{pedido.pedidoId}</h3>
              <span className={`${styles.status} ${getStatusStyle(pedido.status)}`}>
                {formatarStatus(pedido.status)}
              </span>
            </div>

            <div className={styles.infoContainer}>
              <span className={styles.data}>{formatarData(pedido.data)}</span>
              <span className={styles.total}>Total: R$ {calcularTotal(pedido.itens).toFixed(2)}</span>
            </div>

            <ul className={styles.itens}>
              {pedido.itens.map((item) => {
                const preco = typeof item.precoUnitario === 'string' ? parseFloat(item.precoUnitario) : item.precoUnitario;
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
    </div>
  );
};

export default HistoricoGeral;