import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CardapioRestaurante from './CardapioRestaurante';
import HistoricoPedidos from './HistoricoPedidos';

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
  const usuarioId = 1;

  useEffect(() => {
    api.get('/restaurantes', { params: { pagina: 0, tamanho: 10 } })
      .then((res) => setRestaurantes(res.data))
      .catch((err) => console.error('Erro ao carregar restaurantes:', err))
      .finally(() => setCarregando(false));
  }, []);

  const handleSelecionar = (restaurante: Restaurante) => setRestauranteSelecionado(restaurante);
  const handleVoltar = () => setRestauranteSelecionado(null);

  if (carregando) return <p>Carregando restaurantes...</p>;

  return (
    <div>
      <button
        onClick={() => setMostrarHistorico(true)}
        style={{
          padding: '8px 16px',
          background: '#ff5e00',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          margin: '10px 0',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        📜 VER MEU HISTÓRICO
      </button>

      {mostrarHistorico ? (
        <HistoricoPedidos
          usuarioId={usuarioId}
          onVoltar={() => setMostrarHistorico(false)}
        />
      ) : (
        !restauranteSelecionado ? (
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
        )
      )}
    </div>
  );
};

export default ListaRestaurantes;
