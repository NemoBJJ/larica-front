// src/components/CardapioRestaurante.tsx
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
  const [capturandoLocalizacao, setCapturandoLocalizacao] = useState(false);

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

  // ✅ Captura a localização e SALVA no localStorage
  const capturarLocalizacao = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada pelo seu navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // ✅ SALVA NO LOCALSTORAGE para reutilizar depois
          localStorage.setItem('clienteLatitude', lat.toString());
          localStorage.setItem('clienteLongitude', lng.toString());
          console.log('📍 Localização salva no localStorage:', { lat, lng });
          resolve({ lat, lng });
        },
        (error) => {
          let errorMessage = 'Erro ao capturar localização. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Você precisa permitir o acesso à localização.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Informação de localização indisponível.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Tempo limite excedido. Tente novamente.';
              break;
            default:
              errorMessage += error.message;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const fazerPedido = async () => {
    setCarregando(true);
    setErro(null);
    setMensagemSucesso(null);
    setCapturandoLocalizacao(true);

    let clienteLat = null;
    let clienteLng = null;
    
    // ✅ TENTA PEGAR DO LOCALSTORAGE PRIMEIRO
    const savedLat = localStorage.getItem('clienteLatitude');
    const savedLng = localStorage.getItem('clienteLongitude');
    
    if (savedLat && savedLng) {
      clienteLat = parseFloat(savedLat);
      clienteLng = parseFloat(savedLng);
      console.log('📍 Localização recuperada do localStorage:', { clienteLat, clienteLng });
    } else {
      // Se não tem no localStorage, captura agora
      try {
        const posicao = await capturarLocalizacao();
        clienteLat = posicao.lat;
        clienteLng = posicao.lng;
      } catch (locationError: any) {
        console.warn('⚠️ Não foi possível capturar localização:', locationError.message);
      }
    }

    try {
      const payload: any = {
        usuarioId,
        restauranteId,
        itens: carrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
      };

      if (clienteLat && clienteLng) {
        payload.clienteLatitude = clienteLat;
        payload.clienteLongitude = clienteLng;
      }

      const pedidoRes = await api.post('/pedidos', payload);
      const pedidoId = pedidoRes.data.id;

      const pagamentoRes = await api.post(`/pagamentos/mercadopago/preference/${pedidoId}`);
      const initPoint = pagamentoRes.data.initPoint;

      window.open(initPoint, '_blank');
      setCarrinho([]);
      setMensagemSucesso(`✅ Pedido #${pedidoId} realizado! Redirecionando para pagamento...`);
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (error: any) {
      console.error('Erro ao fazer pedido:', error);
      const mensagem = error?.response?.data?.message || 'Erro ao realizar pedido. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
      setCapturandoLocalizacao(false);
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
      {capturandoLocalizacao && (
        <div className="mensagem-info">📍 Capturando sua localização para a rota do entregador...</div>
      )}

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
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        >
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
            <button
              className="finalizar-btn"
              onClick={fazerPedido}
              disabled={carregando}
            >
              {carregando ? 'Processando...' : 'Finalizar Pedido e Pagar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardapioRestaurante;