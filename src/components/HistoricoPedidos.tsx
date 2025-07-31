import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  produto: Produto | null; // <- agora tratando produto como possivelmente nulo
}

interface HistoricoPedidoDTO {
  pedidoId: number;
  nomeRestaurante: string | null;
  data: string;
  status: string;
  itens: ItemPedido[];
}

interface HistoricoPedidosProps {
  usuarioId: number;
  onVoltar: () => void;
}

const HistoricoPedidos: React.FC<HistoricoPedidosProps> = ({ usuarioId, onVoltar }) => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setCarregando(true);
        const response = await api.get<HistoricoPedidoDTO[]>(`/pedidos/cliente/${usuarioId}`);

        if (Array.isArray(response.data)) {
          const pedidosFormatados = response.data
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .map(pedido => ({
              ...pedido,
              nomeRestaurante: pedido.nomeRestaurante || 'Restaurante não informado',
              itens: pedido.itens.map(item => ({
                ...item,
                produto: item.produto || { id: 0, nome: 'Produto desconhecido', preco: 0 }
              }))
            }));

          setPedidos(pedidosFormatados);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setErro('Erro ao carregar histórico. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregarHistorico();
  }, [usuarioId]);

  const calcularTotalPedido = (itens: ItemPedido[]) => {
    return itens.reduce((total, item) => {
      const preco = item.produto?.preco ?? 0;
      return total + preco * item.quantidade;
    }, 0);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (carregando) return <div className="loading">Carregando histórico...</div>;
  if (erro) return <div className="error">{erro}</div>;
  if (pedidos.length === 0) return <div className="empty">Nenhum pedido encontrado.</div>;

  return (
    <div className="historico-container">
      <button onClick={onVoltar} className="voltar-button">
        Voltar
      </button>

      <h2 className="titulo">📜 Histórico de Pedidos</h2>

      {pedidos.map((pedido) => {
        const totalPedido = calcularTotalPedido(pedido.itens);

        return (
          <div key={`pedido-${pedido.pedidoId}`} className="pedido-card">
            <h3>{pedido.nomeRestaurante}</h3>
            <p><strong>ID do Pedido:</strong> {pedido.pedidoId}</p>
            <p><strong>Data:</strong> {formatarData(pedido.data)}</p>
            <p className={`status status-${pedido.status.toLowerCase()}`}>
              <strong>Status:</strong> {pedido.status}
            </p>
            <p><strong>Total:</strong> R$ {totalPedido.toFixed(2)}</p>

            <div className="itens-container">
              <h4>Itens:</h4>
              <ul className="itens-lista">
                {pedido.itens.map((item) => (
                  <li key={`item-${item.id}`}>
                    {item.produto?.nome ?? 'Produto desconhecido'} × {item.quantidade}
                    <span className="preco-item">
                      (R$ {(item.produto?.preco ?? 0 * item.quantidade).toFixed(2)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoricoPedidos;
