import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CardapioRestaurante from './CardapioRestaurante';
import './ListaRestaurantes.css';

interface Restaurante {
  id: number;
  nome: string;
  endereco: string;
  tipoCozinha: string;
}

const ListaRestaurantes: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<Restaurante | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // ✅ PEGA O usuarioId DO LOCALSTORAGE
  const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1', 10);

  useEffect(() => {
    const carregarRestaurantes = async () => {
      try {
        const response = await api.get('/restaurantes');
        setRestaurantes(response.data);
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar restaurantes:', error);
        setErro('Erro ao carregar restaurantes. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarRestaurantes();
  }, []);

  const handleRestauranteClick = (restaurante: Restaurante) => {
    setRestauranteSelecionado(restaurante);
  };

  const handleVoltar = () => {
    setRestauranteSelecionado(null);
  };

  if (carregando) {
    return <div className="carregando">Carregando restaurantes...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  if (restauranteSelecionado) {
    return (
      <CardapioRestaurante
        restauranteId={restauranteSelecionado.id}
        nomeRestaurante={restauranteSelecionado.nome}
        onVoltar={handleVoltar}
        usuarioId={usuarioId} // ✅ AGORA COM usuarioId
      />
    );
  }

  return (
    <div className="lista-restaurantes">
      <h2>Restaurantes Disponíveis</h2>
      {restaurantes.length > 0 ? (
        <ul className="restaurantes-list">
          {restaurantes.map((restaurante) => (
            <li
              key={restaurante.id}
              className="restaurante-item"
              onClick={() => handleRestauranteClick(restaurante)}
            >
              <div className="restaurante-info">
                <h3>{restaurante.nome}</h3>
                <p>{restaurante.endereco}</p>
                <span className="tipo-cozinha">{restaurante.tipoCozinha}</span>
              </div>
              <button className="ver-cardapio-btn">Ver Cardápio</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum restaurante encontrado.</p>
      )}
    </div>
  );
};

export default ListaRestaurantes;