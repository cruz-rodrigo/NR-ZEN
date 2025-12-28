
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { getCheckoutIntent, clearCheckoutIntent } from '../lib/checkoutIntent';

const CheckoutOrchestrator: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const checkoutStarted = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const intent = getCheckoutIntent();

    // 1. Sem intenção? Volta para preços.
    if (!intent) {
      console.warn("[Orchestrator] No intent found. Redirecting to home.");
      navigate('/', { replace: true });
      return;
    }

    // 2. Não logado? Vai registrar/logar mantendo a intenção no storage.
    if (!isAuthenticated) {
      navigate(`/register?plan=${intent.plan}`, { replace: true });
      return;
    }

    // 3. Logado + Intenção? Dispara Stripe.
    if (!checkoutStarted.current) {
      const initStripe = async () => {
        checkoutStarted.current = true;
        try {
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ 
              plan: intent.plan, 
              billingCycle: intent.cycle 
            })
          });

          if (response?.url) {
            // Limpa a intenção APENAS após garantir o sucesso do redirect para o Stripe
            clearCheckoutIntent();
            window.location.href = response.url;
          } else {
            throw new Error("Falha ao gerar sessão de pagamento.");
          }
        } catch (err: any) {
          console.error("[Checkout] Stripe Error:", err);
          setError(err.message || "Erro de comunicação com o Stripe.");
          checkoutStarted.current = false;
        }
      };

      initStripe();
    }
  }, [isAuthenticated, isLoading, navigate, apiCall]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="mb-12"><Logo size="lg" /></div>
      
      <Card className="max-w-md w-full p-10 shadow-2xl border-t-4 border-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Lock size={120} /></div>

        {error ? (
          <div className="animate-fade-in relative z-10">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Falha no Checkout</h2>
             <p className="text-slate-500 text-sm mb-8">{error}</p>
             <div className="space-y-3">
               <Button onClick={() => window.location.reload()} fullWidth className="h-14">Tentar Novamente</Button>
               <Button variant="secondary" onClick={() => navigate('/app/billing')} fullWidth className="h-14">Planos Manuais</Button>
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
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Autenticando...</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">
              Preparando ambiente seguro para faturamento Stripe.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Conexão Segura SSL 256-bit
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CheckoutOrchestrator;
