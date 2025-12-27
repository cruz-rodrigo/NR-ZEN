
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';

/**
 * CheckoutOrchestrator
 * Componente central que gerencia o fluxo de vendas.
 * Ele garante que o usuário esteja logado antes de criar a sessão do Stripe.
 */
const CheckoutOrchestrator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, apiCall, isLoading, token } = useAuth();
  
  // Impede disparos duplicados da API (útil no React Strict Mode)
  const requestFired = useRef(false);
  
  const plan = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Aguarda o carregamento inicial da autenticação
    if (isLoading) return;

    // 2. Segurança: Se cair aqui sem um plano, volta para os preços na Landing Page
    if (!plan) {
      navigate('/#pricing', { replace: true });
      return;
    }

    // 3. Se NÃO estiver logado, redireciona para o Registro preservando o contexto do plano
    if (!isAuthenticated) {
      navigate(`/register?plan=${plan}&cycle=${cycle}`, { replace: true });
      return;
    }

    // 4. Se ESTIVER logado e tiver o token pronto, dispara a criação da sessão do Stripe
    if (isAuthenticated && token && !requestFired.current) {
      const startCheckout = async () => {
        requestFired.current = true;
        try {
          const response = await apiCall('/api/checkout/create-session', {
            method: 'POST',
            body: JSON.stringify({ plan, billingCycle: cycle })
          });

          if (response?.url) {
            // REDIRECIONAMENTO EXTERNO PARA O STRIPE
            window.location.href = response.url;
          } else {
            throw new Error("Erro ao gerar link de pagamento seguro.");
          }
        } catch (err: any) {
          console.error("Checkout Execution Error:", err);
          setError(err.message || "Erro ao conectar com o servidor de faturamento.");
          requestFired.current = false; // Permite tentar novamente
        }
      };

      startCheckout();
    }
  }, [isAuthenticated, isLoading, token, plan, cycle, navigate, apiCall]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center">
      <div className="mb-12 hover:opacity-80 transition-opacity">
        <Logo size="lg" />
      </div>
      
      <Card className="max-w-md w-full p-10 shadow-2xl border-t-4 border-blue-600 relative overflow-hidden">
        {/* Elemento Decorativo de Fundo */}
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
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Conectando...</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Estamos preparando seu checkout seguro no Stripe para o plano selecionado. <br/> <strong>Não feche esta janela.</strong>
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50 py-4 rounded-[20px] border border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              Checkout Blindado SSL
            </div>
          </div>
        )}
      </Card>
      
      <p className="mt-10 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black opacity-60">
        Plataforma Processada por Stripe & NR ZEN
      </p>
    </div>
  );
};

export default CheckoutOrchestrator;
