import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const atualizarStatusPedido = async (
  restauranteId: number,
  pedidoId: number,
  status: 'EM_PREPARO' | 'CANCELADO'
) => {
  try {
    const response = await api.patch(
      `/pedidos/restaurante/${restauranteId}/${pedidoId}/status?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error('Falha ao atualizar status:', error);
    throw error;
  }
};

export default api;
