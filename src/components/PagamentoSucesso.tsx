import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './PagamentoSucesso.css';

const PagamentoSucesso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const payment = searchParams.get('payment_id');
    setPaymentId(payment);

    // Simular algum processamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="pagamento-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Confirmando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagamento-container">
      <div className="pagamento-sucesso">
        <div className="icon">✅</div>
        <h1>Pagamento Aprovado!</h1>
        <p className="mensagem">Seu pedido foi confirmado e já estamos preparando.</p>

        {paymentId && (
          <div className="payment-info">
            <p><strong>ID da Transação:</strong> {paymentId}</p>
          </div>
        )}

        <div className="acoes">
          <Link to="/" className="btn-primario">
            Voltar para a Loja
          </Link>
          <Link to="/pedidos" className="btn-secundario">
            Ver Meus Pedidos
          </Link>
        </div>

        <div className="contato">
          <p>Dúvidas? <a href="/contato">Entre em contato</a></p>
        </div>
      </div>
    </div>
  );
};

export default PagamentoSucesso;
