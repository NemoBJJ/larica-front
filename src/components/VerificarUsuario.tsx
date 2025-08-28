import React from 'react';

const VerificarUsuario: React.FC = () => {
  // Dados do localStorage
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const usuarioIdSeparado = localStorage.getItem('usuarioId');
  
  // Parsear dados do usuário
  let usuarioId = 'Nenhum usuário logado';
  let usuarioNome = 'Nenhum nome encontrado';
  let usuarioEmail = 'Nenhum email encontrado';
  let usuarioTipo = 'Nenhum tipo encontrado';
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      usuarioId = user?.id || 'ID não encontrado';
      usuarioNome = user?.nome || 'Nome não encontrado';
      usuarioEmail = user?.email || 'Email não encontrado';
      usuarioTipo = user?.tipo || 'Tipo não encontrado';
    } catch (error) {
      console.error('Erro ao parsear user data:', error);
    }
  }

  // Verificar se o token é válido (baseado no formato)
  const tokenValido = token && token.length > 50; // Verificação básica

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px', margin: '20px' }}>
      <h3>🔍 Informações do Usuário Logado</h3>
      
      {/* Status do Token */}
      <div style={{ 
        padding: '10px', 
        marginBottom: '15px', 
        background: tokenValido ? '#e8f5e8' : '#ffeaea',
        borderRadius: '5px',
        border: `2px solid ${tokenValido ? '#4caf50' : '#ff4757'}`
      }}>
        <strong>Token JWT:</strong> {tokenValido ? '✅ VÁLIDO' : '❌ INVÁLIDO/AUSENTE'}
        {token && (
          <div style={{ fontSize: '12px', marginTop: '5px', wordBreak: 'break-all' }}>
            <strong>Token:</strong> {token.substring(0, 50)}...
          </div>
        )}
      </div>

      {/* Informações do Usuário */}
      <div style={{ 
        padding: '15px', 
        marginBottom: '15px', 
        background: '#fff', 
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h4>👤 Dados do Usuário</h4>
        <p><strong>ID:</strong> {usuarioId}</p>
        <p><strong>Nome:</strong> {usuarioNome}</p>
        <p><strong>Email:</strong> {usuarioEmail}</p>
        <p><strong>Tipo:</strong> {usuarioTipo}</p>
        <p><strong>ID Separado:</strong> {usuarioIdSeparado || '❌ Não encontrado'}</p>
      </div>

      {/* Ações */}
      <div style={{ 
        padding: '15px', 
        marginBottom: '15px', 
        background: '#e3f2fd', 
        borderRadius: '5px'
      }}>
        <h4>⚡ Ações Rápidas</h4>
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioId');
            alert('Login limpo! Atualizando página...');
            window.location.reload();
          }}
          style={{ 
            padding: '8px 15px', 
            background: '#ff4757', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🗑️ Limpar Login
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '8px 15px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🔄 Atualizar Página
        </button>

        <button 
          onClick={() => {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const user = JSON.parse(userData);
                console.log('🔍 Dados do usuário no console:');
                console.log('User Object:', user);
                console.log('Token:', localStorage.getItem('token'));
                alert('Dados logados no console (F12)');
              } catch (error) {
                console.error('Erro:', error);
              }
            }
          }}
          style={{ 
            padding: '8px 15px', 
            background: '#663399', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📋 Log no Console
        </button>
      </div>

      {/* Todo o localStorage */}
      <div style={{ 
        padding: '15px', 
        background: '#fff', 
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h4>🎯 Todo o Conteúdo do LocalStorage</h4>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '5px', 
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(localStorage, null, 2)}
        </pre>
      </div>

      {/* Informações de Debug */}
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#fff3cd', 
        borderRadius: '5px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>🐛 Informações para Debug</h4>
        <p><strong>Problema conhecido:</strong> O sistema procura por <code>localStorage.getItem('user')</code> mas alguns componentes podem estar procurando por <code>localStorage.getItem('usuarioId')</code> separadamente.</p>
        <p><strong>Solução:</strong> Verificar se o login está salvando corretamente no objeto <code>user</code>.</p>
      </div>
    </div>
  );
};

export default VerificarUsuario;