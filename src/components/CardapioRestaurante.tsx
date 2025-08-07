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
        const response = await api.get(`/api/produtos/por-restaurante/${restauranteId}`);
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

  const fazerPedido = async () => {
    const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1');
    const pedido: PedidoRequest = {
      usuarioId,
      restauranteId,
      itens: carrinho.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantidade,
      })),
    };

    try {
      await api.post('/pedidos', pedido);
      setCarrinho([]);
      setMensagemSucesso('✅ Pedido realizado com sucesso!');
      setTimeout(() => setMensagemSucesso(null), 4000); // limpa após 4s
    } catch (error) {
      console.error('Erro ao fazer pedido:', error);
      alert('Erro ao realizar pedido.');
    }
  };

  return (
    <div className="cardapio-container">
      <button className="voltar-btn" onClick={onVoltar}>← Voltar</button>
      <h2 className="titulo-cardapio">Cardápio de {nomeRestaurante}</h2>

      {erro && <p className="erro-cardapio">{erro}</p>}
      {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}

      <ul className="cardapio-list">
        {cardapio.map((produto) => (
          <li className="cardapio-item" key={produto.id}>
            <strong>{produto.nome}</strong>
            <em>{produto.descricao}</em>
            <span>R$ {produto.preco.toFixed(2)}</span>
            <button className="adicionar-btn" onClick={() => adicionarAoCarrinho(produto.id)}>Adicionar</button>
          </li>
        ))}
      </ul>

      {carrinho.length > 0 && (
        <div className="carrinho-section">
          <h3>Carrinho</h3>
          <ul>
            {carrinho.map((item) => {
              const produto = cardapio.find((p) => p.id === item.id);
              return (
                <li key={item.id}>
                  {produto?.nome} — {item.quantidade}x R$ {(produto?.preco || 0).toFixed(2)}
                </li>
              );
            })}
          </ul>
          <button className="finalizar-btn" onClick={fazerPedido}>Finalizar Pedido</button>
        </div>
      )}
    </div>
  );
};

export default CardapioRestaurante;
