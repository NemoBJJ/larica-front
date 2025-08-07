import React, { useState } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  restauranteId: number;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface FinalizarPedidoProps {
  carrinho: ItemCarrinho[];
  usuarioId: number;
  onFinalizado: () => void;
}

const FinalizarPedido: React.FC<FinalizarPedidoProps> = ({
  carrinho,
  usuarioId,
  onFinalizado
}) => {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      setMensagem('Seu carrinho está vazio!');
      return;
    }

    const restauranteId = carrinho[0].produto.restauranteId;
    const restauranteDiferente = carrinho.some(
      (i) => i.produto.restauranteId !== restauranteId
    );
    if (restauranteDiferente) {
      setMensagem('Todos os itens do pedido devem ser do mesmo restaurante.');
      return;
    }

    setCarregando(true);
    setMensagem('');

    const payload = {
      usuarioId,
      restauranteId,
      itens: carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      })),
    };

    try {
      const res = await api.post('/pedidos', payload);
      setMensagem(`Pedido #${res.data.id} realizado com sucesso!`);
      onFinalizado();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Erro ao finalizar pedido';
      setMensagem(errorMsg);
      console.error('❌ Erro detalhado:', err.response || err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="finalizar-pedido">
      <button onClick={finalizarPedido} disabled={carregando}>
        {carregando ? 'Processando...' : 'Finalizar Pedido'}
      </button>
      {mensagem && (
        <p className={mensagem.toLowerCase().includes('sucesso') ? 'sucesso' : 'erro'}>
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default FinalizarPedido;
