// src/components/FinalizarPedido.tsx
import React, { useState } from 'react';
import api from '../services/api';

interface Produto { id: number; nome: string; preco: number; restauranteId: number; }
interface ItemCarrinho { produto: Produto; quantidade: number; }
interface FinalizarPedidoProps { carrinho: ItemCarrinho[]; usuarioId: number; onFinalizado: () => void; }

const FinalizarPedido: React.FC<FinalizarPedidoProps> = ({ carrinho, usuarioId, onFinalizado }) => {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const calcularTotal = () =>
    carrinho.reduce((tot, item) => tot + item.produto.preco * item.quantidade, 0);

  const finalizarPedido = async () => {
    console.log('[FinalizarPedido] DEV sem pagamento – iniciando');
    if (carrinho.length === 0) { setMensagem('Seu carrinho está vazio!'); return; }

    const restauranteId = carrinho[0].produto.restauranteId;
    if (carrinho.some(i => i.produto.restauranteId !== restauranteId)) {
      setMensagem('Todos os itens do pedido devem ser do mesmo restaurante.');
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      const payload = {
        usuarioId,
        restauranteId,
        itens: carrinho.map((i) => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
      };

      const res = await api.post('/pedidos', payload);
      console.log('[FinalizarPedido] Pedido criado:', res.data);

      // 🔒 DEV: não abre pagamento
      setMensagem(`Pedido #${res.data.id} criado com sucesso!`);
      onFinalizado();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Erro ao finalizar pedido';
      console.error('❌ Erro ao criar pedido', err?.response || err);
      setMensagem(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="finalizar-pedido">
      <div className="resumo-pedido">
        <h3>Resumo do Pedido</h3>
        {carrinho.map(item => (
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

      <button onClick={finalizarPedido} disabled={carregando} className="botao-pagamento">
        {carregando ? 'Processando...' : 'Finalizar Pedido (sem pagamento)'}
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
