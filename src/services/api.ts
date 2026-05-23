// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Detecta ambiente (local ou produção)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const BASE = isDevelopment
  ? 'http://localhost:8086/api'
  : 'https://larica-api-1.onrender.com/api';

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