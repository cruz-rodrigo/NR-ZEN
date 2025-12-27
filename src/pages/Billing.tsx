
import React, { useState } from 'react';
import Layout from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckCircle2, CreditCard, ShieldCheck, Zap, Loader2, AlertCircle, ExternalLink, Calendar } from 'lucide-react';
import { PLANS, formatBRL, PlanConfig, BillingCycle } from '../config/plans.ts';

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
      setError("Falha ao iniciar checkout.");
      setLoadingPlan(null);
    }
  };

  const handleOpenPortal = async () => {
    setLoadingPortal(true);
    try {
      const response = await apiCall('/api/stripe/portal', { method: 'POST' });
      if (response?.url) window.location.href = response.url;
    } catch (err) {
      setError("Não foi possível acessar o portal de gestão.");
      setLoadingPortal(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      trial: 'bg-blue-100 text-blue-700 border-blue-200',
      past_due: 'bg-amber-100 text-amber-700 border-amber-200',
      canceled: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const label: Record<string, string> = {
      active: 'Assinatura Ativa',
      trial: 'Modo Trial',
      past_due: 'Aguardando Pagamento',
      canceled: 'Cancelada',
    };
    return (
      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status || 'trial'] || styles.trial}`}>
        {label[status || 'trial'] || 'Trial'}
      </span>
    );
  };

  const planName = PLANS.find(p => p.id === user?.plan_tier)?.name || 'Trial';

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-slate-900 tracking-tight">Faturamento</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium opacity-70">Gerencie sua conta e upgrade de recursos.</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner">
          <button onClick={() => setBillingCycle('monthly')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}>Mensal</button>
          <button onClick={() => setBillingCycle('yearly')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}>Anual (-17%)</button>
        </div>
      </header>

      <Card className="mb-12 bg-slate-950 text-white overflow-hidden relative p-10 border-none shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={200} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4">
               {getStatusBadge((user as any)?.plan_status)}
               <h2 className="text-4xl font-black tracking-tight">Plano {planName}</h2>
               {(user as any)?.current_period_end && (
                 <p className="flex items-center gap-2 text-slate-400 font-medium italic">
                    <Calendar size={16} /> Próxima renovação em {new Date((user as any).current_period_end).toLocaleDateString('pt-BR')}
                 </p>
               )}
            </div>
            <Button variant="glass" onClick={handleOpenPortal} disabled={loadingPortal} className="h-16 px-10 text-xs">
               {loadingPortal ? <Loader2 className="animate-spin mr-3"/> : <CreditCard className="mr-3"/>}
               HISTÓRICO E GESTÃO <ExternalLink size={14} className="ml-3 opacity-40" />
            </Button>
         </div>
      </Card>

      {error && <div className="mb-10 bg-red-50 text-red-700 p-6 rounded-3xl font-bold flex items-center gap-3 border border-red-100"><AlertCircle /> {error}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selfServicePlans.map((plan) => {
          const isCurrent = user?.plan_tier === plan.id;
          const isYearly = billingCycle === 'yearly';
          const mainPrice = isYearly ? plan.yearlyPriceBRL! : plan.monthlyPriceBRL;
          const monthlyEquivalent = isYearly ? plan.yearlyPriceBRL! / 12 : null;

          return (
            <Card key={plan.id} className={`flex flex-col rounded-[40px] p-10 border-2 transition-all duration-500 ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-slate-100 hover:border-blue-200'}`}>
               <div className="mb-8">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{plan.name}</h3>
                 <div className="mt-6 flex flex-col min-h-[100px] justify-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold text-slate-400">R$</span>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{mainPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="text-slate-400 font-bold">/{isYearly ? 'ano' : 'mês'}</span>
                    </div>
                    {isYearly && <p className="text-[10px] font-black text-emerald-500 uppercase mt-3 tracking-widest">COBRADO ANUALMENTE (EQ. {formatBRL(monthlyEquivalent!)})</p>}
                 </div>
               </div>
               <ul className="space-y-4 mb-10 flex-1">
                 {plan.features.map((f, i) => <li key={i} className="flex gap-3 text-sm font-bold text-slate-600"><CheckCircle2 className="text-blue-600 shrink-0" size={18}/> {f}</li>)}
               </ul>
               <Button fullWidth size="lg" disabled={isCurrent || loadingPlan === plan.id} onClick={() => handleSubscribe(plan.id)} className="h-16">
                  {loadingPlan === plan.id ? <Loader2 className="animate-spin"/> : isCurrent ? 'PLANO ATUAL' : `ASSINAR ${plan.name.toUpperCase()}`}
               </Button>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Billing;
