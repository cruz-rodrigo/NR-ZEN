import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, Menu, X, Star, Gem, ShieldCheck, Zap, HeartHandshake, Unlock, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { Logo } from '../components/Layout';
import { APP_URL } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState('Consultoria de SST');
  const [otherProfile, setOtherProfile] = useState('');
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao iniciar checkout. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setPhone('');
    setOtherProfile('');
    setTimeout(() => setFormSubmitted(false), 8000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1');
    }
    setPhone(value);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size="lg" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 text-lg font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <Link to="/demo" className="hover:text-blue-600 transition-colors flex items-center gap-2 font-semibold">
              Teste Grátis
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/app" className="text-slate-600 font-medium hover:text-blue-600 px-2 text-lg transition-colors">Login</Link>
            <Button size="lg" onClick={() => scrollToSection('contact')}>Falar com Consultor</Button>
          </div>

          <button className="md:hidden text-slate-800 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 absolute w-full shadow-2xl animate-fade-in-down z-50">
            <nav className="flex flex-col gap-6 text-xl">
              <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left font-medium text-slate-600">Planos</button>
              <Link to="/demo" onClick={() => setMobileMenuOpen(false)} className="font-medium text-blue-600">Teste Grátis</Link>
              <hr className="border-slate-100"/>
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="font-medium text-slate-800">Login</Link>
              <Button fullWidth size="lg" onClick={() => scrollToSection('contact')}>Falar com Consultor</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        
        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Star size={12} className="fill-blue-600" />
              Plataforma de Gestão de Riscos
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold leading-[1.1] tracking-tighter text-slate-900">
              FATORES DE RISCOS PSICOSSOCIAIS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">de forma automática.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Gere relatórios completos em conformidade com a <strong className="text-slate-800 font-semibold">nova NR-01</strong>, <strong className="text-slate-800 font-semibold">NR-17</strong> e <strong className="text-slate-800 font-semibold">Guia MTE</strong>. Mantenha sua empresa em conformidade e evite multas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/demo')} className="shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 px-8 py-4 text-lg">
                Iniciar Demonstração
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('features')} className="bg-white/80 backdrop-blur-sm hover:bg-white px-8 py-4 text-lg">
                Conhecer Recursos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-950 text-white scroll-mt-20 relative overflow-hidden" id="pricing">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4 tracking-tight">
              Planos por volume de avaliações
            </h2>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold tracking-wide transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700 hover:border-blue-500"
              >
                <div className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Anual
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch mb-12">
            
            {/* 1. Consultor */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2 text-white">Consultor</h3>
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">R$ {billingCycle === 'yearly' ? '165' : '199'}</span>
                  <span className="text-sm font-normal text-slate-500">/mês</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Ideal para quem está começando.</p>
              
              <Button fullWidth variant="dark" onClick={() => handleCheckout('consultant')} className="mb-6">
                 {checkoutLoading === 'consultant' ? <Loader2 className="animate-spin" /> : 'Começar agora'}
              </Button>
            </div>

            {/* 2. Business - FEATURED */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-1 relative transform shadow-2xl flex flex-col hover:scale-105 transition-transform duration-300 z-20">
              <div className="bg-blue-600 rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/20 text-white text-[9px] px-2 py-1 rounded-bl-lg font-bold">MAIS POPULAR</div>
                <h3 className="text-lg font-bold mb-2 text-white">Business</h3>
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">R$ {billingCycle === 'yearly' ? '499' : '597'}</span>
                    <span className="text-sm font-normal text-blue-200">/mês</span>
                  </div>
                </div>
                <p className="text-sm text-white mb-6 italic min-h-[60px]">Para consultorias em crescimento.</p>
                
                <Button fullWidth variant="white" className="text-blue-700 font-bold mb-6" onClick={() => handleCheckout('business')}>
                   {checkoutLoading === 'business' ? <Loader2 className="animate-spin" /> : 'Assinar Business'}
                </Button>
              </div>
            </div>

            {/* 3. Corporate */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2 text-white">Corporate</h3>
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">R$ {billingCycle === 'yearly' ? '749' : '899'}</span>
                  <span className="text-sm font-normal text-slate-500">/mês</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Para alto volume.</p>
              <Button fullWidth variant="dark" onClick={() => handleCheckout('corporate')} className="mb-6">
                {checkoutLoading === 'corporate' ? <Loader2 className="animate-spin" /> : 'Contratar Corporate'}
              </Button>
            </div>

            {/* 4. Enterprise */}
            <div className="bg-[#0B1120] rounded-3xl p-6 border border-[#1E293B] flex flex-col group h-full">
              <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-2">
                 <div className="text-3xl font-bold text-white">Custom</div>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Para grandes empresas e SESMT.</p>
              <Button fullWidth variant="dark" onClick={() => scrollToSection('contact')} className="hover:text-amber-400 mb-6">Falar com Vendas</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 text-center">
             <div className="text-xs text-slate-400">
               © 2025 NR ZEN. Tecnologia para SST.
             </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;