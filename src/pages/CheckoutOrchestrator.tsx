
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

  // 1. Identificar o Plano (Prioridade: URL > LocalStorage)
  const urlPlan = searchParams.get('plan');
  const urlCycle = searchParams.get('cycle') || 'monthly';
  const pending = getPendingCheckout();
  
  const activePlan = urlPlan || pending?.plan;
  const activeCycle = urlCycle || pending?.cycle || 'monthly';

  useEffect(() => {
    // Sincroniza intenção de compra no disco imediatamente
    if (urlPlan) {
      setPendingCheckout({ plan: urlPlan, cycle: urlCycle });
    }

    if (isLoading) return;

    // Proteção 1: Se não tem plano, volta para a home
    if (!activePlan) {
      navigate('/#pricing', { replace: true });
      return;
    }

    // Proteção 2: Verificação Atômica de Disco (Anti-Lag do React State)
    const rawToken = localStorage.getItem('nrzen_token');
    const isActuallyAuthenticated = isAuthenticated || !!rawToken;

    if (!isActuallyAuthenticated) {
      // Usuário deslogado? Vai para login mas mantendo o plano no disco
      navigate(`/login?plan=${activePlan}&cycle=${activeCycle}`, { replace: true });
      return;
    }

    // Proteção 3: Se logado e com plano, dispara Stripe (apenas uma vez)
    if (isActuallyAuthenticated && !requestFired.current) {
      const executeCheckout = async () => {
        requestFired.current = true;
        try {
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ plan: activePlan, billingCycle: activeCycle })
          });

          if (response?.url) {
            // Limpa a pendência ANTES de sair para evitar loops ao voltar
            clearPendingCheckout();
            window.location.href = response.url;
          } else {
            throw new Error("Resposta inválida do provedor de pagamento.");
          }
        } catch (err: any) {
          console.error("Critical Checkout Logic Error:", err);
          setError(err.message || "Erro ao conectar com Stripe.");
          requestFired.current = false; // Permite tentar novamente se falhar a rede
        }
      };

      executeCheckout();
    }
  }, [isAuthenticated, isLoading, activePlan, activeCycle, navigate, apiCall, urlPlan, urlCycle]);

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
             <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight uppercase">Falha no Checkout</h2>
             <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
             <div className="space-y-3">
               <Button onClick={() => window.location.reload()} fullWidth className="h-14 font-black">
                 Tentar Novamente
               </Button>
               <Button variant="secondary" onClick={() => navigate('/app/billing')} fullWidth className="h-14 font-black">
                 Voltar aos Planos
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
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
              Estamos preparando seu ambiente seguro para o plano <strong>{activePlan?.toUpperCase()}</strong>. <br/> Não feche esta janela.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Conexão Segura Stripe 256-bit
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-10 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black opacity-60">
        Ambiente Oficial NR ZEN • Processamento SSL Ativo
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
