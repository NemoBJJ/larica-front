import React, { useState } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  restauranteId: number;
  linkPagamento?: string; // Adicionando campo opcional para link de pagamento
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

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  };

  const gerarLinkPagamento = (total: number) => {
    // Link base do Mercado Pago com parâmetro de valor
    const linkBase = 'https://mpago.la/1kiC4gC';
    const valorFormatado = total.toFixed(2).replace('.', '');
    return `${linkBase}?amount=${valorFormatado}`;
  };

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

    try {
      // 1. Calcular o total do pedido
      const totalPedido = calcularTotal();

      // 2. Gerar link de pagamento dinâmico
      const linkPagamento = gerarLinkPagamento(totalPedido);

      // 3. Criar o pedido no backend
      const payload = {
        usuarioId,
        restauranteId,
        valorTotal: totalPedido,
        linkPagamento, // Incluindo o link no payload
        itens: carrinho.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
        })),
      };

      const res = await api.post('/pedidos', payload);

      // 4. Redirecionar para o pagamento
      window.open(linkPagamento, '_blank');

      setMensagem(`Pedido #${res.data.id} realizado com sucesso! Redirecionando para pagamento...`);
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
      <div className="resumo-pedido">
        <h3>Resumo do Pedido</h3>
        {carrinho.map((item) => (
          <div key={item.produto.id} className="item-pedido">
            <span>{item.produto.nome}</span>
            <span>{item.quantidade}x R${item.produto.preco.toFixed(2)}</span>
          </div>
        ))}
        <div className="total-pedido">
          <strong>Total:</strong>
          <strong>R${calcularTotal().toFixed(2)}</strong>
        </div>
      </div>

      <button
        onClick={finalizarPedido}
        disabled={carregando}
        className="botao-pagamento"
      >
        {carregando ? 'Processando...' : 'Finalizar e Pagar'}
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
