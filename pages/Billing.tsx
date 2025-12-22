
import React, { useState } from 'react';
import Layout from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckCircle2, CreditCard, ShieldCheck, Zap, Loader2, AlertCircle } from 'lucide-react';
import { PLANS, formatCurrency, PlanConfig } from '../src/config/plans.ts';

const Billing: React.FC = () => {
  const { user, apiCall } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selfServicePlans = PLANS.filter(p => !p.isCustom && p.id !== 'enterprise');

  const handleSubscribe = async (planId: string) => {
    setLoadingPlan(planId);
    setError(null);
    
    try {
      const response = await apiCall('/api/checkout/create-session', {
        method: 'POST',
        body: JSON.stringify({ plan: planId })
      });
      
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("URL de checkout não retornada pela API.");
      }
    } catch (err: any) {
      console.group("Billing Error Diagnostic");
      console.error("Payload do Erro:", err);
      console.groupEnd();

      setError("Não foi possível iniciar o processo de checkout. Verifique sua conexão ou tente novamente mais tarde.");
      setLoadingPlan(null);
    }
  };

  const currentPlanLabel = (tier?: string) => {
    if (!tier) return 'Plano Indefinido';
    if (tier === 'trial') return 'Período de Avaliação (Trial)';
    
    const plan = PLANS.find(p => p.id === tier);
    return plan ? `Plano ${plan.name}` : 'Plano Indefinido';
  };

  return (
    <Layout>
      <header className="mb-10">
        <h1 className="text-3xl font-heading font-bold text-slate-800">Assinatura e Planos</h1>
        <p className="text-slate-500 mt-1">Gerencie sua conta e potencialize sua consultoria.</p>
      </header>

      <Card className="mb-10 bg-slate-900 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <ShieldCheck size={120} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Status Atual</span>
            <h2 className="text-2xl font-bold mt-3">{currentPlanLabel(user?.plan_tier)}</h2>
            <p className="text-slate-400 mt-1">Sua conta está ativa e em conformidade.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="glass" onClick={() => window.open('https://billing.stripe.com/p/login/test_your_link_here', '_blank')}>
                <CreditCard size={18} className="mr-2"/> Histórico de Faturas
             </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in-down">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {selfServicePlans.map((plan) => {
          const isCurrent = user?.plan_tier === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col h-full transition-all duration-300 ${plan.popular ? 'border-blue-500 shadow-xl scale-[1.02] ring-1 ring-blue-100' : 'border-slate-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                  Mais Escolhido
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{formatCurrency(plan.priceMonthly)}</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Button 
                fullWidth 
                size="lg"
                disabled={isCurrent || isLoading}
                variant={plan.popular ? 'primary' : 'secondary'}
                onClick={() => handleSubscribe(plan.id)}
                className="mt-auto"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isCurrent ? (
                  'Plano Atual'
                ) : (
                  `Assinar ${plan.name}`
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
         <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Zap size={14} className="text-amber-500" />
            Pagamento Processado com Segurança pelo Stripe
         </div>
      </div>
    </Layout>
  );
};

export default Billing;