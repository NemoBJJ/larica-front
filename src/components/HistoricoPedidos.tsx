import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import styles from './HistoricoPedidos.module.css';

interface ItemPedidoDTO {
  id: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
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
  onVoltar
}) => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ordena por data (mais recente primeiro)
  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedidoDTO[]) => {
    return itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
  };

  const getNomePrincipal = (itens: ItemPedidoDTO[]) => {
    return itens[0]?.nomeProduto || 'Pedido sem itens';
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR') || 'Data inválida';
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'AGUARDANDO': return styles.statusAguardando;
      case 'PENDENTE': return styles.statusPendente;
      case 'CONCLUIDO': return styles.statusConcluido;
      case 'CANCELADO': return styles.statusCancelado;
      default: return '';
    }
  };

  const formatarStatus = (status: string) => {
    const formatos: Record<string, string> = {
      'AGUARDANDO': '🟡 Aguardando',
      'PENDENTE': '🟠 Pendente',
      'CONCLUIDO': '🟢 Concluído',
      'CANCELADO': '🔴 Cancelado'
    };
    return formatos[status] || status;
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
        <button onClick={onVoltar} className={styles.btnVoltar}>
          ← Voltar
        </button>
        <h2>📜 Histórico de Pedidos</h2>
      </div>

      <div className={styles.pedidosGrid}>
        {pedidosOrdenados.map(pedido => (
          <div key={pedido.pedidoId} className={styles.pedidoCard}>
            <div className={styles.pedidoHeader}>
              <h3>{getNomePrincipal(pedido.itens)}</h3>
              <span>#{pedido.pedidoId}</span>
            </div>

            <div className={styles.pedidoInfo}>
              <p><strong>Restaurante:</strong> {pedido.nomeRestaurante}</p>
              <p><strong>Data:</strong> {formatarData(pedido.data)}</p>
              <p className={getStatusStyle(pedido.status)}>
                <strong>Status:</strong> {formatarStatus(pedido.status)}
              </p>
              <p className={styles.total}>
                <strong>Total:</strong> R$ {calcularTotal(pedido.itens).toFixed(2)}
              </p>
            </div>

            {pedido.itens.length > 0 && (
              <div className={styles.itensList}>
                <h4>Itens:</h4>
                <ul>
                  {pedido.itens.map(item => (
                    <li key={`${pedido.pedidoId}-${item.id}`}>
                      <span>{item.nomeProduto} × {item.quantidade}</span>
                      <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricoPedidos;
