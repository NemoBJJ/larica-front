import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './TelaEntregador.css';

interface PedidoEntregador {
  pedidoId: number;
  status: string;
  enderecoRestaurante: string;
  latRestaurante: number;
  lngRestaurante: number;
  enderecoCliente: string;
  latCliente: number;
  lngCliente: number;
}

function TelaEntregador() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [pedido, setPedido] = useState<PedidoEntregador | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarPedido();
  }, [pedidoId]);

  const carregarPedido = async () => {
    try {
      setCarregando(true);
    const response = await api.get(`/api/entregador/pedido/${pedidoId}`);
      setPedido(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      setErro('Pedido não encontrado ou erro ao carregar');
    } finally {
      setCarregando(false);
    }
  };

  const abrirGoogleMaps = (lat: number, lng: number, endereco: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`;
    window.open(url, '_blank');
  };

  if (carregando) {
    return <div className="container">Carregando pedido #{pedidoId}...</div>;
  }

  if (erro || !pedido) {
    return (
      <div className="container">
        <div className="erro">{erro || 'Pedido não encontrado'}</div>
        <Link to="/" className="btn-voltar">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container-entregador">
      <header className="header-entregador">
        <h1>📦 Pedido #{pedido.pedidoId}</h1>
        <div className={`status ${pedido.status.toLowerCase().replace(' ', '-')}`}>
          Status: {pedido.status}
        </div>
      </header>

      <div className="card">
        <h2>🏪 Restaurante</h2>
        <p>{pedido.enderecoRestaurante}</p>
        <button 
          className="btn-navegar"
          onClick={() => abrirGoogleMaps(pedido.latRestaurante, pedido.lngRestaurante, pedido.enderecoRestaurante)}
        >
          🗺️ Navegar até o Restaurante
        </button>
      </div>

      <div className="card">
        <h2>👤 Cliente</h2>
        <p>{pedido.enderecoCliente}</p>
        <button 
          className="btn-navegar"
          onClick={() => abrirGoogleMaps(pedido.latCliente, pedido.lngCliente, pedido.enderecoCliente)}
        >
          🗺️ Navegar até o Cliente
        </button>
      </div>

      <div className="acoes">
        <button className="btn-atualizar" onClick={carregarPedido}>
          🔄 Atualizar Status
        </button>
        <Link to="/" className="btn-voltar">Voltar para Início</Link>
      </div>
    </div>
  );
}

export default TelaEntregador;