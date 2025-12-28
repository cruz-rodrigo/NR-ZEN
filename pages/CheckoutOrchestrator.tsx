
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import { getCheckoutIntent, setCheckoutIntent, clearCheckoutIntent, PlanSlug, BillingCycle } from '../src/lib/checkoutIntent';

const CheckoutOrchestrator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading } = useAuth();
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const allowedPlans: PlanSlug[] = ['consultant', 'business', 'corporate'];
    const planParam = searchParams.get('plan');
    const cycleParam = (searchParams.get('cycle') || 'monthly') as BillingCycle;
    const storedIntent = getCheckoutIntent();

    const intent = planParam && allowedPlans.includes(planParam as PlanSlug)
      ? { plan: planParam as PlanSlug, cycle: cycleParam }
      : storedIntent;

    if (intent) {
      setCheckoutIntent(intent);
    }

    if (!intent) {
      navigate('/', { replace: true });
      return;
    }

    if (!isAuthenticated) {
      // Redireciona para o cadastro enviando a intenção de compra
      navigate(`/register?plan=${intent.plan}&cycle=${intent.cycle}`);
      return;
    }

    // Se já estiver logado, dispara a criação da sessão de checkout
    const startCheckout = async () => {
      try {
        const response = await apiCall('/api/checkout/create-session', {
          method: 'POST',
          body: JSON.stringify({ plan: intent.plan, billingCycle: intent.cycle })
        });

        if (response?.url) {
          clearCheckoutIntent();
          window.location.href = response.url;
        } else {
          throw new Error("Não foi possível gerar a URL de pagamento.");
        }
      } catch (err: any) {
        console.error("Checkout Error:", err);
        setError(err.message || "Erro inesperado ao iniciar o pagamento.");
      }
    };

    startCheckout();
  }, [isAuthenticated, isLoading, apiCall, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-12"><Logo size="lg" /></div>
      
      <Card className="max-w-md w-full p-10 text-center shadow-2xl border-t-4 border-blue-600">
        {error ? (
          <div className="animate-fade-in">
             <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="rotate-180" />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Ops! Algo deu errado.</h2>
             <p className="text-slate-500 text-sm mb-8">{error}</p>
             <button 
               onClick={() => navigate('/app/billing')}
               className="text-blue-600 font-bold hover:underline"
             >
               Voltar para assinaturas
             </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="relative w-20 h-20 mx-auto mb-8">
               <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
               <div className="relative w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <Loader2 size={40} className="animate-spin" />
               </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Preparando Checkout</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Estamos configurando seu ambiente seguro de pagamento no Stripe. Você será redirecionado em instantes.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 py-3 rounded-xl border border-slate-100">
              <ShieldCheck size={14} className="text-emerald-500" />
              Ambiente 100% Seguro
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-8 text-slate-400 text-[10px] uppercase tracking-widest font-medium">
        Powered by Stripe & NR ZEN
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
