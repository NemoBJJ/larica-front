// src/components/VerificarUsuario.tsx
import React from 'react';

const VerificarUsuario: React.FC = () => {
  const usuarioId = localStorage.getItem('usuarioId');
  const usuarioData = localStorage.getItem('usuarioData');

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
      <h3>🔍 Informações do Usuário Logado</h3>
      <p><strong>ID:</strong> {usuarioId || 'Nenhum usuário logado'}</p>
      <p><strong>Dados:</strong> {usuarioData || 'Nenhum dado encontrado'}</p>
      
      <h4>🎯 Todo o localStorage:</h4>
      <pre style={{ background: '#fff', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(localStorage, null, 2)}
      </pre>
    </div>
  );
};

export default VerificarUsuario;