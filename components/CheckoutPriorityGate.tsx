import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCheckoutIntent } from '../lib/checkoutIntent';

/**
 * CHECKOUT PRIORITY GATE
 * Este componente deve ser montado dentro do Router, mas fora do Routes.
 * Ele garante que um usuário autenticado com intenção de compra nunca caia no Dashboard Trial.
 */
const CheckoutPriorityGate: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o Auth ainda está carregando o token do disco, aguardamos
    if (isLoading) return;

    const intent = getCheckoutIntent();
    const path = location.pathname;

    // Verificação de segurança: Checamos o token no disco para ser ultra-rápido (beat the race condition)
    const hasToken = !!localStorage.getItem('nrzen_token');
    const isLogged = isAuthenticated || hasToken;

    // Rotas que não devem ser interceptadas (o próprio fluxo de checkout e auth)
    const isExcludedPath = 
      path.startsWith('/checkout') || 
      path.startsWith('/billing/success') || 
      path.startsWith('/billing/cancel') ||
      path.startsWith('/login') || 
      path.startsWith('/register') ||
      path === '/';

    // SEQUESTRO DE ROTA:
    // Se logou e tem intenção e está tentando ir para o dashboard ou outra área -> Força Checkout.
    if (isLogged && intent && !isExcludedPath) {
      console.log(`[Gate] Intercepting access to ${path}. Redirecting to priority checkout: ${intent.plan}`);
      navigate('/checkout/start', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return null; // Componente de lógica pura, não renderiza nada
};

export default CheckoutPriorityGate;