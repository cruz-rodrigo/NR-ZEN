
import React, { useState } from 'react';
import Layout from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckCircle2, CreditCard, ShieldCheck, Zap, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { PLANS, formatBRL, PlanConfig } from '../config/plans.ts';

const Billing: React.FC = () => {
  const { user, apiCall, refreshUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selfServicePlans = PLANS.filter(p => !p.isCustom && p.id !== 'enterprise');

  const handleSubscribe = async (planId: string) => {
    setLoadingPlan(planId);
    setError(null);
    try {
      const response = await apiCall('/api/checkout/create-session', {
        method: 'POST',
        body: JSON.stringify({ plan: planId, billingCycle })
      });
      if (response?.url) window.location.href = response.url;
    } catch (err: any) {
      setError("Erro ao iniciar checkout. Tente novamente.");
      setLoadingPlan(null);
    }
  };

  const handleOpenPortal = async () => {
    setLoadingPortal(true);
    setError(null);
    try {
      const response = await apiCall('/api/stripe/portal', {
        method: 'POST'
      });
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("URL do portal não retornada.");
      }
    } catch (err: any) {
      setError("Não foi possível acessar o portal de gestão. Tente novamente.");
      setLoadingPortal(false);
    }
  };

  const currentPlanLabel = (tier?: string) => {
    if (!tier) return 'Plano Indefinido';
    if (tier === 'trial') return 'Período Trial (Avaliação)';
    const plan = PLANS.find(p => p.id === tier);
    return plan ? `Plano ${plan.name}` : 'Plano Indefinido';
  };

  return (
    <Layout>
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-[42px] font-heading font-black text-slate-900 tracking-tight leading-none">Faturamento</h1>
          <p className="text-xl text-slate-500 mt-3 font-medium italic opacity-70">Gerencie sua assinatura e upgrade de recursos.</p>
        </div>
        
        <div className="bg-slate-100 p-2 rounded-[24px] flex items-center shadow-inner border border-slate-200">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-8 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Mensal
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-8 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Anual <span className="bg-emerald-100 text-emerald-600 text-[9px] px-2 py-0.5 rounded-md">-17% OFF</span>
          </button>
        </div>
      </header>

      <Card className="mb-12 bg-slate-950 border-none relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.3)] p-10">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <ShieldCheck size={200} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-white text-center md:text-left space-y-4">
            <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.25em] bg-blue-500/10 px-5 py-2 rounded-full border border-blue-500/20">STATUS DA LICENÇA</span>
            <h2 className="text-4xl font-black tracking-tight">{currentPlanLabel(user?.plan_tier)}</h2>
            <p className="text-slate-400 text-lg font-medium italic opacity-60">Sua infraestrutura está operando em conformidade.</p>
          </div>
          <div className="flex gap-4">
             <Button 
               variant="glass" 
               onClick={handleOpenPortal} 
               disabled={loadingPortal}
               className="h-20 px-12 text-sm"
             >
                {loadingPortal ? <Loader2 size={22} className="animate-spin mr-3"/> : <CreditCard size={22} className="mr-3"/>}
                GESTÃO DE FATURAS
                {!loadingPortal && <ExternalLink size={16} className="ml-3 opacity-40" />}
             </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-10 bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl flex items-center gap-4 animate-fade-in-down">
          <AlertCircle size={24} className="shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto pb-20">
        {selfServicePlans.map((plan) => {
          const isCurrent = user?.plan_tier === plan.id;
          const isLoading = loadingPlan === plan.id;
          const isYearly = billingCycle === 'yearly';
          
          const mainPrice = isYearly && plan.yearlyPriceBRL 
            ? plan.yearlyPriceBRL 
            : plan.monthlyPriceBRL;

          const monthlyEquivalent = isYearly && plan.yearlyPriceBRL 
            ? plan.yearlyPriceBRL / 12 
            : null;

          return (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col h-full transition-all duration-500 rounded-[44px] p-10 ${
                plan.popular 
                  ? 'border-blue-500 shadow-[0_30px_70px_-15px_rgba(37,99,235,0.2)] ring-8 ring-blue-50' 
                  : 'border-slate-200 hover:shadow-2xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                  RECOMENDADO
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                <div className="mt-8 flex flex-col justify-center min-h-[120px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {mainPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-slate-400 text-sm font-bold">/{isYearly ? 'ano' : 'mês'}</span>
                  </div>
                  
                  {isYearly && (
                    <div className="mt-4 space-y-1">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        COBRADO ANUALMENTE
                      </p>
                      <p className="text-sm font-bold text-slate-500 italic">
                        Equivalente a {formatBRL(monthlyEquivalent!)}/mês
                      </p>
                    </div>
                  )}

                  {!isYearly && (
                    <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                      FATURAMENTO MENSAL
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex gap-4 text-[15px] text-slate-600 font-bold leading-tight">
                    <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
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
                className="h-16 shadow-lg"
              >
                {isLoading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : isCurrent ? (
                  'PLANO ATIVO'
                ) : (
                  `ATIVAR ${plan.name.toUpperCase()}`
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
         <div className="inline-flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] opacity-50">
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            INFRAESTRUTURA DE PAGAMENTO STRIPE SSL 256-BIT
         </div>
      </div>
    </Layout>
  );
};

export default Billing;