
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { getPendingCheckout, clearPendingCheckout, setPendingCheckout } from '../lib/pendingCheckout.ts';

const CheckoutOrchestrator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading } = useAuth();
  const requestFired = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Detectar o Plano (Nativo do disco é mais rápido que estado)
  const urlPlan = searchParams.get('plan');
  const urlCycle = searchParams.get('cycle') || 'monthly';
  const pending = getPendingCheckout();
  
  const activePlan = urlPlan || pending?.plan;
  const activeCycle = urlCycle || pending?.cycle || 'monthly';

  useEffect(() => {
    // Sincroniza a intenção no storage IMEDIATAMENTE
    if (urlPlan) {
      setPendingCheckout({ plan: urlPlan, cycle: urlCycle });
    }

    if (isLoading) return;

    // Se realmente não há plano, volta para precificação
    if (!activePlan) {
      window.location.href = '/#/pricing';
      return;
    }

    /**
     * VERIFICAÇÃO ATÔMICA
     * Verificamos o token diretamente no disco para ignorar o lag do React.
     */
    const token = localStorage.getItem('nrzen_token');
    const isLogged = !!token || isAuthenticated;

    if (!isLogged) {
      console.log("Orchestrator: User not logged. Sending to register.");
      navigate(`/register?plan=${activePlan}&cycle=${activeCycle}`, { replace: true });
      return;
    }

    // Dispara a chamada do Stripe se houver autorização
    if (isLogged && !requestFired.current) {
      const startStripeSession = async () => {
        requestFired.current = true;
        try {
          // Chamada API
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ plan: activePlan, billingCycle: activeCycle })
          });

          if (response?.url) {
            clearPendingCheckout(); // Sucesso: limpa a intenção
            window.location.href = response.url; // Redirecionamento nativo Stripe
          } else {
            throw new Error("Falha ao comunicar com o servidor de pagamentos.");
          }
        } catch (err: any) {
          console.error("Orchestrator Error:", err);
          setError(err.message || "Erro ao conectar com o provedor de pagamentos.");
          requestFired.current = false; 
        }
      };

      startStripeSession();
    }
  }, [isAuthenticated, isLoading, activePlan, activeCycle, navigate, apiCall, urlPlan, urlCycle]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center">
      <div className="mb-12"><Logo size="lg" /></div>
      
      <Card className="max-w-md w-full p-10 shadow-2xl border-t-4 border-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Lock size={120} /></div>

        {error ? (
          <div className="animate-fade-in relative z-10">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Falha Crítica</h2>
             <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
             <div className="space-y-3">
               <Button onClick={() => window.location.reload()} fullWidth className="h-14 font-black">Recarregar Página</Button>
               <Button variant="secondary" onClick={() => navigate('/app/billing')} fullWidth className="h-14 font-black">Escolher Plano Manualmente</Button>
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
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Segurança Ativa...</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">
              Autenticando sua sessão para o plano <strong className="text-blue-600">{activePlan?.toUpperCase()}</strong>.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Processamento Stripe Ativo
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-10 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black opacity-60">
        Ambiente Oficial NR ZEN • Verificado por Stripe Inc.
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
