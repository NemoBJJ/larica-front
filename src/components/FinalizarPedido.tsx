import React, { useState } from 'react';
import axios from 'axios';

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

const FinalizarPedido: React.FC<FinalizarPedidoProps> = ({ carrinho, usuarioId, onFinalizado }) => {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      setMensagem('Seu carrinho está vazio!');
      return;
    }

    setCarregando(true);
    setMensagem('');

    const payload = {
      usuarioId: usuarioId,
      restauranteId: carrinho[0].produto.restauranteId,
      itens: carrinho.map(item => ({
        produtoId: item?.produto?.id,
        quantidade: item.quantidade
      }))
    };

    console.log("🟨 Payload sendo enviado:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post('http://localhost:8086/pedidos', payload);

      setMensagem(`Pedido #${response.data.id} realizado com sucesso!`);
      onFinalizado(); // Limpa carrinho ou redireciona
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ||
                     error.response?.data ||
                     error.message ||
                     'Erro ao finalizar pedido';
      setMensagem(errorMsg);
      console.error('❌ Erro detalhado:', error.response || error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="finalizar-pedido">
      <button
        onClick={finalizarPedido}
        disabled={carregando}
      >
        {carregando ? 'Processando...' : 'Finalizar Pedido'}
      </button>

      {mensagem && (
        <p className={mensagem.includes('sucesso') ? 'sucesso' : 'erro'}>
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default FinalizarPedido;
