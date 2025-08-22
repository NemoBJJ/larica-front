import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8086/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ✅ INTERCEPTOR PARA ADICIONAR TOKEN AUTOMATICAMENTE
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ INTERCEPTOR PARA TRATAR TOKEN EXPIRADO
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Mantém o logging original de erro
    const cfg = (error.config || {}) as AxiosRequestConfig;
    const finalUrl = `${api.defaults.baseURL || ''}${cfg.url || ''}`;
    console.error('Erro na requisição:', {
      method: cfg.method,
      url: finalUrl,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;

/** helper opcional */
export const loginDono = (email: string, senha: string) =>
  api.post('/auth/donos/login', { email, senha });
