
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Star, Zap, Gem, MessageCircle, TrendingUp
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
    // Cálculo preciso para evitar dízimas periódicas no front
    const displayPrice = isYearly && plan.priceYearly ? (plan.priceYearly / 12) : plan.priceMonthly;

    return (
      <div 
        key={plan.id} 
        className={`flex flex-col h-full rounded-[48px] transition-all duration-700 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] scale-105 z-10 p-1' 
            : 'bg-slate-900 border border-slate-800 shadow-xl hover:border-blue-500/30'
        }`}
      >
        <div className={plan.popular ? 'bg-blue-600 rounded-[46px] h-full p-10' : 'p-10 h-full flex flex-col'}>
          {plan.popular && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl">
              Mais Escolhido
            </div>
          )}

          <div className="flex justify-between items-start mb-8">
            <h3 className="text-2xl font-heading font-black tracking-tight">
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={24} className="text-amber-500" />}
          </div>

          <div className="mb-8 h-20 flex flex-col justify-center">
            {plan.isCustom ? (
              <div className="text-4xl font-heading font-black">Sob Medida</div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-lg font-bold opacity-60`}>R$</span>
                  <span className="text-5xl md:text-6xl font-heading font-black tracking-tighter">
                    {formatCurrency(displayPrice).replace('R$', '').trim()}
                  </span>
                  <span className="text-sm font-bold opacity-60">/mês</span>
                </div>
                {isYearly && plan.priceYearly && (
                  <span className="text-[11px] font-black uppercase tracking-widest mt-2 text-emerald-400">
                    Faturado anualmente
                  </span>
                )}
              </div>
            )}
          </div>

          <p className={`text-sm mb-12 leading-relaxed font-medium min-h-[48px] ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : 'glass'} 
            onClick={() => plan.isCustom || plan.id === 'enterprise' ? window.open(WHATSAPP_LINK, '_blank') : navigate('/register')}
            className={`h-16 text-sm font-black uppercase tracking-[0.15em] ${plan.popular ? 'text-blue-600 shadow-2xl' : ''}`}
          >
            {plan.isCustom || plan.id === 'enterprise' ? 'Consultar Especialista' : `Assinar agora`}
          </Button>

          <div className={`mt-12 pt-10 border-t ${plan.popular ? 'border-white/10' : 'border-slate-800'}`}>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-40">O que está incluso</p>
             <ul className="space-y-5">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <CheckCircle2 size={20} className={`${plan.popular ? 'text-white' : 'text-blue-500'} shrink-0`} />
                  <span className={`text-[14px] leading-tight font-bold ${plan.popular ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
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
      
      {/* Fixed WhatsApp FAB */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-[100] bg-emerald-500 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 group flex items-center gap-3"
      >
        <MessageCircle size={32} className="fill-white/20" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-700 font-black whitespace-nowrap text-xs uppercase tracking-widest">
          Falar com Comercial
        </span>
      </a>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md h-20' : 'bg-transparent h-28'}`}>
        <div className="container mx-auto px-8 h-full flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)}>
            <Logo size={isScrolled ? "md" : "lg"} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-12 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">Contato</button>
          </nav>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] hover:text-blue-600">Entrar</Link>
            <Button size="md" onClick={() => navigate('/teste-gratis')} className="px-10 h-14 shadow-2xl shadow-blue-600/20 uppercase text-[11px] font-black tracking-[0.2em]">
              Teste Grátis
            </Button>
          </div>

          <button className="lg:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 lg:pt-64 pb-32 overflow-hidden bg-slate-50/30">
        <div className="container mx-auto px-8 flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-[55%] text-center lg:text-left space-y-12 animate-fade-in-down">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.25em]">
              <TrendingUp size={16} />
              SST Intelligence 2025
            </div>
            
            <h1 className="text-6xl lg:text-[92px] font-heading font-black text-slate-900 leading-[0.9] tracking-[-0.05em]">
              Riscos <br/>
              Psicossociais <br/>
              <span className="text-blue-600">Automáticos.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              A plataforma definitiva para consultorias de SST realizarem diagnósticos da NR-17 e gerarem relatórios técnicos em segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-24 px-16 text-2xl shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all font-black">
                Iniciar Demo
                <ArrowRight className="ml-4 w-8 h-8" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('features')} className="h-24 px-16 text-2xl bg-white border-2 border-slate-200 font-black">
                Recursos
              </Button>
            </div>
          </div>

          <div className="lg:w-[45%] w-full">
            <div className="relative group perspective-1000">
              <div className="bg-white rounded-[60px] shadow-[0_100px_150px_-40px_rgba(0,0,0,0.2)] border-[16px] border-white overflow-hidden transition-all duration-1000 transform group-hover:rotate-y-[-4deg] group-hover:rotate-x-[2deg]">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">app.nrzen.com.br</div>
                </div>
                <div className="p-12 space-y-12">
                   <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-2xl font-heading font-black text-slate-900">Dashboard Executivo</h4>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Visão Geral da Carteira</p>
                      </div>
                      <BarChart3 className="text-blue-600" size={40} />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">Empresas</span>
                        <span className="text-6xl font-heading font-black text-blue-900">18</span>
                      </div>
                      <div className="bg-indigo-50 rounded-[32px] p-8 border border-indigo-100">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] block mb-2">Vidas</span>
                        <span className="text-6xl font-heading font-black text-indigo-900">487</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - FULL REDESIGN */}
      <section id="pricing" className="py-48 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-32 space-y-8">
            <h2 className="text-5xl lg:text-7xl font-heading font-black tracking-tight leading-tight">
              Investimento para sua <br/> consultoria crescer.
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
              Pague apenas pelo volume de avaliações mensais. Escolha o plano que melhor se adapta à sua escala atual.
            </p>
            
            <div className="flex justify-center items-center gap-10 pt-12">
              <span className={`text-xs font-black uppercase tracking-[0.3em] transition-all ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                className="w-24 h-12 bg-slate-900 rounded-full relative p-2 transition-all border border-slate-800 shadow-inner group"
              >
                <div className={`w-8 h-8 bg-blue-600 rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.8)] ${billingCycle === 'yearly' ? 'translate-x-12 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <div className="flex flex-col items-start">
                <span className={`text-xs font-black uppercase tracking-[0.3em] transition-all ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'}`}>Anual</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-black mt-1 uppercase tracking-widest">
                  Economize 17%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch max-w-7xl mx-auto">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-40 border-t border-slate-900 pt-24 max-w-6xl mx-auto">
             {[
               { title: "Escalabilidade", desc: "Aumente ou diminua seu plano a qualquer momento conforme a demanda de seus clientes." },
               { title: "Segurança Bancária", desc: "Pagamentos processados via Stripe com criptografia de ponta a ponta e total segurança." },
               { title: "Suporte Técnico", desc: "Dúvidas sobre o questionário? Nossos engenheiros de segurança estão prontos para ajudar." }
             ].map((item, i) => (
               <div key={i} className="text-center space-y-6">
                  <h4 className="text-xl font-heading font-black uppercase tracking-widest text-blue-500">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <Logo size="md" />
          <div className="flex gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-blue-600 transition-colors">SAC</a>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2025 NR ZEN • Tecnologia para SST.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
