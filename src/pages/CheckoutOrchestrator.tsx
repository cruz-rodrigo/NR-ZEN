
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';

const CheckoutOrchestrator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading, token } = useAuth();
  const requestFired = useRef(false);
  
  const plan = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se ainda está carregando o estado da auth, aguarda.
    if (isLoading) return;

    // Se não tem plano na URL, volta para os preços.
    if (!plan) {
      navigate('/#pricing', { replace: true });
      return;
    }

    // Se não está autenticado, manda para o registro mantendo o contexto do plano.
    if (!isAuthenticated) {
      navigate(`/register?plan=${plan}&cycle=${cycle}`, { replace: true });
      return;
    }

    // Se está autenticado e tem o token, dispara o checkout (apenas uma vez para evitar múltiplas sessões)
    if (isAuthenticated && token && !requestFired.current) {
      const startCheckout = async () => {
        requestFired.current = true;
        try {
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ plan, billingCycle: cycle })
          });

          if (response?.url) {
            window.location.href = response.url;
          } else {
            throw new Error("Resposta inválida do servidor de faturamento.");
          }
        } catch (err: any) {
          console.error("Checkout Execution Error:", err);
          setError(err.message || "Erro ao conectar com o provedor de pagamentos.");
          requestFired.current = false; // Permite tentar novamente em caso de erro
        }
      };

      startCheckout();
    }
  }, [isAuthenticated, isLoading, token, plan, cycle, navigate, apiCall]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-12 hover:opacity-80 transition-opacity">
        <Logo size="lg" />
      </div>
      
      <Card className="max-w-md w-full p-10 text-center shadow-2xl border-t-4 border-blue-600 relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Lock size={120} />
        </div>

        {error ? (
          <div className="animate-fade-in relative z-10">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-inner">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Falha no Checkout</h2>
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
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Preparando Pagamento...</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Estamos gerando sua sessão segura no Stripe. <br/> <strong>Não feche esta janela.</strong>
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Checkout Blindado SSL
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-10 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black opacity-60">
        Plataforma Segura via Stripe & NR ZEN
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
