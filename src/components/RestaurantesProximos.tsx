// src/components/RestaurantesProximos.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './RestaurantesProximos.css';



interface Restaurante {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

const RestaurantesProximos: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [lat, setLat] = useState('-5.80');
  const [lng, setLng] = useState('-35.21');
  const [raioKm, setRaioKm] = useState(4);

  const buscarRestaurantes = () => {
    setCarregando(true);
    api.get('/restaurantes/proximos', {
      params: { lat, lng, raioKm }
    })
      .then((res) => setRestaurantes(res.data))
      .catch((err) => console.error('Erro ao buscar restaurantes próximos:', err))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    buscarRestaurantes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📍 Restaurantes Próximos</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Latitude: </label>
        <input value={lat} onChange={e => setLat(e.target.value)} />
        <label style={{ marginLeft: '10px' }}>Longitude: </label>
        <input value={lng} onChange={e => setLng(e.target.value)} />
        <label style={{ marginLeft: '10px' }}>Raio (km): </label>
        <input
          type="number"
          value={raioKm}
          onChange={e => setRaioKm(Number(e.target.value))}
          style={{ width: '60px' }}
        />
        <button
          onClick={buscarRestaurantes}
          style={{
            marginLeft: '10px',
            padding: '6px 12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
      </div>

      {carregando ? (
        <p>🔄 Buscando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>😢 Nenhum restaurante encontrado nesse raio.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((r) => (
            <li
              key={r.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px'
              }}
            >
              <h3>{r.nome}</h3>
              <p>📍 {r.endereco}</p>
              <p>📞 {r.telefone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantesProximos;
