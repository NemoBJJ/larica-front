import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Resolve baseURL assim (primeiro que existir):
 * 1) window.__API_BASE_URL__            (pode setar no index.html, se quiser)
 * 2) import.meta.env.VITE_API_BASE_URL  (Vite)   -> usamos 'as any' p/ não quebrar no CRA
 * 3) process.env.REACT_APP_API_BASE_URL (CRA)
 * 4) fallback: http://localhost:8086/api
 */
const BASE =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8086/api'; // <<< seu back tem context-path=/api

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
  api.post('/auth/donos/login', { email, senha }); // caminho SEM /api porque baseURL já tem /api
