import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Pedido {
  id: number;
  data: string;   // LocalDateTime do backend
  status: string;
}

interface ItemPedidoDTO {
  id: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number | string;
}

interface AcompanhamentoPedidoProps {
  usuarioId: number;
}

const AcompanhamentoPedido: React.FC<AcompanhamentoPedidoProps> = ({ usuarioId }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<ItemPedidoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchPedidoEItens = async () => {
      try {
        setCarregando(true);

        // 1) último pedido: /pedidos/ultimo/{usuarioId} (fallback para /api/..)
        let pedidoData: Pedido;
        try {
          const pedidoRes = await api.get(`/pedidos/ultimo/${usuarioId}`);
          pedidoData = pedidoRes.data;
        } catch (err1: any) {
          if (err1?.response?.status === 404) {
            const pedidoRes2 = await api.get(`/api/pedidos/ultimo/${usuarioId}`);
            pedidoData = pedidoRes2.data;
          } else {
            throw err1;
          }
        }
        setPedido(pedidoData);

        // 2) itens do pedido: /pedidos/{id}/itens (fallback para /api/pedidos/{id}/itens)
        try {
          const itensRes = await api.get<ItemPedidoDTO[]>(`/pedidos/${pedidoData.id}/itens`);
          setItens(itensRes.data || []);
        } catch (errI1: any) {
          if (errI1?.response?.status === 404) {
            const itensRes2 = await api.get<ItemPedidoDTO[]>(`/api/pedidos/${pedidoData.id}/itens`);
            setItens(itensRes2.data || []);
          } else {
            throw errI1;
          }
        }
      } catch (error) {
        console.error('Erro ao buscar pedido/itens:', error);
        setPedido(null);
        setItens([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchPedidoEItens();
  }, [usuarioId]);

  if (carregando) return <p>Carregando pedido...</p>;
  if (!pedido) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: 10 }}>
      <h2>📦 Status do Pedido</h2>
      <p><strong>Status:</strong> {pedido.status}</p>
      <p><strong>Data:</strong> {new Date(pedido.data).toLocaleString()}</p>

      <h3>🧾 Itens do Pedido:</h3>
      <ul>
        {itens.map((item) => {
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
  );
};

export default AcompanhamentoPedido;
