
import React, { useState } from 'react';
import Layout from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckCircle2, CreditCard, ShieldCheck, Zap, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { PLANS, formatBRL, PlanConfig, BillingCycle } from '../src/config/plans.ts';

const Billing: React.FC = () => {
  const { user, apiCall } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
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
      const response = await apiCall('/api/stripe/portal', { method: 'POST' });
      if (response?.url) window.location.href = response.url;
    } catch (err: any) {
      setError("Não foi possível acessar o portal de gestão.");
      setLoadingPortal(false);
    }
  };

  const currentPlanLabel = (tier?: string) => {
    if (!tier || tier === 'trial') return 'Período Trial (Avaliação)';
    const plan = PLANS.find(p => p.id === tier);
    return plan ? `Plano ${plan.name}` : 'Plano Ativo';
  };

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-800 tracking-tight">Assinatura</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Gestão de plano e upgrade de recursos.</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mensal
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Anual <span className="bg-emerald-100 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-md">2 meses grátis</span>
          </button>
        </div>
      </header>

      <Card className="mb-10 bg-slate-900 border-none relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={120} className="text-white" /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 p-2">
          <div className="text-white text-center md:text-left">
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Status Operacional</span>
            <h2 className="text-3xl font-black mt-3 tracking-tight">{currentPlanLabel(user?.plan_tier)}</h2>
            <p className="text-slate-400 mt-1 font-medium opacity-80">Sua consultoria está habilitada no sistema.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="glass" onClick={handleOpenPortal} disabled={loadingPortal} className="h-14 px-8">
                {loadingPortal ? <Loader2 size={18} className="animate-spin mr-2"/> : <CreditCard size={18} className="mr-2"/>}
                Gestão de Faturas {!loadingPortal && <ExternalLink size={14} className="ml-2 opacity-40" />}
             </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-3 animate-fade-in-down">
          <AlertCircle size={20} className="shrink-0" /> <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-12">
        {selfServicePlans.map((plan) => {
          const isCurrent = user?.plan_tier === plan.id;
          const isLoading = loadingPlan === plan.id;
          const isYearly = billingCycle === 'yearly';
          const mainPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL : plan.monthlyPriceBRL;
          const subPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL / 12 : null;

          return (
            <Card key={plan.id} className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-blue-500 shadow-xl scale-[1.03] ring-4 ring-blue-50' : 'border-slate-200'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Recomendado</div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{plan.name}</h3>
                <div className="mt-4 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-slate-400">R$</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                      {mainPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-slate-500 text-sm font-bold">/{isYearly ? 'ano' : 'mês'}</span>
                  </div>
                  {isYearly && subPrice && (
                    <p className="text-[10px] font-black text-emerald-500 uppercase mt-2 tracking-widest">
                      Equivalente a {formatBRL(subPrice)}/mês
                    </p>
                  )}
                  {!isYearly && (
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">
                      Faturamento Mensal
                    </p>
                  )}
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <Button fullWidth size="lg" disabled={isCurrent || isLoading} variant={plan.popular ? 'primary' : 'secondary'} onClick={() => handleSubscribe(plan.id)} className="h-16 uppercase text-xs font-black tracking-[0.2em]">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : isCurrent ? 'Seu Plano Atual' : `Ativar ${plan.name}`}
              </Button>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Billing;
