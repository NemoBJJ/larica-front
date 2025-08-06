// src/components/CardapioRestaurante.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

interface CarrinhoItem {
  produto: Produto;
  quantidade: number;
}

interface CardapioRestauranteProps {
  restauranteId: number;
  nomeRestaurante: string;
  onVoltar: () => void;
}

const CardapioRestaurante: React.FC<CardapioRestauranteProps> = ({
  restauranteId,
  nomeRestaurante,
  onVoltar
}) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [statusPedido, setStatusPedido] = useState<string | null>(null);
  const [pagamento, setPagamento] = useState<'DINHEIRO' | 'PIX' | 'CARTAO_ENTREGA'>('DINHEIRO');

  // ajuste conforme seu auth/estado real
  const usuarioId = 1;

  useEffect(() => {
    setCarregando(true);
    api
      .get(`/api/produtos/por-restaurante/${restauranteId}`)
      .then((res) => setProdutos(res.data))
      .catch((err) => {
        console.error('Erro ao carregar produtos:', err);
        setErro('Erro ao carregar produtos.');
      })
      .finally(() => setCarregando(false));
  }, [restauranteId]);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produto.id === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
    setMensagem(`"${produto.nome}" adicionado ao carrinho!`);
    setTimeout(() => setMensagem(null), 2000);
  };

  const removerDoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produto.id === produto.id);
      if (!existente) return prev;
      if (existente.quantidade === 1) {
        return prev.filter((item) => item.produto.id !== produto.id);
      }
      return prev.map((item) =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      );
    });
  };

  // tenta /api/pedidos; se 404, tenta /pedidos
  const postPedidoComFallback = async (payload: any) => {
    try {
      return await api.post('/api/pedidos', payload);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        return await api.post('/pedidos', payload);
      }
      throw err;
    }
  };

  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      setMensagem('Seu carrinho está vazio!');
      return;
    }

    const total = carrinho.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0
    );

    const payload = {
      usuarioId,
      restauranteId,
      formaPagamento: pagamento, // DINHEIRO | PIX | CARTAO_ENTREGA
      itens: carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade
      }))
    };

    try {
      await postPedidoComFallback(payload);
      setMensagem('✅ Pedido finalizado com sucesso!');
      setStatusPedido(`Total: R$ ${total.toFixed(2)} | Pagamento: ${pagamento}`);
      setCarrinho([]);
      setTimeout(() => setMensagem(null), 6000);
    } catch (error: any) {
      console.error('❌ Erro ao finalizar pedido:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Erro ao finalizar pedido';
      setMensagem(`❌ ${errorMsg}`);
      setTimeout(() => setMensagem(null), 6000);
    }
  };

  if (carregando) return <p>Carregando cardápio...</p>;
  if (erro) return <p>{erro}</p>;

  const total = carrinho.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  );

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onVoltar}>Voltar</button>
      <h2>Cardápio de {nomeRestaurante}</h2>

      {mensagem && (
        <p style={{ color: mensagem.startsWith('✅') ? 'green' : 'red' }}>
          {mensagem}
        </p>
      )}

      {produtos.length === 0 ? (
        <p>Este restaurante ainda não possui produtos cadastrados.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id} style={{ marginBottom: '15px' }}>
              <h4>{produto.nome}</h4>
              <p>{produto.descricao}</p>
              <p>R$ {produto.preco.toFixed(2)}</p>
              <button
                onClick={() => adicionarAoCarrinho(produto)}
                style={{ color: '#000', fontWeight: 'bold' }}
              >
                ➕
              </button>
            </li>
          ))}
        </ul>
      )}

      {carrinho.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3>🛒 Carrinho</h3>
          <ul>
            {carrinho.map((item) => (
              <li key={item.produto.id} style={{ marginBottom: '10px' }}>
                <strong>{item.produto.nome}</strong> — R$ {item.produto.preco.toFixed(2)} × {item.quantidade}
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <button
                    onClick={() => adicionarAoCarrinho(item.produto)}
                    style={{ color: '#000', fontWeight: 'bold' }}
                  >
                    ➕
                  </button>
                  <button
                    onClick={() => removerDoCarrinho(item.produto)}
                    style={{ marginLeft: '5px' }}
                  >
                    ➖
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>

          <label style={{ marginTop: '10px', display: 'block' }}>
            Forma de Pagamento:
            <select
              value={pagamento}
              onChange={(e) =>
                setPagamento(e.target.value as 'DINHEIRO' | 'PIX' | 'CARTAO_ENTREGA')
              }
              style={{ marginLeft: '10px' }}
            >
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">Pix</option>
              <option value="CARTAO_ENTREGA">Cartão na Entrega</option>
            </select>
          </label>

          <button onClick={finalizarPedido} style={{ marginTop: '10px' }}>
            Finalizar Pedido
          </button>
        </div>
      )}

      {statusPedido && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderTop: '1px solid #aaa'
          }}
        >
          <p><strong>Status do Pedido:</strong> {statusPedido}</p>
        </div>
      )}
    </div>
  );
};

export default CardapioRestaurante;
