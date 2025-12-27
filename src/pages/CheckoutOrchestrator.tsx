
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { setPendingCheckout, clearPendingCheckout } from '../lib/pendingCheckout.ts';

/**
 * CheckoutOrchestrator
 * Componente mestre que garante o redirecionamento para o Stripe Checkout.
 * 1. Lê plan/cycle da URL ou sessionStorage.
 * 2. Se deslogado: Salva intenção e manda para /register.
 * 3. Se logado: Dispara criação de sessão no Stripe e redireciona.
 */
const CheckoutOrchestrator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading, token } = useAuth();
  const requestFired = useRef(false);
  
  const [error, setError] = useState<string | null>(null);

  // Lê parâmetros da URL
  const urlPlan = searchParams.get('plan');
  const urlCycle = searchParams.get('cycle') || 'monthly';

  useEffect(() => {
    if (isLoading) return;

    // Plano permitido?
    const validPlans = ['consultant', 'business', 'corporate'];
    const plan = urlPlan || '';
    
    if (!validPlans.includes(plan)) {
      navigate('/#pricing', { replace: true });
      return;
    }

    // Se NÃO estiver logado:
    if (!isAuthenticated) {
      // Salva no sessionStorage para quando ele voltar do Login/Register
      setPendingCheckout({ plan, cycle: urlCycle });
      // Manda para registro levando os params na URL também por redundância
      navigate(`/register?plan=${plan}&cycle=${urlCycle}`, { replace: true });
      return;
    }

    // Se ESTÁ autenticado, dispara o Stripe
    if (isAuthenticated && token && !requestFired.current) {
      const executeStripeCheckout = async () => {
        requestFired.current = true;
        try {
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ plan, billingCycle: urlCycle })
          });

          if (response?.url) {
            // Limpa o estado pendente pois o checkout foi iniciado com sucesso
            clearPendingCheckout();
            // Redirecionamento EXTERNO (Stripe)
            window.location.href = response.url;
          } else {
            throw new Error("Não recebemos um link válido de pagamento do Stripe.");
          }
        } catch (err: any) {
          console.error("Payment Error:", err);
          setError(err.message || "Erro ao conectar com o gateway de faturamento.");
          requestFired.current = false;
        }
      };

      executeStripeCheckout();
    }
  }, [isAuthenticated, isLoading, token, urlPlan, urlCycle, navigate, apiCall]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center">
      <div className="mb-12 hover:opacity-80 transition-opacity">
        <Logo size="lg" />
      </div>
      
      <Card className="max-w-md w-full p-10 shadow-2xl border-t-4 border-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Lock size={120} />
        </div>

        {error ? (
          <div className="animate-fade-in relative z-10">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-inner">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Falha no Redirecionamento</h2>
             <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
             <div className="space-y-3">
               <Button onClick={() => window.location.reload()} fullWidth className="h-14">
                 Tentar Novamente
               </Button>
               <Button variant="secondary" onClick={() => navigate('/app/billing')} fullWidth className="h-14">
                 Voltar para Planos
               </Button>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
               <div className="relative w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner border border-blue-100">
                  <Loader2 size={48} className="animate-spin" />
               </div>
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Processando...</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Estamos preparando seu checkout seguro no Stripe para o plano selecionado. <br/> <strong>Não feche esta página.</strong>
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Checkout Blindado SSL
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-10 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black opacity-60">
        Faturamento processado por Stripe & NR ZEN
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
