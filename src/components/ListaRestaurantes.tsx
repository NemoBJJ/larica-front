// src/components/ListaRestaurantes.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ListaRestaurantes.css';

interface Restaurante {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  dono_id?: number;
  latitude?: number;
  longitude?: number;
}

const ListaRestaurantes: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setCarregando(true);
        const response = await api.get('/restaurantes');
        
        setRestaurantes(response.data);
      } catch (error) {
        console.error('Erro ao buscar restaurantes:', error);
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro('Erro desconhecido ao carregar restaurantes');
        }
      } finally {
        setCarregando(false);
      }
    };

    fetchRestaurantes();
  }, []);

  const handleVerCardapio = (restauranteId: number) => {
    navigate(`/cardapio/${restauranteId}`);
  };

  if (carregando) {
    return (
      <div className="lista-restaurantes">
        <div className="carregando">Carregando restaurantes...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="lista-restaurantes">
        <div className="erro">Erro: {erro}</div>
      </div>
    );
  }

  return (
    <div className="lista-restaurantes">
      <h2>Restaurantes Disponíveis</h2>
      
      <ul className="restaurantes-list">
        {restaurantes.map(restaurante => (
          <li key={restaurante.id} className="restaurante-item">
            <div className="restaurante-info">
              <h3>{restaurante.nome}</h3>
              <p>{restaurante.endereco}</p>
              <p>{restaurante.telefone}</p>
              <span className="tipo-cozinha">Culinária variada</span>
            </div>
            <button 
              className="ver-cardapio-btn"
              onClick={() => handleVerCardapio(restaurante.id)}
            >
              Ver Cardápio
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaRestaurantes;