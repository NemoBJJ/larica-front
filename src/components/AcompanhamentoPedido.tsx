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
  produto: Produto;
}

interface Pedido {
  id: number;
  data: string;
  status: string;
}

interface AcompanhamentoPedidoProps {
  usuarioId: number;
}

const AcompanhamentoPedido: React.FC<AcompanhamentoPedidoProps> = ({ usuarioId }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchPedidoEItens = async () => {
      try {
        // Buscar último pedido
        const pedidoRes = await api.get(`/pedidos/ultimo/${usuarioId}`);
        const pedidoData: Pedido = pedidoRes.data;
        setPedido(pedidoData);

        // Buscar itens do pedido
        const itensRes = await api.get(`/itens-pedido/pedido/${pedidoData.id}`);
        setItens(itensRes.data);
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
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
        {itens.map((item) => (
          <li key={item.id}>
            {item.produto.nome} — R$ {item.produto.preco.toFixed(2)} × {item.quantidade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcompanhamentoPedido;
