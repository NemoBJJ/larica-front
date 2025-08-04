import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086', // porta do backend
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', `${response.config.baseURL || ''}${response.config.url || ''}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('Erro na requisição:', {
      url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
