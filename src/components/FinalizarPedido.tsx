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

    // garante que todos os itens são do mesmo restaurante
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

    // payload exatamente como o backend espera
    const payload = {
      usuarioId,
      restauranteId,
      itens: carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      })),
    };

    try {
      // tenta /pedidos
      const res1 = await api.post('/pedidos', payload);
      setMensagem(`Pedido #${res1.data.id} realizado com sucesso!`);
      onFinalizado();
    } catch (err1: any) {
      if (err1?.response?.status === 404) {
        // fallback /api/pedidos
        try {
          const res2 = await api.post('/api/pedidos', payload);
          setMensagem(`Pedido #${res2.data.id} realizado com sucesso!`);
          onFinalizado();
        } catch (err2: any) {
          const errorMsg =
            err2?.response?.data?.message ||
            err2?.response?.data ||
            err2?.message ||
            'Erro ao finalizar pedido';
          setMensagem(errorMsg);
          console.error('❌ Erro detalhado (fallback):', err2.response || err2);
        } finally {
          setCarregando(false);
        }
        return;
      }

      const errorMsg =
        err1?.response?.data?.message ||
        err1?.response?.data ||
        err1?.message ||
        'Erro ao finalizar pedido';
      setMensagem(errorMsg);
      console.error('❌ Erro detalhado:', err1.response || err1);
      setCarregando(false);
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
