import React, { useEffect, useState, useMemo } from 'react';
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

const HistoricoPedidos: React.FC<{ usuarioId: number; onVoltar: () => void }> = ({
  usuarioId,
  onVoltar,
}) => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA || b.pedidoId - a.pedidoId;
    });
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedidoDTO[]) =>
    itens.reduce((total, item) => {
      const preco = typeof item.precoUnitario === 'string'
        ? parseFloat(item.precoUnitario)
        : item.precoUnitario;
      return total + (preco || 0) * item.quantidade;
    }, 0);

  const formatarData = (data: string) => {
    const date = new Date(data);
    return isNaN(date.getTime())
      ? 'Data inválida'
      : date.toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('AGUARDANDO')) return styles.statusAguardando;
    if (statusUpper.includes('EM_PREPARO') || statusUpper.includes('PREPARANDO')) return styles.statusPreparo;
    if (statusUpper.includes('PRONTO')) return styles.statusPronto;
    if (statusUpper.includes('ENTREGUE') || statusUpper.includes('CONCLUIDO')) return styles.statusEntregue;
    if (statusUpper.includes('CANCELADO') || statusUpper.includes('RECUSADO')) return styles.statusCancelado;
    return '';
  };

  const formatarStatus = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('AGUARDANDO')) return '🟡 Aguardando';
    if (statusUpper.includes('EM_PREPARO') || statusUpper.includes('PREPARANDO')) return '🔵 Em preparo';
    if (statusUpper.includes('PRONTO')) return '🟢 Pronto';
    if (statusUpper.includes('ENTREGUE') || statusUpper.includes('CONCLUIDO')) return '✅ Entregue';
    if (statusUpper.includes('CANCELADO') || statusUpper.includes('RECUSADO')) return '🔴 Cancelado';
    return status;
  };

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setCarregando(true);
        const { data } = await api.get<HistoricoPedidoDTO[]>(`/pedidos/cliente/${usuarioId}`);
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setErro('Falha ao carregar histórico');
      } finally {
        setCarregando(false);
      }
    };
    loadPedidos();
  }, [usuarioId]);

  if (carregando) return <div className={styles.loading}>Carregando...</div>;
  if (erro) return <div className={styles.error}>{erro}</div>;
  if (!pedidos.length) return <div className={styles.empty}>Nenhum pedido encontrado</div>;

  return (
    <div className={styles.historicoContainer}>
      <div className={styles.header}>
        <button onClick={onVoltar} className={styles.btnVoltar}>← Voltar</button>
        <h2>📜 Histórico de Pedidos</h2>
      </div>

      <div className={styles.pedidosGrid}>
        {pedidosOrdenados.map((pedido) => (
          <div key={pedido.pedidoId} className={styles.pedidoCard}>
            <div className={styles.pedidoHeader}>
              <h3>{pedido.itens[0]?.nomeProduto || 'Pedido sem nome'}</h3>
              <span>#{pedido.pedidoId}</span>
            </div>

            <div className={styles.statusContainer}>
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
                const preco = typeof item.precoUnitario === 'string'
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
    </div>
  );
};

export default HistoricoPedidos;
