import React, { useState } from 'react';
import HistoricoPedidos from './HistoricoPedidos';

const DashboardCliente: React.FC = () => {
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const usuarioId = 1; // ⚠️ Fixo por enquanto

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎯 Área do Cliente</h1>

      {!mostrarHistorico ? (
        <>
          <button onClick={() => setMostrarHistorico(true)}>
            Ver Histórico de Pedidos
          </button>
        </>
      ) : (
        <HistoricoPedidos
          usuarioId={usuarioId}
          onVoltar={() => setMostrarHistorico(false)}
        />
      )}
    </div>
  );
};

export default DashboardCliente;
