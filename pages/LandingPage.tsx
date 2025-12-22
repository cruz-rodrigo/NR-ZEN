
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, 
  Menu, X, Star, ShieldCheck, Zap, HeartHandshake, Unlock, 
  Play, Gem
} from 'lucide-react';
/* Fix: Correcting imports to point to root components and constants */
import Button from '../components/Button';
import { Logo } from '../components/Layout';
import { APP_URL } from '../constants';
/* Fix: Importing plans from src/config as they don't exist in root config */
import { PLANS, formatCurrency, PlanConfig } from '../src/config/plans';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (plan: PlanConfig) => {
    if (plan.id === 'enterprise' || plan.isCustom) {
      window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o plano Enterprise do NR ZEN.', '_blank');
      return;
    }
    navigate(`/checkout/start?plan=${plan.id}&cycle=${billingCycle}`);
  };

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

  const renderPriceCard = (plan: PlanConfig) => {
    const isYearly = billingCycle === 'yearly';
    const hasYearlyOption = plan.priceYearly !== null;
    
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
              <>
                {isYearly && hasYearlyOption && (
                   <span className={`text-xs line-through opacity-50 block`}>
                     {formatCurrency(plan.priceMonthly)}/mês
                   </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatCurrency(displayPrice)}</span>
                  <span className="text-sm opacity-60">/mês</span>
                </div>
                {isYearly && hasYearlyOption && (
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">
                    Cobrado {formatCurrency(plan.priceYearly!)}/ano
                  </p>
                )}
              </>
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
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 opacity-50`}>
              Recursos Inclusos
            </p>
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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:opacity-80 transition-opacity">
            <Logo size="lg" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 transition-colors">Como Funciona</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 text-sm transition-colors px-3 py-2">
              Entrar
            </Link>
            {/* Fix: Added navigate call for 'Teste Grátis' route */}
            <Button size="md" onClick={() => navigate('/teste-gratis')} className="shadow-lg shadow-blue-600/20">
              Teste Grátis
            </Button>
          </div>

          <button className="md:hidden text-slate-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fade-in-down">
            <div className="flex flex-col p-6 gap-4">
              <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600 py-2 border-b border-slate-50">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left font-medium text-slate-600 py-2 border-b border-slate-50">Planos</button>
              <Link to="/login" className="font-bold text-slate-800 py-2">Fazer Login</Link>
              <Button fullWidth onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                Começar Teste Grátis
              </Button>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left space-y-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Star size={12} className="fill-blue-600" />
              Nova NR-01 & NR-17
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Gestão de Riscos Psicossociais <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Simples e Automática.
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              A plataforma completa para consultorias de SST realizarem diagnósticos psicossociais, gerarem relatórios técnicos e planos de ação em conformidade com o eSocial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {/* Fix: Added navigate call for 'Começar agora' route and using ArrowRight icon */}
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-14 px-8 text-base shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('how-it-works')} className="h-14 px-8 text-base bg-white/80 backdrop-blur">
                <Play size={18} className="mr-2 fill-slate-700" />
                Ver como funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Principais Funcionalidades</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Users, title: "Coleta Anônima", desc: "Garanta a sinceridade com coletas seguras." },
                    { icon: BarChart3, title: "Análise em Tempo Real", desc: "Veja os resultados logo após o envio." },
                    { icon: FileCheck, title: "Relatórios de Conformidade", desc: "PDFs prontos para o PGR." }
                ].map((f, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <f.icon className="mx-auto text-blue-600 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                        <p className="text-slate-500 text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Planos flexíveis para sua consultoria</h2>
            <div className="flex items-center justify-center gap-6 mt-8 mb-4">
              <span className={`text-base font-bold tracking-wide transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-20 h-10 bg-slate-800 rounded-full p-1 relative transition-all duration-300 border-2 border-slate-600"
              >
                <div className={`w-7 h-7 bg-blue-500 rounded-full shadow-lg transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-10 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-base font-bold tracking-wide transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Anual <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded">-17% OFF</span>
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 text-center">
            <Logo size="md" className="mx-auto mb-4 opacity-50 grayscale" />
            <p className="text-xs text-slate-400">&copy; 2025 NR ZEN Tecnologia Ltda.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
