import React, { useEffect, useState } from 'react';
import api from '../services/api';

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

const HistoricoUsuario: React.FC<{ 
  usuarioId: number; 
  onVoltar?: () => void; // ✅ AGORA É OPCIONAL
}> = ({ usuarioId, onVoltar }) => {
  const [pedidos, setPedidos] = useState<HistoricoPedidoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setCarregando(true);
        const res = await api.get<HistoricoPedidoDTO[]>(`/pedidos/cliente/${usuarioId}`);
        setPedidos(res.data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setErro('Erro ao carregar histórico.');
      } finally {
        setCarregando(false);
      }
    };
    carregarHistorico();
  }, [usuarioId]);

  const calcularTotal = (itens: ItemPedidoDTO[]) =>
    itens.reduce((total, item) => {
      const preco = typeof item.precoUnitario === 'string' ? parseFloat(item.precoUnitario) : item.precoUnitario;
      return total + (preco || 0) * item.quantidade;
    }, 0);

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  if (carregando) return <p>Carregando histórico...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (!pedidos.length) {
    return (
      <div style={{ padding: 20 }}>
        {onVoltar && (
          <button onClick={onVoltar} style={{ marginBottom: 12 }}>← Voltar</button>
        )}
        <p>Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {/* ✅ BOTÃO VOLtar SÓ APARECE SE onVoltar EXISTIR */}
      {onVoltar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={onVoltar}>← Voltar</button>
          <h2 style={{ margin: 0 }}>📜 Meu Histórico</h2>
        </div>
      )}
      
      {/* ✅ TÍTULO SEM Botão voltar */}
      {!onVoltar && <h2>📜 Meu Histórico</h2>}

      {pedidos.map((pedido) => (
        <div
          key={pedido.pedidoId}
          style={{
            border: '1px solid #ccc',
            padding: 16,
            borderRadius: 10,
            marginBottom: 16,
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3>
            Pedido #{pedido.pedidoId} — {pedido.nomeRestaurante}
          </h3>
          <p>
            <strong>Status:</strong> {pedido.status} | <strong>Data:</strong> {formatarData(pedido.data)}
          </p>
          <ul>
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
          <p>
            <strong>Total:</strong> R$ {calcularTotal(pedido.itens).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoricoUsuario;