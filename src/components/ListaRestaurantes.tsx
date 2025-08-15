// src/components/ListaRestaurantes.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CardapioRestaurante from './CardapioRestaurante';
import HistoricoUsuario from './HistoricoUsuario';
import { useNavigate } from 'react-router-dom';

interface Restaurante {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

const ListaRestaurantes: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<Restaurante | null>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [raioKm, setRaioKm] = useState<number>(5);
  const usuarioId = Number(localStorage.getItem('usuarioId')) || 1;
  const navigate = useNavigate();

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  const carregarRestaurantes = async (latitude?: number, longitude?: number, raio?: number) => {
    try {
      setCarregando(true);
      let res;

      if (latitude && longitude && raio) {
        res = await api.get('/restaurantes/proximos', {
          params: {
            lat: latitude,
            lng: longitude,
            raioKm: raio
          }
        });
      } else {
        res = await api.get('/restaurantes', { params: { pagina: 0, tamanho: 10 } });
      }

      setRestaurantes(res.data);
    } catch (err) {
      console.error('Erro ao carregar restaurantes:', err);
    } finally {
      setCarregando(false);
    }
  };

  const buscarPorDistancia = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        carregarRestaurantes(latitude, longitude, raioKm);
      },
      (err) => {
        alert('Não foi possível obter a localização: ' + err.message);
      },
      { timeout: 5000 }
    );
  };

  const handleSelecionar = (restaurante: Restaurante) => setRestauranteSelecionado(restaurante);
  const handleVoltar = () => setRestauranteSelecionado(null);

  if (carregando) return <p>Carregando restaurantes...</p>;

  if (mostrarHistorico) {
    return (
      <HistoricoUsuario
        usuarioId={usuarioId}
        onVoltar={() => setMostrarHistorico(false)}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={() => setMostrarHistorico(true)}
          style={{
            padding: '8px 16px',
            background: '#ff5e00',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📜 VER MEU HISTÓRICO
        </button>

        <button
          onClick={() => navigate('/cadastro')}
          style={{
            padding: '8px 16px',
            background: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ CADASTRAR USUÁRIO
        </button>
      </div>

      {/* Filtro por distância */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          📍  (Km):{' '}
          <input
            type="number"
            value={raioKm}
            onChange={(e) => setRaioKm(Number(e.target.value))}
            style={{ padding: '5px', width: '60px', marginRight: '10px' }}
          />
        </label>
        <button
          onClick={buscarPorDistancia}
          style={{
            padding: '6px 12px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔍 Perto de você
        </button>
      </div>

      {!restauranteSelecionado ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((r) => (
            <li
              key={r.id}
              onClick={() => handleSelecionar(r)}
              style={{
                cursor: 'pointer',
                padding: '15px',
                margin: '10px 0',
                border: '1px solid #ddd',
                borderRadius: '10px',
                transition: 'all 0.3s',
                backgroundColor: '#fff'
              }}
            >
              <h2 style={{ color: '#333', marginTop: 0 }}>{r.nome}</h2>
              <p style={{ color: '#666', margin: '5px 0' }}>📍 {r.endereco}</p>
              <p style={{ color: '#666', margin: '5px 0' }}>📞 {r.telefone}</p>
            </li>
          ))}
        </ul>
      ) : (
        <CardapioRestaurante
          restauranteId={restauranteSelecionado.id}
          nomeRestaurante={restauranteSelecionado.nome}
          onVoltar={handleVoltar}
        />
      )}
    </div>
  );
};

export default ListaRestaurantes;
