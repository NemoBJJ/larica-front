import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 30 }}>🍔 Larica</h1>

      <div style={{ display: 'grid', gap: 20 }}>
        <button
          onClick={() => navigate('/login')}
          style={btnStyle}
        >
          👤 Login como Cliente
        </button>

        <button
          onClick={() => navigate('/login-dono')}
          style={btnStyle}
        >
          🍽️ Login como Dono de Restaurante
        </button>

        <hr style={{ margin: '30px 0', borderColor: '#ccc' }} />

        <button
          onClick={() => navigate('/cadastro')}
          style={btnStyleSecundario}
        >
          ➕ Cadastrar Cliente
        </button>

        <button
          onClick={() => navigate('/cadastro-dono')}
          style={btnStyleSecundario}
        >
          🏪 Cadastrar Dono + Restaurante
        </button>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  padding: '14px 24px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const btnStyleSecundario: React.CSSProperties = {
  ...btnStyle,
  backgroundColor: '#28a745',
};

export default HomePage;
