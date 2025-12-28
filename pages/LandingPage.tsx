import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Gem, MessageCircle, TrendingUp, ShieldCheck, Lock, Send, Loader2
} from 'lucide-react';
import Button from '../components/Button.tsx';
import { Logo } from '../components/Layout.tsx';
import { PLANS, formatBRL, PlanConfig, BillingCycle } from '../config/plans.ts';
import { setCheckoutIntent, PlanSlug } from '../lib/checkoutIntent.ts';

const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-down border border-slate-100">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>
        <div className="p-10">
          {sent ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Mensagem Enviada!</h3>
              <p className="text-slate-500 font-medium">Nosso time técnico entrará em contato em breve.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Fale com a NR ZEN</h3>
                <p className="text-slate-500 font-medium mt-1">Dúvidas técnicas ou planos corporativos.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Seu Nome</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" placeholder="Ex: João Silva" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">E-mail</label>
                  <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" placeholder="voce@empresa.com.br" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mensagem</label>
                  <textarea required rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium resize-none" placeholder="Como podemos ajudar?" />
                </div>
                <Button fullWidth size="lg" disabled={loading} className="h-16 shadow-xl shadow-blue-600/20 uppercase tracking-[0.2em] text-xs">
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Enviar Mensagem</>}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (planId: string) => {
    // 1. Salva a intenção de compra de forma persistente
    setCheckoutIntent({ 
      plan: planId as PlanSlug, 
      cycle: billingCycle 
    });
    // 2. Inicia o fluxo pelo orquestrador central
    navigate('/checkout/start');
  };

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
    const mainPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL : plan.monthlyPriceBRL;
    const subPrice = isYearly && plan.yearlyPriceBRL ? plan.yearlyPriceBRL / 12 : null;

    return (
      <div 
        key={plan.id} 
        className={`flex flex-col h-full rounded-[32px] transition-all duration-500 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-xl scale-100 lg:scale-105 z-10 p-1' 
            : 'bg-slate-900 border border-slate-800 shadow-lg'
        }`}
      >
        <div className={plan.popular ? 'bg-blue-600 rounded-[30px] h-full p-8 flex flex-col' : 'p-8 h-full flex flex-col'}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Popular
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-heading font-black tracking-tight uppercase opacity-90">
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={18} className="text-amber-500" />}
          </div>

          <div className="mb-6 min-h-[70px] flex flex-col justify-center">
            {plan.isCustom ? (
              <div className="text-2xl font-heading font-black">Sob Medida</div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold opacity-60">R$</span>
                  <span className="text-4xl font-heading font-black tracking-tighter">
                    {mainPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs font-bold opacity-60">/{isYearly ? 'ano' : 'mês'}</span>
                </div>
                {isYearly && subPrice && (
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-emerald-400">
                    Equivalente a {formatBRL(subPrice)}/mês
                  </p>
                )}
                {!isYearly && (
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-40">
                    Faturamento Mensal
                  </p>
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
            onClick={() => plan.isCustom || plan.id === 'enterprise' 
              ? window.open("https://wa.me/5511980834641?text=Olá! Gostaria de saber mais sobre o plano Enterprise.", '_blank') 
              : handleSubscribe(plan.id)}
            className={`h-12 text-[10px] font-black uppercase tracking-[0.1em] ${plan.popular ? 'text-blue-600' : ''}`}
          >
            {plan.isCustom ? 'Falar com Consultor' : 'Assinar Agora'}
          </Button>

          <div className={`mt-8 pt-8 border-t ${plan.popular ? 'border-white/10' : 'border-slate-800'}`}>
             <ul className="space-y-3">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <CheckCircle2 size={14} className={`${plan.popular ? 'text-white' : 'text-blue-500'} shrink-0 mt-0.5`} />
                  <span className={`text-xs font-bold ${plan.popular ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
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
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md h-20' : 'bg-transparent h-24'}`}>
        <div className="container mx-auto px-10 h-full flex items-center justify-between">
          <Link to="/">
            <Logo size={isScrolled ? "md" : "lg"} />
          </Link>
          <nav className="hidden lg:flex items-center gap-12 font-heading font-black text-[13px] uppercase tracking-[0.2em] text-slate-900">
            <button onClick={() => navigate('/teste-gratis')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-blue-600 transition-colors">Contato</button>
          </nav>
          <div className="hidden lg:flex items-center gap-10">
            <Link to="/login" className="text-slate-900 font-heading font-black text-[13px] uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">Entrar</Link>
            <Button size="md" onClick={() => navigate('/register')} className="px-10 h-14 uppercase text-[12px] font-black tracking-[0.2em] shadow-xl shadow-blue-600/30">
              Teste Grátis
            </Button>
          </div>
          <button className="lg:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      <section className="relative pt-40 lg:pt-56 pb-20 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-[50%] text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-[0.2em]">
              <TrendingUp size={12} />
              Inteligência de Riscos Ocupacionais
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-heading font-black text-slate-900 leading-[1.05] tracking-tight">
              Riscos <br/>
              Psicossociais <br/>
              <span className="text-blue-600">Automáticos.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              A plataforma definitiva para automatizar diagnósticos da <strong>NR-17 e NR-01</strong>. Transforme dados em relatórios técnicos em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-16 px-10 text-lg shadow-xl font-black">
                Iniciar Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('pricing')} className="h-16 px-10 text-lg bg-white border-2 border-slate-200 font-black">
                Ver Recursos
              </Button>
            </div>
          </div>
          <div className="lg:w-[50%] w-full">
            <div className="relative group">
              <div className="bg-white rounded-[40px] shadow-2xl border-[12px] border-white overflow-hidden transition-all duration-700 hover:scale-[1.02]">
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/30"></div>
                  </div>
                  app.nrzen.com.br
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

      <section id="pricing" className="py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight">Escala para sua <br/> consultoria crescer.</h2>
            <p className="text-slate-400 text-lg font-medium opacity-80">Escolha o plano baseado no seu volume mensal de avaliações. Altere a qualquer momento sem burocracia.</p>
            
            <div className="flex justify-center items-center gap-6 pt-6">
              <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-7 bg-slate-900 rounded-full relative p-1 transition-all border border-slate-800"
              >
                <div className={`w-5 h-5 bg-blue-600 rounded-full transition-all duration-300 ${billingCycle === 'yearly' ? 'translate-x-7 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <div className="flex flex-col items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Anual</span>
                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black mt-1 uppercase tracking-tighter">Ganhe 2 meses</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>
        </div>
      </section>

      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo size="md" />
          <div className="flex gap-8 font-heading font-black text-[10px] uppercase tracking-widest text-slate-400">
             <button onClick={() => setIsContactOpen(true)} className="hover:text-blue-600 transition-colors">Suporte</button>
             <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">© NR ZEN • TECNOLOGIA PARA SST</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;