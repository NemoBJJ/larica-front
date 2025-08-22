// src/components/CardapioRestaurante.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './CardapioRestaurante.css';

interface Props {
  restauranteId: number;
  nomeRestaurante: string;
  onVoltar: () => void;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

interface PedidoRequest {
  usuarioId: number;
  restauranteId: number;
  valorTotal: number;
  linkPagamento: string;
  itens: {
    produtoId: number;
    quantidade: number;
  }[];
}

const CardapioRestaurante: React.FC<Props> = ({ restauranteId, nomeRestaurante, onVoltar }) => {
  const [cardapio, setCardapio] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<{ id: number; quantidade: number }[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  useEffect(() => {
    const carregarCardapio = async () => {
      try {
        // ✅ SEM /api aqui (baseURL já tem /api)
        const response = await api.get(`/produtos/por-restaurante/${restauranteId}`);
        setCardapio(response.data);
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar cardápio:', error);
        setErro('Erro ao carregar cardápio. Verifique a conexão ou o ID do restaurante.');
      }
    };

    carregarCardapio();
  }, [restauranteId]);

  const adicionarAoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.id === produtoId);
      if (existente) {
        return prev.map((item) =>
          item.id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { id: produtoId, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const produto = cardapio.find((p) => p.id === item.id);
      return total + ((produto?.preco || 0) * item.quantidade);
    }, 0);
  };

  const fazerPedido = async () => {
    const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1', 10);
    const totalPedido = calcularTotal();
    const linkPagamento = `https://mpago.la/1kiC4gC?amount=${(totalPedido * 100).toFixed(0)}`;

    const pedido: PedidoRequest = {
      usuarioId,
      restauranteId,
      valorTotal: totalPedido,
      linkPagamento,
      itens: carrinho.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantidade,
      })),
    };

    try {
      // ✅ endpoint correto (sem /api no início)
      const response = await api.post('/pedidos', pedido);
      window.open(linkPagamento, '_blank');
      setCarrinho([]);
      setMensagemSucesso(`✅ Pedido #${response.data.id} realizado! Redirecionando para pagamento...`);
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (error) {
      console.error('Erro ao fazer pedido:', error);
      setErro('Erro ao realizar pedido. Tente novamente.');
    }
  };

  return (
    <div className="cardapio-container">
      <button className="voltar-btn" onClick={onVoltar}>
        ← Voltar
      </button>
      <h2 className="titulo-cardapio">Cardápio de {nomeRestaurante}</h2>

      {erro && <div className="erro-cardapio">{erro}</div>}
      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}

      <div className="cardapio-content">
        <ul className="cardapio-list">
          {cardapio.map((produto) => (
            <li className="cardapio-item" key={produto.id}>
              <div className="produto-info">
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <span>R$ {produto.preco.toFixed(2)}</span>
              </div>
              <button
                className="adicionar-btn"
                onClick={() => adicionarAoCarrinho(produto.id)}
              >
                Adicionar
              </button>
            </li>
          ))}
        </ul>

        {carrinho.length > 0 && (
          <div className="carrinho-section">
            <h3>Seu Carrinho</h3>
            <ul className="carrinho-list">
              {carrinho.map((item) => {
                const produto = cardapio.find((p) => p.id === item.id);
                const subtotal = ((produto?.preco || 0) * item.quantidade).toFixed(2);
                return (
                  <li key={item.id} className="carrinho-item">
                    <div className="carrinho-item-info">
                      <span>{produto?.nome}</span>
                      <div className="quantidade-control">
                        <button onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}>
                          -
                        </button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}>
                          +
                        </button>
                      </div>
                      <span>R$ {subtotal}</span>
                    </div>
                    <button
                      className="remover-btn"
                      onClick={() => removerDoCarrinho(item.id)}
                    >
                      Remover
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="carrinho-total">
              <span>Total:</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
            <button className="finalizar-btn" onClick={fazerPedido}>
              Finalizar Pedido e Pagar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardapioRestaurante;
