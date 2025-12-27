
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Star, ShieldCheck, Zap, HeartHandshake, Unlock, 
  ChevronDown, ChevronUp, Play, Gem, TrendingUp
} from 'lucide-react';
import Button from '../components/Button.tsx';
import { Logo } from '../components/Layout.tsx';
import { PLANS, formatBRL, PlanConfig, BillingCycle } from '../config/plans.ts';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (planId: string) => {
    // Redireciona para o orquestrador de checkout
    navigate(`/checkout/start?plan=${planId}&cycle=${billingCycle}`);
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
    const mainPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL : plan.monthlyPriceBRL;
    const subPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL / 12 : null;

    return (
      <div 
        key={plan.id}
        className={`flex flex-col h-full rounded-[40px] transition-all duration-500 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-2xl scale-105 z-10 p-1' 
            : plan.id === 'enterprise' 
              ? 'bg-slate-900 text-white border border-slate-800 p-6'
              : 'bg-white border border-slate-200 hover:border-blue-300 p-6 shadow-sm'
        }`}
      >
        <div className={`${plan.popular ? 'bg-blue-600 rounded-[38px] h-full p-8 flex flex-col' : 'flex flex-col h-full'}`}>
          {plan.popular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              MAIS ESCOLHIDO
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-heading font-black tracking-tight uppercase">
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={22} className="text-amber-500" />}
          </div>

          <div className="mb-8 min-h-[100px] flex flex-col justify-center">
            {plan.isCustom ? (
              <div className="text-3xl font-heading font-black">Sob Medida</div>
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold opacity-60">R$</span>
                  <span className="text-5xl font-heading font-black tracking-tighter">
                    {mainPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </span>
                  <span className="text-sm font-bold opacity-40">/{isYearly ? 'ano' : 'mês'}</span>
                </div>
                {isYearly && subPrice && (
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-2">
                    Equivalente a {formatBRL(subPrice)}/mês
                  </p>
                )}
              </>
            )}
          </div>

          <p className={`text-sm mb-10 leading-relaxed font-medium min-h-[48px] ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : (plan.id === 'enterprise' ? 'glass' : 'secondary')} 
            onClick={() => plan.id === 'enterprise' 
              ? window.open('https://wa.me/5511980834641?text=Olá! Gostaria de saber mais sobre o plano Enterprise.', '_blank')
              : handleSubscribe(plan.id)}
            className={`h-14 ${plan.popular ? 'text-blue-700 font-black' : ''}`}
          >
            {plan.isCustom ? 'Falar com Consultor' : 'ASSINAR AGORA'}
          </Button>

          <div className={`mt-10 pt-10 border-t flex-1 ${plan.popular ? 'border-white/10' : 'border-slate-100'}`}>
            <ul className="space-y-4 text-sm font-bold">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className={`${plan.popular ? 'text-white' : 'text-blue-600'} shrink-0 mt-0.5`} />
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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md h-20 shadow-md border-b border-slate-100' : 'bg-transparent h-24'}`}>
        <div className="container mx-auto px-10 h-full flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size={isScrolled ? "md" : "lg"} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-12 font-heading font-black text-[11px] uppercase tracking-[0.2em] text-slate-900">
            <button onClick={() => navigate('/teste-gratis')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
          </nav>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/login" className="text-slate-900 font-heading font-black text-[11px] uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
              Entrar
            </Link>
            <Button size="md" onClick={() => navigate('/register')} className="shadow-2xl shadow-blue-600/30">
              Conta (Trial)
            </Button>
          </div>

          <button className="lg:hidden text-slate-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
              <Star size={14} className="fill-blue-600" />
              CONFORMIDADE NR-01 & NR-17
            </div>
            
            <h1 className="text-6xl lg:text-[80px] font-heading font-black text-slate-900 leading-[0.95] tracking-tight">
              Gestão de Riscos <br/>
              <span className="text-blue-600">Psicossociais.</span>
            </h1>
            
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium italic">
              A plataforma definitiva para consultorias de SST realizarem diagnósticos, gerarem relatórios técnicos e planos de ação automatizados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <Button size="lg" onClick={() => navigate('/register')} className="h-20 px-12 text-base shadow-2xl shadow-blue-600/20">
                COMEÇAR AGORA
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('pricing')} className="h-20 px-12 text-base bg-white border-2">
                VER PLANOS
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-[48px] shadow-2xl border-[16px] border-white overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-700">
               <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/20"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/20"></div>
                  </div>
                  app.nrzen.com.br
               </div>
               <div className="p-12 space-y-10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-slate-900">Visão Geral</h4>
                    <BarChart3 className="text-blue-600" size={32} />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Empresas</span>
                        <span className="text-5xl font-black text-blue-900 tracking-tighter">24</span>
                     </div>
                     <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Adesão</span>
                        <span className="text-5xl font-black text-emerald-900 tracking-tighter">89%</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-heading font-black tracking-tight">Escala para sua <br/> consultoria crescer.</h2>
            <p className="text-slate-400 text-xl font-medium opacity-80">Pague pelo volume de avaliações e profissionalize sua entrega técnica.</p>

            <div className="flex items-center justify-center gap-8 mt-12">
              <span className={`text-[12px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'}`}>
                Mensal
              </span>
              
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-20 h-10 bg-slate-900 rounded-full p-1 relative border-2 border-slate-800"
              >
                <div className={`w-7 h-7 bg-blue-600 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${billingCycle === 'yearly' ? 'translate-x-10 bg-emerald-400' : 'translate-x-0'}`}>
                   {billingCycle === 'yearly' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </button>
              
              <div className="flex flex-col items-start">
                <span className={`text-[12px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'}`}>
                  Anual
                </span>
                <span className="bg-emerald-500 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded mt-1 animate-pulse tracking-tighter">
                  Ganhe 2 meses
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch max-w-7xl mx-auto">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>
        </div>
      </section>

      <footer className="py-20 bg-white border-t border-slate-100 text-center">
        <Logo size="md" className="mx-auto mb-8" />
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">&copy; 2025 NR ZEN • TECNOLOGIA PARA SST</p>
      </footer>
    </div>
  );
};

export default LandingPage;
