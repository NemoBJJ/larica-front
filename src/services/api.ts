import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086', // base correta
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response.config.url, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
