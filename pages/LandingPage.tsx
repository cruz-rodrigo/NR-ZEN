
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Users, FileCheck, 
  Menu, X, Gem, MessageCircle, TrendingUp, ShieldCheck, Lock, Send, Loader2
} from 'lucide-react';
import Button from '../components/Button.tsx';
import { Logo } from '../components/Layout.tsx';
import { PLANS, formatCurrency, PlanConfig } from '../src/config/plans.ts';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden animate-fade-in-down border border-slate-100">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <X size={28} />
        </button>
        
        <div className="p-12 md:p-16">
          {sent ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Recebemos sua mensagem!</h3>
              <p className="text-slate-500 font-medium text-lg">Nosso time técnico retornará em breve.</p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Fale com Especialistas</h3>
                <p className="text-slate-500 font-medium mt-2 text-lg">Dúvidas sobre a NR-17 ou Planos Corporate.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Nome Completo</label>
                  <input required type="text" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800" placeholder="Ex: João Silva" />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">E-mail Corporativo</label>
                  <input required type="email" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800" placeholder="voce@empresa.com.br" />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Sua Mensagem</label>
                  <textarea required rows={3} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800 resize-none" placeholder="Como podemos ajudar sua consultoria?" />
                </div>
                <Button fullWidth size="lg" disabled={loading} className="h-20 shadow-2xl shadow-blue-600/30 uppercase tracking-[0.2em] text-sm font-black">
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} className="mr-3" /> Enviar Mensagem</>}
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
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const renderPriceCard = (plan: PlanConfig) => {
    const isYearly = billingCycle === 'yearly';
    const displayPrice = isYearly && plan.priceYearly ? (plan.priceYearly / 12) : plan.priceMonthly;

    return (
      <div 
        key={plan.id} 
        className={`flex flex-col h-full rounded-[48px] transition-all duration-500 relative group ${
          plan.popular 
            ? 'bg-blue-600 text-white shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] scale-100 lg:scale-105 z-10 p-1.5' 
            : 'bg-slate-950 border border-slate-800 shadow-2xl'
        }`}
      >
        <div className={plan.popular ? 'bg-blue-600 rounded-[44px] h-full p-10 lg:p-12 flex flex-col' : 'p-10 lg:p-12 h-full flex flex-col'}>
          {plan.popular && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl">
              Melhor Custo-Benefício
            </div>
          )}

          <div className="flex justify-between items-start mb-8">
            <h3 className="text-2xl font-heading font-black tracking-tight uppercase opacity-90">
              {plan.name}
            </h3>
            {plan.id === 'enterprise' && <Gem size={24} className="text-amber-500" />}
          </div>

          <div className="mb-10 min-h-[100px] flex flex-col justify-center">
            {plan.isCustom ? (
              <div className="text-4xl font-heading font-black tracking-tighter">Sob Medida</div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-lg font-bold opacity-50`}>R$</span>
                  <span className="text-5xl lg:text-6xl font-heading font-black tracking-tighter">
                    {formatCurrency(displayPrice).replace('R$', '').trim()}
                  </span>
                  <span className="text-lg font-bold opacity-50">/mês</span>
                </div>
                {isYearly && plan.priceYearly && (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] mt-4 text-emerald-400">
                    Faturamento Anual
                  </span>
                )}
              </div>
            )}
          </div>

          <p className={`text-sm mb-10 leading-relaxed font-bold min-h-[50px] ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>
            {plan.description}
          </p>

          <Button 
            fullWidth 
            variant={plan.popular ? 'white' : 'glass'} 
            onClick={() => plan.isCustom || plan.id === 'enterprise' ? window.open(WHATSAPP_LINK, '_blank') : navigate('/register')}
            className={`h-18 text-xs font-black uppercase tracking-[0.2em] ${plan.popular ? 'text-blue-600' : ''}`}
          >
            {plan.isCustom || plan.id === 'enterprise' ? 'Falar com Comercial' : `Começar agora`}
          </Button>

          <div className={`mt-10 pt-10 border-t ${plan.popular ? 'border-white/10' : 'border-slate-900'}`}>
             <ul className="space-y-5">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <CheckCircle2 size={20} className={`${plan.popular ? 'text-white' : 'text-blue-500'} shrink-0 mt-0.5`} />
                  <span className={`text-[15px] leading-snug font-bold ${plan.popular ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Header Bold Desktop - Proporção de Alta Fidelidade */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-24' : 'bg-transparent h-32'}`}>
        <div className="container mx-auto px-10 h-full flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:scale-105 transition-transform duration-500">
            <Logo size={isScrolled ? "md" : "lg"} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-16 font-heading font-black text-[13px] uppercase tracking-[0.25em] text-slate-900">
            <button onClick={() => navigate('/teste-gratis')} className="hover:text-blue-600 transition-all hover:scale-110 relative group">
              Funcionalidades
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-600 transition-all group-hover:w-full rounded-full" />
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-all hover:scale-110 relative group">
              Planos
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-600 transition-all group-hover:w-full rounded-full" />
            </button>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-blue-600 transition-all hover:scale-110 relative group">
              Contato
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-600 transition-all group-hover:w-full rounded-full" />
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-12">
            <Link to="/login" className="text-slate-900 font-heading font-black text-[13px] uppercase tracking-[0.25em] hover:text-blue-600 transition-all hover:scale-110">Entrar</Link>
            <Button size="lg" onClick={() => navigate('/teste-gratis')} className="px-12 h-16 uppercase text-[12px] font-black tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.5)]">
              Teste Grátis
            </Button>
          </div>

          <button className="lg:hidden p-3 text-slate-900 bg-slate-50 rounded-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
        
        {/* Mobile Nav - Refined Bold */}
        {mobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full bg-white h-screen z-[100] p-12 animate-fade-in flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-20">
              <Logo size="md" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl"><X size={32} /></button>
            </div>
            <nav className="flex flex-col gap-12 text-3xl font-heading font-black uppercase tracking-widest text-slate-900">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/teste-gratis'); }} className="text-left flex justify-between items-center group">
                Funcionalidades <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('pricing'); }} className="text-left flex justify-between items-center group">
                Planos <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>
              <button onClick={() => { setMobileMenuOpen(false); setIsContactOpen(true); }} className="text-left flex justify-between items-center group">
                Contato <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>
              <div className="h-px bg-slate-100 my-4" />
              <Link to="/login" className="flex justify-between items-center group">
                Entrar <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </Link>
              <Button size="lg" onClick={() => { setMobileMenuOpen(false); navigate('/teste-gratis'); }} className="mt-8 h-24 text-xl font-black tracking-widest shadow-2xl">Começar Agora</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 lg:pt-64 pb-32 overflow-hidden bg-slate-50/40">
        <div className="container mx-auto px-10 flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
          <div className="lg:w-[55%] text-center lg:text-left space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.25em]">
              <TrendingUp size={16} />
              Inteligência de Riscos Ocupacionais
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[88px] font-heading font-black text-slate-900 leading-[1.02] tracking-[-0.05em]">
              Riscos <br/>
              Psicossociais <br/>
              <span className="text-blue-600 drop-shadow-sm">Automáticos.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              A plataforma definitiva para automatizar diagnósticos da <strong>NR-17 e NR-01</strong>. Transforme dados complexos em relatórios técnicos em segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
              <Button size="lg" onClick={() => navigate('/teste-gratis')} className="h-24 px-16 text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all font-black tracking-widest">
                Iniciar Demo
                <ArrowRight className="ml-4 w-8 h-8" strokeWidth={3} />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/teste-gratis')} className="h-24 px-16 text-2xl bg-white border-[3px] border-slate-200 font-black tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all">
                Recursos
              </Button>
            </div>
          </div>

          <div className="lg:w-[45%] w-full">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[54px] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
              <div className="relative bg-white rounded-[48px] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.18)] border-[12px] border-white overflow-hidden transition-all duration-700 hover:scale-[1.02]">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-400/40"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-400/40"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-400/40"></div>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">app.nrzen.com.br</div>
                </div>
                <div className="p-10 lg:p-14 space-y-12">
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-2xl font-heading font-black text-slate-900 tracking-tight">Dashboard Executivo</h4>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-1.5">SST Intelligence</p>
                      </div>
                      <BarChart3 className="text-blue-600" size={40} />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100/50 shadow-inner">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] block mb-3">Empresas</span>
                        <span className="text-5xl font-heading font-black text-blue-900 tracking-tighter">24</span>
                      </div>
                      <div className="bg-indigo-50 rounded-[32px] p-8 border border-indigo-100/50 shadow-inner">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] block mb-3">Monitorados</span>
                        <span className="text-5xl font-heading font-black text-indigo-900 tracking-tighter">892</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Dark Mode Bold */}
      <section id="pricing" className="py-32 lg:py-48 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-10 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-heading font-black tracking-tight leading-[0.95]">
              Escala para sua <br className="hidden md:block" /> consultoria crescer.
            </h2>
            <p className="text-slate-400 text-xl lg:text-2xl font-medium max-w-2xl mx-auto opacity-80">
              Escolha o plano baseado no seu volume mensal de avaliações. Altere a qualquer momento sem burocracia.
            </p>
            
            <div className="flex justify-center items-center gap-10 pt-10">
              <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                className="w-20 h-10 bg-slate-900 rounded-full relative p-1.5 transition-all border-2 border-slate-800 hover:border-blue-600 group"
              >
                <div className={`w-6 h-6 bg-blue-600 rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.6)] group-hover:scale-110 ${billingCycle === 'yearly' ? 'translate-x-10 bg-emerald-400' : 'translate-x-0'}`}></div>
              </button>
              <div className="flex flex-col items-start">
                <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'}`}>Anual</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-3 py-1 rounded-full border border-emerald-500/30 font-black mt-2 uppercase tracking-widest animate-pulse">
                  Economize 17%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-stretch max-w-[1600px] mx-auto">
            {PLANS.map(plan => renderPriceCard(plan))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-40 border-t border-slate-900 pt-24 max-w-6xl mx-auto">
             {[
               { icon: ShieldCheck, title: "Preço Vitalício", desc: "Sua mensalidade nunca sofrerá reajustes enquanto o plano estiver ativo." },
               { icon: Lock, title: "Sem Fidelidade", desc: "Cancele a qualquer momento direto pelo painel. Simples e transparente." },
               { icon: Users, title: "Suporte Técnico", desc: "Consultoria direta com Engenheiros de Segurança do Trabalho e Psicólogos." }
             ].map((item, i) => (
               <div key={i} className="text-center space-y-6 px-6 group hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-slate-900 text-blue-500 rounded-3xl flex items-center justify-center mx-auto border-2 border-slate-800 group-hover:border-blue-600 transition-colors shadow-2xl">
                    <item.icon size={32} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-base font-heading font-black uppercase tracking-[0.25em] text-blue-500">{item.title}</h4>
                  <p className="text-[15px] text-slate-500 leading-relaxed font-bold">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <Logo size="md" />
          <div className="flex gap-12 font-heading font-black text-[11px] uppercase tracking-[0.25em] text-slate-400">
             <button onClick={() => setIsContactOpen(true)} className="hover:text-blue-600 transition-all hover:scale-110">Suporte</button>
             <a href="#" className="hover:text-blue-600 transition-all hover:scale-110">Privacidade</a>
             <a href="#" className="hover:text-blue-600 transition-all hover:scale-110">Termos</a>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-2">
              © NR ZEN • TECNOLOGIA PARA SST
            </p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              CNPJ 55.119.808/3464-1
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
