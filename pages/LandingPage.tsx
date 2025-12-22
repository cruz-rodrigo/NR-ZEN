
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Star, Zap, Play, Gem, MessageCircle, ShieldCheck, 
  TrendingUp, MousePointer2
} from 'lucide-react';
import Button from '../components/Button.tsx';
import { Logo } from '../components/Layout.tsx';
import { PLANS, formatCurrency, PlanConfig } from '../src/config/plans.ts';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isScrolled, setIsScrolled] = useState(false);

  const WHATSAPP_LINK = "https://wa.me/5511980834641?text=Olá! Gostaria de saber mais sobre o NR ZEN.";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const renderPriceCard = (plan: PlanConfig) => {
    const isYearly = billingCycle === 'yearly';
    const displayPrice = isYearly && plan.priceYearly ? plan.priceYearly / 12 : plan.priceMonthly;

    return (
      <div 
        key={plan.id} 
        className={`flex flex-col h-full rounded-[40px] transition-all duration-500 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] scale-105 z-10 p-1' 
            : 'bg-slate-900 border border-slate-800 shadow-sm hover:border-blue-500/50'
        }`}
      >
        <div className={plan.popular ? 'bg-blue-600 rounded-[38px] h-full p-8' : 'p-8 h-full flex flex-col'}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-[0.1em] shadow-xl">
              Mais Escolhido
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <h3 className={`text-xl font-heading font-extrabold ${plan.popular ? 'text-white' : 'text-white'}`}>
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={22} className="text-amber-500" />}
          </div>

          <div className="mb-6">
            {plan.isCustom ? (
              <div className={`text-3xl font-heading font-black text-white`}>Sob Medida</div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className={`text-sm font-bold opacity-60 ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>R$</span>
                <span className={`text-5xl font-heading font-black tracking-tighter text-white`}>{displayPrice}</span>
                <span className={`text-sm font-bold opacity-60 ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>/mês</span>
              </div>
            )}
          </div>

          <p className={`text-sm mb-10 leading-relaxed font-medium min-h-[40px] ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : 'glass'} 
            onClick={() => plan.isCustom || plan.id === 'enterprise' ? window.open(WHATSAPP_LINK, '_blank') : navigate('/register')}
            className={`h-14 text-sm font-black uppercase tracking-widest ${plan.popular ? 'text-blue-600 shadow-xl' : ''}`}
          >
            {plan.isCustom || plan.id === 'enterprise' ? 'Falar com Consultor' : `Começar agora`}
          </Button>

          <div className={`mt-10 pt-8 border-t ${plan.popular ? 'border-white/10' : 'border-slate-800'}`}>
             <ul className="space-y-4">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className={`${plan.popular ? 'text-blue-200' : 'text-blue-500'} shrink-0 mt-0.5`} />
                  <span className={`text-[13px] leading-tight font-semibold ${plan.popular ? 'text-white/90' : 'text-slate-300'}`}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      {/* WhatsApp FAB */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-emerald-500 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 group flex items-center gap-3"
      >
        <MessageCircle size={28} className="fill-white/20" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-sm tracking-tight">
          Suporte NR ZEN
        </span>
      </a>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md h-20' : 'bg-transparent h-28'}`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)}>
            <Logo size={isScrolled ? "md" : "lg"} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 font-bold text-[13px] uppercase tracking-widest text-slate-500">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">Contato</button>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-slate-600 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-all">Entrar</Link>
            <Button size="md" onClick={() => navigate('/teste-gratis')} className="px-8 h-12 shadow-2xl shadow-blue-600/20 uppercase text-xs tracking-widest">
              Teste Grátis
            </Button>
          </div>

          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 lg:pt-60 pb-32 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2 text-center lg:text-left space-y-10 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">
              <TrendingUp size={14} />
              Plataforma de Gestão de Riscos
            </div>
            <h1 className="text-5xl lg:text-[84px] font-heading font-black text-slate-900 leading-[0.95] tracking-[-0.04em]">
              Fatores de Riscos <br/>
              Psicossociais <br/>
              <span className="text-blue-600">de forma automática.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Gere relatórios completos em conformidade com a <strong>nova NR-01, NR-17 e Guia MTE.</strong> Mantenha sua empresa em conformidade e evite multas.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-20 px-12 text-xl shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all">
                Iniciar Demonstração
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('features')} className="h-20 px-12 text-xl bg-white border-slate-200">
                Conhecer Recursos
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative group perspective-1000">
              <div className="bg-white rounded-[40px] shadow-[0_80px_100px_-30px_rgba(0,0,0,0.15)] border-[12px] border-white overflow-hidden transition-all duration-1000 transform group-hover:rotate-y-[-2deg] group-hover:rotate-x-[1deg]">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">app.nrzen.com.br</div>
                </div>
                <div className="p-10 space-y-10">
                   <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-xl font-heading font-black text-slate-900">Dashboard Executivo</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Visão Geral da Carteira</p>
                      </div>
                      <BarChart3 className="text-blue-600" size={32} />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Empresas Ativas</span>
                        <span className="text-5xl font-heading font-black text-blue-900">18</span>
                      </div>
                      <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Vidas Impactadas</span>
                        <span className="text-5xl font-heading font-black text-indigo-900">487</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - RESTAURAÇÃO DO DARK THEME */}
      <section id="pricing" className="py-40 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-heading font-black tracking-tight">Planos por volume de avaliações</h2>
            <p className="text-slate-400 text-xl font-medium">Pague apenas pelo número de avaliações mensais e cresça no seu ritmo.</p>
            
            <div className="flex justify-center items-center gap-8 pt-10">
              <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                className="w-20 h-10 bg-slate-900 rounded-full relative p-1.5 transition-all border border-slate-800"
              >
                <div className={`w-6 h-6 bg-blue-500 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.6)] ${billingCycle === 'yearly' ? 'translate-x-10 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'}`}>
                Anual <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-3 py-1 rounded-full border border-emerald-500/30 font-black">2 MESES GRÁTIS</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-40 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-6xl font-heading font-black text-slate-900 mb-8">Agende uma conversa</h2>
            <div className="max-w-xl mx-auto bg-slate-50 p-10 rounded-[48px] border border-slate-100 shadow-2xl">
               <form className="space-y-6 text-left" onSubmit={(e) => { e.preventDefault(); window.open(WHATSAPP_LINK, '_blank'); }}>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Nome completo</label>
                    <input required type="text" placeholder="João Silva" className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold" />
                  </div>
                  <Button fullWidth size="lg" className="h-20 text-lg uppercase tracking-widest font-black shadow-xl shadow-blue-600/30">
                    Solicitar Contato
                  </Button>
               </form>
            </div>
        </div>
      </section>

      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo size="md" />
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">© 2025 NR ZEN. Tecnologia para SST.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
