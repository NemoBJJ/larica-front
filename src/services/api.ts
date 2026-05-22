import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  'https://larica-api-1.onrender.com/api';  // ← APONTANDO PARA O RENDER!

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar token expirado
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

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

// Helper opcional
export const loginDono = (email: string, senha: string) =>
  api.post('/auth/donos/login', { email, senha });