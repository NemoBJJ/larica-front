// src/components/TelaEntregador.tsx
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

const TelaEntregador: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [pedido, setPedido] = useState<PedidoEntregador | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPedido = async () => {
    if (!pedidoId) {
      setErro('ID do pedido inválido');
      setCarregando(false);
      return;
    }
    try {
      setCarregando(true);
      const response = await api.get<PedidoEntregador>(`/api/entregador/pedido/${pedidoId}`);
      setPedido(response.data);
      setErro('');
    } catch (e) {
      console.error('Erro ao carregar pedido:', e);
      setErro('Pedido não encontrado ou erro ao carregar');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPedido();
  }, [pedidoId]);

  const abrirGoogleMapsRestaurante = () => {
    if (pedido) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pedido.latRestaurante},${pedido.lngRestaurante}`;
      window.open(url, '_blank');
    }
  };

  const abrirGoogleMapsCliente = () => {
    if (pedido && pedido.latCliente && pedido.lngCliente) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pedido.latCliente},${pedido.lngCliente}`;
      window.open(url, '_blank');
    }
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
        <p>Endereço: {pedido.enderecoRestaurante}</p>
        <button className="btn-navegar" onClick={abrirGoogleMapsRestaurante}>
          🗺️ Navegar até o Restaurante
        </button>
      </div>

      <div className="card">
        <h2>👤 Cliente</h2>
        <p>Endereço: {pedido.enderecoCliente}</p>
        <button className="btn-navegar" onClick={abrirGoogleMapsCliente}>
          🗺️ Navegar até o Cliente
        </button>
      </div>

      <div className="acoes">
        <button className="btn-atualizar" onClick={carregarPedido}>
          🔄 Atualizar Status
        </button>
        <Link to="/" className="btn-voltar">Voltar para Início</Link>
      </div>

      <div className="card debug">
        <h3>🔧 Dados Recebidos (Debug)</h3>
        <pre>{JSON.stringify(pedido, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TelaEntregador;