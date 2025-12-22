
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Star, ShieldCheck, Zap, Play, Gem
} from 'lucide-react';
import Button from '../components/Button.tsx';
import { Logo } from '../components/Layout.tsx';
import { PLANS, formatCurrency, PlanConfig } from '../src/config/plans.ts';

/**
 * NR ZEN Marketing Landing Page
 * Handles product visualization, pricing cycles, and primary conversion funnels.
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Fixed: scroll logic for landing page navigation
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (plan: PlanConfig) => {
    if (plan.id === 'enterprise' || plan.isCustom) {
      window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o plano Enterprise do NR ZEN.', '_blank');
      return;
    }
    navigate(`/checkout/start?plan=${plan.id}&cycle=${billingCycle}`);
  };

  const renderPriceCard = (plan: PlanConfig) => {
    const isYearly = billingCycle === 'yearly';
    const displayPrice = isYearly && plan.priceYearly 
      ? plan.priceYearly / 12 
      : plan.priceMonthly;

    return (
      <div 
        key={plan.id}
        className={`flex flex-col h-full rounded-3xl transition-all duration-300 relative ${
          plan.popular 
            ? 'bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-2xl scale-105 z-10 p-1' 
            : plan.id === 'enterprise' 
              ? 'bg-[#0B1120] text-white border border-[#1E293B] hover:border-amber-500/40 p-6'
              : 'bg-white border border-slate-200 hover:border-blue-300 p-6 shadow-sm'
        }`}
      >
        <div className={`${plan.popular ? 'bg-blue-600 rounded-[22px] h-full p-6' : ''}`}>
          {plan.popular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Mais Escolhido
            </div>
          )}

          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg font-bold tracking-tight ${plan.id === 'enterprise' ? 'group-hover:text-amber-400' : ''}`}>
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={20} className="text-amber-500" />}
          </div>

          <div className="mb-4 min-h-[80px]">
            {plan.isCustom ? (
              <div className="text-3xl font-bold">Sob Medida</div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formatCurrency(displayPrice)}</span>
                <span className="text-sm opacity-60">/mês</span>
              </div>
            )}
          </div>

          <p className={`text-sm mb-6 italic min-h-[48px] ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : (plan.id === 'enterprise' ? 'dark' : 'secondary')} 
            onClick={() => handleSubscribe(plan)}
            className={`mb-8 ${plan.popular ? 'text-blue-700 font-bold' : ''}`}
          >
            {plan.isCustom ? 'Falar com Consultor' : `Assinar ${plan.name}`}
          </Button>

          <div className={`border-t pt-6 flex-1 ${plan.popular ? 'border-white/10' : 'border-slate-100'}`}>
            <ul className="space-y-3 text-sm">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <CheckCircle2 size={16} className={`${plan.popular ? 'text-blue-200' : 'text-blue-500'} shrink-0 mt-0.5`} />
                  <span className={plan.popular ? 'text-blue-50' : 'text-slate-600'}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)}>
            <Logo size="lg" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600">Funcionalidades</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600">Como Funciona</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600">Planos</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold text-sm px-3">Entrar</Link>
            <Button size="md" onClick={() => navigate('/teste-gratis')}>Teste Grátis</Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <section className="relative pt-48 pb-32">
        <div className="container mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-6xl font-heading font-extrabold text-slate-900 leading-[1.1]">
              Gestão de Riscos Psicossociais <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simples e Automática.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl">Plataforma para consultorias de SST realizarem diagnósticos psicossociais e gerarem relatórios para o PGR/eSocial.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/teste-gratis')}>Começar agora <ArrowRight className="ml-2 w-5 h-5" /></Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('how-it-works')}><Play size={18} className="mr-2" /> Ver Demo</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">Recursos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Coleta Segura", desc: "Anonimato garantido em conformidade com LGPD." },
              { icon: BarChart3, title: "Análise Realtime", desc: "Geração instantânea de scores de risco." },
              { icon: FileCheck, title: "Relatórios PGR", desc: "PDFs técnicos prontos para entrega oficial." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200">
                <f.icon className="text-blue-600 mb-4 mx-auto" size={32} />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">Planos e Preços</h2>
            <div className="flex justify-center gap-6">
              <button onClick={() => setBillingCycle('monthly')} className={billingCycle === 'monthly' ? 'text-blue-400 font-bold' : 'text-slate-500'}>Mensal</button>
              <button onClick={() => setBillingCycle('yearly')} className={billingCycle === 'yearly' ? 'text-blue-400 font-bold' : 'text-slate-500'}>Anual (-17%)</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Fixed: Default export to satisfy App.tsx import requirements
export default LandingPage;
