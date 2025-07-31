import React, { useEffect, useState } from 'react';
import api from '../services/api';

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

interface PedidoExibicao extends Omit<HistoricoPedidoDTO, 'pedidoId'> {
  id: string;
}

const HistoricoPedidos: React.FC<{ usuarioId: number; onVoltar: () => void }> = ({
  usuarioId,
  onVoltar
}) => {
  const [pedidos, setPedidos] = useState<PedidoExibicao[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Função para calcular o total do pedido
  const calcularTotalPedido = (itens: ItemPedidoDTO[]): number => {
    return itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
  };

  // Função para obter o nome principal do pedido
  const obterNomePrincipal = (itens: ItemPedidoDTO[]): string => {
    return itens.length > 0 ? itens[0].nomeProduto : 'Pedido sem itens';
  };

  // Função para formatar a data
  const formatarData = (dataString: string): string => {
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // Função para formatar o status
  const formatarStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'AGUARDANDO': '🟡 Aguardando',
      'PENDENTE': '🟠 Pendente',
      'CONCLUIDO': '🟢 Concluído',
      'CANCELADO': '🔴 Cancelado'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setCarregando(true);
        const { data } = await api.get<HistoricoPedidoDTO[]>(`/pedidos/cliente/${usuarioId}`);

        // Transformação mínima dos dados para exibição
        const pedidosFormatados = data.map(pedido => ({
          ...pedido,
          id: `pedido-${pedido.pedidoId}`,
          nomeRestaurante: pedido.nomeRestaurante || 'Restaurante não informado',
          data: pedido.data || new Date().toISOString(),
          status: pedido.status || 'STATUS_DESCONHECIDO'
        }));

        setPedidos(pedidosFormatados);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setErro('Erro ao carregar histórico. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregando && carregarHistorico();
  }, [usuarioId]);

  if (carregando) return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando histórico...</div>;
  if (erro) return <div style={{ padding: '20px', color: 'red' }}>{erro}</div>;
  if (pedidos.length === 0) return <div style={{ padding: '20px' }}>Nenhum pedido encontrado.</div>;

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onVoltar}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Voltar
      </button>

      <h2 style={{ marginBottom: '20px', color: '#333' }}>📜 Histórico de Pedidos</h2>

      <div style={{ display: 'grid', gap: '20px' }}>
        {pedidos.map((pedido) => {
          const totalPedido = calcularTotalPedido(pedido.itens);
          const nomePrincipal = obterNomePrincipal(pedido.itens);

          return (
            <div
              key={pedido.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>{nomePrincipal}</h3>
                <span style={{ color: '#666' }}>#{pedido.id.replace(/^pedido-/, '')}</span>
              </div>

              <div style={{ margin: '10px 0', color: '#666' }}>
                <p style={{ margin: '4px 0' }}><strong>Restaurante:</strong> {pedido.nomeRestaurante}</p>
                <p style={{ margin: '4px 0' }}><strong>Data:</strong> {formatarData(pedido.data)}</p>
                <p style={{
                  margin: '4px 0',
                  color: pedido.status === 'AGUARDANDO' ? '#FFD700' :
                        pedido.status === 'PENDENTE' ? '#FFA500' :
                        pedido.status === 'CONCLUIDO' ? '#008000' : '#FF0000'
                }}>
                  <strong>Status:</strong> {formatarStatus(pedido.status)}
                </p>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                  <strong>Total:</strong> R$ {totalPedido.toFixed(2)}
                </p>
              </div>

              {pedido.itens.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ marginBottom: '8px' }}>Itens:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {pedido.itens.map((item) => (
                      <li
                        key={`${pedido.id}-item-${item.id}`}
                        style={{
                          padding: '6px 0',
                          borderBottom: '1px solid #eee',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>
                          {item.nomeProduto} × {item.quantidade}
                        </span>
                        <span style={{ color: '#666' }}>
                          R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoricoPedidos;
