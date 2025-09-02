import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './TelaEntregador.css';

interface PedidoEntregador {
  id: number;               // ✅ Agora é "id" em vez de "pedidoId"
  status: string;
  clienteId: number;        // ✅ Adicionado
  restauranteId: number;    // ✅ Adicionado  
  data: string;             // ✅ Adicionado
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
      // ✅ Agora busca do endpoint correto
      const response = await api.get(`/api/pedidos/${pedidoId}`);
      setPedido(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      setErro('Pedido não encontrado ou erro ao carregar');
    } finally {
      setCarregando(false);
    }
  };

  // ✅ Funções temporárias - você vai implementar depois
  const abrirGoogleMapsRestaurante = () => {
    // Implemente depois quando tiver os dados de endereço
    alert('Funcionalidade de navegação será implementada em breve!');
  };

  const abrirGoogleMapsCliente = () => {
    // Implemente depois quando tiver os dados de endereço  
    alert('Funcionalidade de navegação será implementada em breve!');
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
        <h1>📦 Pedido #{pedido.id}</h1> {/* ✅ Mudou para pedido.id */}
        <div className={`status ${pedido.status.toLowerCase().replace(' ', '-')}`}>
          Status: {pedido.status}
        </div>
        <p>Data: {new Date(pedido.data).toLocaleString()}</p>
      </header>

      <div className="card">
        <h2>🏪 Restaurante</h2>
        <p>ID: {pedido.restauranteId}</p>
        <button 
          className="btn-navegar"
          onClick={abrirGoogleMapsRestaurante}
        >
          🗺️ Navegar até o Restaurante
        </button>
      </div>

      <div className="card">
        <h2>👤 Cliente</h2>
        <p>ID: {pedido.clienteId}</p>
        <button 
          className="btn-navegar"
          onClick={abrirGoogleMapsCliente}
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

      {/* ✅ Seção de debug - pode remover depois */}
      <div className="card debug">
        <h3>🔧 Dados Recebidos (Debug)</h3>
        <pre>{JSON.stringify(pedido, null, 2)}</pre>
      </div>
    </div>
  );
}

export default TelaEntregador;