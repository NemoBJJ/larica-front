// src/components/VerificarUsuario.tsx
import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

type BackendDebug = {
  username?: string;
  userId?: number;
  roles?: string[];
  tokenValid?: boolean;
  tokenPreview?: string;
  clientIp?: string;
  userAgent?: string;
  error?: string;
};

const Badge: React.FC<{ ok?: boolean; text: string }> = ({ ok, text }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      background: ok === undefined ? '#e9ecef' : ok ? '#e8f5e8' : '#ffeaea',
      color: ok === undefined ? '#495057' : ok ? '#2e7d32' : '#c62828',
      border: `1px solid ${ok === undefined ? '#ced4da' : ok ? '#a5d6a7' : '#ef9a9a'}`,
      marginLeft: 8,
    }}
  >
    {text}
  </span>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      padding: 16,
      marginBottom: 16,
      background: '#fff',
      borderRadius: 10,
      border: '1px solid #ddd',
      boxShadow: '0 1px 2px rgba(0,0,0,.04)',
    }}
  >
    <h4 style={{ margin: '0 0 10px 0' }}>{title}</h4>
    {children}
  </div>
);

const VerificarUsuario: React.FC = () => {
  const [data, setData] = useState<BackendDebug | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = useCallback(async () => {
    setLoading(true);
    try {
      // baseURL do api já inclui o prefixo (ex.: /api)
      const res = await api.get('/debug/token-info');
      setData(res.data as BackendDebug);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        'Falha ao buscar /debug/token-info';
      setData({ error: msg });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data ?? {}, null, 2));
      alert('Copiado pro clipboard ✅');
    } catch {
      alert('Não consegui copiar 😞');
    }
  };

  // statusOk vira true quando não há erro e (tokenValid é true ou indefinido)
  const statusOk: boolean | undefined = data
    ? !data.error && (data.tokenValid === undefined || data.tokenValid === true)
    : undefined;

  return (
    <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 10, margin: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>🔍 Debug do Token (Backend)</h3>
        <Badge
          ok={statusOk ?? undefined}
          text={
            statusOk === true
              ? 'OK'
              : data?.error || data?.tokenValid === false
              ? 'PROBLEMA'
              : '—'
          }
        />
      </div>

      <Card title="Resultado do /debug/token-info">
        {loading ? (
          <p>⏳ Carregando…</p>
        ) : (
          <div style={{ lineHeight: 1.6 }}>
            <p>
              <strong>Usuário:</strong> {data?.username ?? '—'}
            </p>
            <p>
              <strong>User ID:</strong> {data?.userId ?? '—'}
            </p>
            <p>
              <strong>Roles:</strong> {data?.roles?.join(', ') || '—'}
            </p>
            <p>
              <strong>Token válido:</strong>{' '}
              {data?.tokenValid === undefined ? '—' : data?.tokenValid ? '✅ SIM' : '❌ NÃO'}
            </p>
            <p>
              <strong>Token preview:</strong> {data?.tokenPreview ?? '—'}
            </p>
            <p>
              <strong>Client IP:</strong> {data?.clientIp ?? '—'}
            </p>
            <p style={{ wordBreak: 'break-word' }}>
              <strong>User-Agent:</strong> {data?.userAgent ?? '—'}
            </p>
            {data?.error && (
              <p style={{ color: '#c62828' }}>
                <strong>Erro:</strong> {data.error}
              </p>
            )}

            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={fetchInfo}
                disabled={loading}
                style={{
                  padding: '8px 14px',
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                {loading ? '🔄 Atualizando…' : '🔄 Atualizar'}
              </button>
              <button
                onClick={copyJson}
                style={{
                  padding: '8px 14px',
                  background: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                📋 Copiar JSON
              </button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Payload cru (para inspeção)">
        <pre
          style={{
            background: '#f8f9fa',
            padding: 12,
            borderRadius: 8,
            overflow: 'auto',
            fontSize: 12,
            margin: 0,
          }}
        >
{JSON.stringify(data ?? {}, null, 2)}
        </pre>
      </Card>

      <div
        style={{
          marginTop: 8,
          padding: 10,
          background: '#fff3cd',
          borderRadius: 8,
          border: '1px solid #ffeaa7',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        Este painel mostra exatamente o retorno de <code>/debug/token-info</code> (o{' '}
        <code>api</code> já injeta o <code>Authorization</code>).
      </div>
    </div>
  );
};

export default VerificarUsuario;
