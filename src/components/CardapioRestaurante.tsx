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

const CardapioRestaurante: React.FC<CardapioRestauranteProps> = ({ restauranteId, nomeRestaurante, onVoltar }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [statusPedido, setStatusPedido] = useState<string | null>(null);
  const [totalPedido, setTotalPedido] = useState<number>(0);
  const [pagamento, setPagamento] = useState<string>('DINHEIRO');

  const usuarioId = 1; // fixo por enquanto

  useEffect(() => {
    api.get(`/produtos/por-restaurante/${restauranteId}`)
      .then((res) => setProdutos(res.data))
      .catch((err) => {
        console.error('Erro ao carregar produtos:', err);
        setErro('Erro ao carregar produtos.');
      })
      .finally(() => setCarregando(false));
  }, [restauranteId]);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const existente = prev.find(item => item.produto.id === produto.id);
      if (existente) {
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prev, { produto, quantidade: 1 }];
      }
    });
    setMensagem(`"${produto.nome}" adicionado ao carrinho!`);
    setTimeout(() => setMensagem(null), 2000);
  };

  const removerDoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const existente = prev.find(item => item.produto.id === produto.id);
      if (!existente) return prev;

      if (existente.quantidade === 1) {
        return prev.filter(item => item.produto.id !== produto.id);
      } else {
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      }
    });
  };

  const finalizarPedido = async () => {
    try {
      const pedido = {
        usuarioId: usuarioId,
        restauranteId: restauranteId,
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      };

      console.log("➡️ Payload enviado:", JSON.stringify(pedido, null, 2));

      const response = await api.post('/pedidos', pedido);

      setMensagem('✅ Pedido finalizado com sucesso!');
      setStatusPedido(`ID: ${response.data.id} | Total: R$ ${total.toFixed(2)} | Pagamento: ${pagamento}`);
      setTotalPedido(total);
      setCarrinho([]);
    } catch (error) {
      console.error('❌ Erro ao finalizar pedido:', error);
      setMensagem('❌ Erro ao finalizar pedido.');
    }
  };

  if (carregando) return <p>Carregando cardápio...</p>;
  if (erro) return <p>{erro}</p>;

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onVoltar}>Voltar</button>
      <h2>Cardápio de {nomeRestaurante}</h2>

      {mensagem && <p style={{ color: mensagem.startsWith('✅') ? 'green' : 'red' }}>{mensagem}</p>}

      {produtos.length === 0 ? (
        <p>Este restaurante ainda não possui produtos cadastrados.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id} style={{ marginBottom: '15px' }}>
              <h4>{produto.nome}</h4>
              <p>{produto.descricao}</p>
              <p>R$ {produto.preco.toFixed(2)}</p>
              <button onClick={() => adicionarAoCarrinho(produto)}>➕</button>
            </li>
          ))}
        </ul>
      )}

      {carrinho.length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>🛒 Carrinho</h3>
          <ul>
            {carrinho.map((item) => (
              <li key={item.produto.id} style={{ marginBottom: '10px' }}>
                <strong>{item.produto.nome}</strong> — R$ {item.produto.preco.toFixed(2)} × {item.quantidade}
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <button onClick={() => adicionarAoCarrinho(item.produto)}>➕</button>
                  <button onClick={() => removerDoCarrinho(item.produto)} style={{ marginLeft: '5px' }}>➖</button>
                </div>
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>

          <label style={{ marginTop: '10px', display: 'block' }}>
            Forma de Pagamento:
            <select value={pagamento} onChange={(e) => setPagamento(e.target.value)} style={{ marginLeft: '10px' }}>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">Pix</option>
              <option value="CARTAO_ENTREGA">Cartão na Entrega</option>
            </select>
          </label>

          <button onClick={finalizarPedido} style={{ marginTop: '10px' }}>Finalizar Pedido</button>
        </div>
      )}

      {statusPedido && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid #aaa' }}>
          <p><strong>Status do Pedido:</strong> {statusPedido}</p>
        </div>
      )}
    </div>
  );
};

export default CardapioRestaurante;
