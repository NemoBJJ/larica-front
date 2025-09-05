import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HistoricoUsuario.css';

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
  onVoltar?: () => void;
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

  if (carregando) {
    return (
      <div className="historico-container">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="historico-container">
        <div className="historico-empty">{erro}</div>
      </div>
    );
  }

  if (!pedidos.length) {
    return (
      <div className="historico-container">
        {onVoltar && (
          <div className="historico-header">
            <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
            <h2>📜 Meu Histórico</h2>
          </div>
        )}
        {!onVoltar && <h2 className="historico-header" style={{ margin: 0 }}>📜 Meu Histórico</h2>}

        <div className="historico-empty">Nenhum pedido encontrado.</div>
      </div>
    );
  }

  return (
    <div className="historico-container">
      {onVoltar ? (
        <div className="historico-header">
          <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
          <h2>📜 Meu Histórico</h2>
        </div>
      ) : (
        <div className="historico-header">
          <h2>📜 Meu Histórico</h2>
        </div>
      )}

      {pedidos.map((pedido) => (
        <div key={pedido.pedidoId} className="pedido-card">
          <h3>Pedido #{pedido.pedidoId} — {pedido.nomeRestaurante}</h3>
          <p className="pedido-meta">
            <strong>Status:</strong> {pedido.status} &nbsp;|&nbsp; <strong>Data:</strong> {formatarData(pedido.data)}
          </p>

          <ul className="pedido-itens">
            {pedido.itens.map((item) => {
              const preco = typeof item.precoUnitario === 'string'
                ? parseFloat(item.precoUnitario)
                : item.precoUnitario;
              return (
                <li key={item.id}>
                  <span>{item.quantidade}× {item.nomeProduto}</span>
                  <span>R$ {preco.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>

          <div className="pedido-total">
            <span>Total</span>
            <span>R$ {calcularTotal(pedido.itens).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricoUsuario;
