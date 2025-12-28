
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCheckoutIntent } from '../lib/checkoutIntent';

/**
 * CHECKOUT PRIORITY GATE
 * Este componente deve ser montado dentro do Router, mas fora do Routes.
 * Ele garante que um usuário autenticado com intenção de compra nunca caia no Trial.
 */
const CheckoutPriorityGate: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const intent = getCheckoutIntent();
    const path = location.pathname;

    // Rotas que não devem ser interceptadas (o próprio fluxo de checkout e auth)
    const isExcludedPath = 
      path.startsWith('/checkout') || 
      path.startsWith('/billing/success') || 
      path.startsWith('/billing/cancel') ||
      path.startsWith('/login') || 
      path.startsWith('/register') ||
      path === '/';

    // SEQUESTRO DE ROTA:
    // Se logou, tem intenção e não está no fluxo de pagamento -> Força Checkout.
    if (isAuthenticated && intent && !isExcludedPath) {
      console.log(`[Gate] Intercepting access to ${path}. Redirecting to priority checkout: ${intent.plan}`);
      navigate('/checkout/start', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return null; // Componente invisível de lógica pura
};

export default CheckoutPriorityGate;
