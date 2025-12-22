
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Gem, MessageCircle, TrendingUp, ShieldCheck, Lock
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
    // Cálculo rigoroso do preço mensal do anual
    const displayPrice = isYearly && plan.priceYearly ? (plan.priceYearly / 12) : plan.priceMonthly;

    return (
      <div 
        key={plan.id} 
        className={`flex flex-col h-full rounded-[40px] transition-all duration-500 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-[0_30px_60px_-10px_rgba(37,99,235,0.3)] scale-100 lg:scale-105 z-10 p-1' 
            : 'bg-slate-900 border border-slate-800 shadow-xl'
        }`}
      >
        <div className={plan.popular ? 'bg-blue-600 rounded-[38px] h-full p-8 lg:p-10 flex flex-col' : 'p-8 lg:p-10 h-full flex flex-col'}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
              Mais Escolhido
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-heading font-black tracking-tight uppercase opacity-90">
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={20} className="text-amber-500" />}
          </div>

          <div className="mb-8 min-h-[80px] flex flex-col justify-center">
            {plan.isCustom ? (
              <div className="text-3xl font-heading font-black">Sob Medida</div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-bold opacity-60`}>R$</span>
                  <span className="text-4xl lg:text-5xl font-heading font-black tracking-tighter">
                    {formatCurrency(displayPrice).replace('R$', '').trim()}
                  </span>
                  <span className="text-sm font-bold opacity-60">/mês</span>
                </div>
                {isYearly && plan.priceYearly && (
                  <span className="text-[10px] font-black uppercase tracking-widest mt-3 text-emerald-400">
                    Contrato Anual
                  </span>
                )}
              </div>
            )}
          </div>

          <p className={`text-xs mb-8 leading-relaxed font-medium min-h-[40px] ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : 'glass'} 
            onClick={() => plan.isCustom || plan.id === 'enterprise' ? window.open(WHATSAPP_LINK, '_blank') : navigate('/register')}
            className={`h-14 text-xs font-black uppercase tracking-[0.1em] ${plan.popular ? 'text-blue-600' : ''}`}
          >
            {plan.isCustom || plan.id === 'enterprise' ? 'Falar com Comercial' : `Assinar Agora`}
          </Button>

          <div className={`mt-8 pt-8 border-t ${plan.popular ? 'border-white/10' : 'border-slate-800'}`}>
             <ul className="space-y-4">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={16} className={`${plan.popular ? 'text-white' : 'text-blue-500'} shrink-0 mt-0.5`} />
                  <span className={`text-[13px] leading-snug font-bold ${plan.popular ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
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
      
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md h-16' : 'bg-transparent h-24'}`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)}>
            <Logo size={isScrolled ? "sm" : "md"} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">Contato</button>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-600">Entrar</Link>
            <Button size="sm" onClick={() => navigate('/teste-gratis')} className="px-8 h-12 uppercase text-[10px] font-black tracking-[0.15em]">
              Teste Grátis
            </Button>
          </div>

          <button className="lg:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full bg-white h-screen z-[60] p-10 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <Logo />
              <button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
            </div>
            <nav className="flex flex-col gap-8 text-2xl font-black uppercase tracking-widest text-slate-900">
              <button onClick={() => scrollToSection('features')} className="text-left">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left">Planos</button>
              <Link to="/login">Entrar</Link>
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="mt-4">Começar Agora</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-56 pb-20 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-[50%] text-center lg:text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-[0.2em]">
              <TrendingUp size={14} />
              Inteligência de Riscos Ocupacionais
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[72px] font-heading font-black text-slate-900 leading-[1.05] tracking-[-0.04em]">
              Riscos <br/>
              Psicossociais <br/>
              <span className="text-blue-600">Automáticos.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              A plataforma definitiva para automatizar diagnósticos da <strong>NR-17 e NR-01</strong>. Transforme dados em relatórios técnicos em segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-20 px-12 text-xl shadow-xl hover:scale-105 active:scale-95 transition-all font-black">
                Iniciar Demo
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('features')} className="h-20 px-12 text-xl bg-white border-2 border-slate-200 font-black">
                Ver Recursos
              </Button>
            </div>
          </div>

          <div className="lg:w-[50%] w-full">
            <div className="relative">
              <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] border-white overflow-hidden transition-all duration-1000">
                <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/30"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/30"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/30"></div>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">app.nrzen.com.br</div>
                </div>
                <div className="p-8 lg:p-12 space-y-10">
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-heading font-black text-slate-900">Dashboard Executivo</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">SST Intelligence</p>
                      </div>
                      <BarChart3 className="text-blue-600" size={32} />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-[24px] p-6 border border-blue-100/50">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">Empresas</span>
                        <span className="text-4xl font-heading font-black text-blue-900">24</span>
                      </div>
                      <div className="bg-indigo-50 rounded-[24px] p-6 border border-indigo-100/50">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] block mb-2">Monitorados</span>
                        <span className="text-4xl font-heading font-black text-indigo-900">892</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-40 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-black tracking-tight leading-tight">
              Investimento para <br className="hidden md:block" /> sua consultoria crescer.
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-xl mx-auto opacity-80">
              Escolha o plano baseado no seu volume mensal de avaliações. Altere a qualquer momento.
            </p>
            
            <div className="flex justify-center items-center gap-8 pt-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 bg-slate-900 rounded-full relative p-1 transition-all border border-slate-800"
              >
                <div className={`w-6 h-6 bg-blue-600 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] ${billingCycle === 'yearly' ? 'translate-x-8 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <div className="flex flex-col items-start">
                <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'}`}>Anual</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-black mt-1 uppercase tracking-widest">
                  2 Meses Grátis
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 border-t border-slate-900 pt-20 max-w-5xl mx-auto">
             {[
               { icon: ShieldCheck, title: "Preço Vitalício", desc: "Sua mensalidade nunca sofrerá reajustes enquanto o plano estiver ativo." },
               { icon: Lock, title: "Sem Fidelidade", desc: "Cancele a qualquer momento direto pelo painel. Simples e transparente." },
               { icon: Users, title: "Time Técnico", desc: "Suporte especializado direto com Engenheiros de Segurança do Trabalho." }
             ].map((item, i) => (
               <div key={i} className="text-center space-y-4 px-4">
                  <div className="w-12 h-12 bg-slate-900 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <item.icon size={22} />
                  </div>
                  <h4 className="text-sm font-heading font-black uppercase tracking-widest text-blue-500">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo size="md" />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center md:text-right">
            © NR ZEN • TECNOLOGIA PARA SST <br className="md:hidden" /> 
            <span className="hidden md:inline ml-4 opacity-50">|</span> 
            <span className="ml-4 uppercase">CNPJ 55.119.808/3464-1</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
