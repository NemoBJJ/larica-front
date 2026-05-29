import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './CardapioRestaurante.css';

interface Props {
  restauranteId: number;
  nomeRestaurante: string;
  onVoltar: () => void;
  usuarioId: number;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl?: string;
}

interface ItemCarrinho {
  id: number;
  quantidade: number;
}

const CardapioRestaurante: React.FC<Props> = ({ 
  restauranteId, 
  nomeRestaurante, 
  onVoltar, 
  usuarioId 
}) => {
  const [cardapio, setCardapio] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<'online' | 'entrega'>('online');

  useEffect(() => {
    const carregarCardapio = async () => {
      try {
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
          item.id === produtoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
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
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
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
    setCarregando(true);
    setErro(null);
    setMensagemSucesso(null);

    if (carrinho.length === 0) {
      setErro('Seu carrinho está vazio!');
      setCarregando(false);
      return;
    }

    try {
      const payload = {
        usuarioId,
        restauranteId,
        itens: carrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
      };

      const pedidoRes = await api.post('/pedidos', payload);
      const pedidoId = pedidoRes.data.id;

      // 🔥 SE FOR PAGAMENTO ONLINE, ABRE MERCADO PAGO
      if (formaPagamento === 'online') {
        const pagamentoRes = await api.post(`/pagamentos/mercadopago/preference/${pedidoId}`);
        const initPoint = pagamentoRes.data.initPoint;
        window.open(initPoint, '_blank');
        setMensagemSucesso(`✅ Pedido #${pedidoId} realizado! Redirecionando para pagamento...`);
      } 
      // 🔥 SE FOR PAGAR NA ENTREGA, NÃO ABRE MERCADO PAGO
      else {
        setMensagemSucesso(`✅ Pedido #${pedidoId} realizado! Você pagará na entrega. O restaurante já foi notificado.`);
      }
      
      setCarrinho([]);
      setTimeout(() => setMensagemSucesso(null), 5000);
      
    } catch (error: any) {
      console.error('Erro ao fazer pedido:', error);
      const mensagem = error?.response?.data?.message || 'Erro ao realizar pedido. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
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
                {produto.imagemUrl && (
                  <img 
                    src={produto.imagemUrl} 
                    alt={produto.nome}
                    className="produto-imagem"
                    style={{ 
                      width: '100%', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                  />
                )}
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
            
            {/* 🔥 OPÇÕES DE PAGAMENTO */}
            <div className="pagamento-opcoes" style={{ marginBottom: '15px', padding: '10px', background: '#1a1a1a', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="pagamento"
                  value="online"
                  checked={formaPagamento === 'online'}
                  onChange={() => setFormaPagamento('online')}
                />
                <span>💳 Pagar agora (PIX/Cartão) - Mercado Pago</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="pagamento"
                  value="entrega"
                  checked={formaPagamento === 'entrega'}
                  onChange={() => setFormaPagamento('entrega')}
                />
                <span>💰 Pagar na entrega (Dinheiro/PIX na hora)</span>
              </label>
            </div>

            <ul className="carrinho-list">
              {carrinho.map((item) => {
                const produto = cardapio.find((p) => p.id === item.id);
                const subtotal = ((produto?.preco || 0) * item.quantidade).toFixed(2);
                
                return (
                  <li key={item.id} className="carrinho-item">
                    <div className="carrinho-item-info">
                      <span>{produto?.nome}</span>
                      <div className="quantidade-control">
                        <button onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}>-</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}>+</button>
                      </div>
                      <span>R$ {subtotal}</span>
                    </div>
                    <button className="remover-btn" onClick={() => removerDoCarrinho(item.id)}>
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
            <button
              className="finalizar-btn"
              onClick={fazerPedido}
              disabled={carregando}
            >
              {carregando ? 'Processando...' : formaPagamento === 'online' ? 'Finalizar Pedido e Pagar' : 'Confirmar Pedido (Pagar na Entrega)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardapioRestaurante;