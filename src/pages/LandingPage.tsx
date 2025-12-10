import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, Menu, X, Star, Gem, ShieldCheck, Zap, HeartHandshake, Unlock } from 'lucide-react';
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
  
  // Pricing State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Reset form simulation
    setPhone('');
    setOtherProfile('');
    // Auto-hide success message after 8 seconds
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
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300 shadow-sm">
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
            <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600 px-2 text-lg transition-colors">Login</Link>
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
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-medium text-slate-800">Login</Link>
              <Button fullWidth size="lg" onClick={() => scrollToSection('contact')}>Falar com Consultor</Button>
            </nav>
          </div>
        )}
      </header>
      
      {/* Rest of Landing Page Content remains unchanged... */}
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
            
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 font-medium grayscale opacity-60">
              <span>NR-01</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>NR-17</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>ISO 45003</span>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full perspective-1000 relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            
            <div className="relative transform lg:rotate-y-6 lg:rotate-x-2 transition-all duration-700 hover:rotate-0 hover:scale-[1.02] hover:shadow-2xl">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 p-3 border border-white ring-1 ring-slate-100">
                <div className="bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                  <div className="h-10 border-b border-slate-200 flex items-center px-4 gap-2 bg-white/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    <div className="flex-1 text-center text-[10px] text-slate-400 font-mono opacity-50">{APP_URL}</div>
                  </div>
                  
                  <div className="p-8 bg-white min-h-[400px]">
                     <div className="flex justify-between items-center mb-10">
                       <div>
                         <h3 className="text-xl font-bold text-slate-900">Dashboard Executivo</h3>
                         <p className="text-sm text-slate-400">Visão Geral da Carteira</p>
                       </div>
                       <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                         <BarChart3 size={24} />
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-5 mb-10">
                       <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
                         <div className="text-4xl font-bold text-blue-600">18</div>
                         <div className="text-xs text-blue-500 font-bold uppercase mt-2">Empresas Ativas</div>
                       </div>
                       <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                         <div className="text-4xl font-bold text-slate-700">487</div>
                         <div className="text-xs text-slate-400 font-bold uppercase mt-2">Vidas Impactadas</div>
                       </div>
                     </div>

                     <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-default border border-transparent hover:border-slate-100 group">
                         <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">A</div>
                         <div className="flex-1">
                           <div className="font-bold text-slate-800 text-base">Metalúrgica Alpha</div>
                           <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                             <div className="bg-red-500 h-2 rounded-full w-[85%]"></div>
                           </div>
                         </div>
                         <div className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded">ALTO</div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-default border border-transparent hover:border-slate-100 group">
                         <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">T</div>
                         <div className="flex-1">
                           <div className="font-bold text-slate-800 text-base">Tech Solutions</div>
                           <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                             <div className="bg-emerald-500 h-2 rounded-full w-[35%]"></div>
                           </div>
                         </div>
                         <div className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">BAIXO</div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/50 scroll-mt-20 border-t border-slate-100" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Por que NR ZEN?</span>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mt-6 tracking-tighter">
              Da triagem ao plano de ação,<br/>sem complicações.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Coleta Anônima & Segura", text: "Links seguros por setor/GHE. Protege a identidade do trabalhador e garante alta adesão conforme LGPD." },
              { icon: BarChart3, title: "Diagnóstico Visual", text: "Esqueça planilhas complexas. Nosso algoritmo gera scores claros e mapas de calor automáticos." },
              { icon: FileCheck, title: "Relatórios Técnicos", text: "Geração de PDFs prontos para anexar ao PGR/GRO, com embasamento nas NRs e ISO 45003." },
              { icon: Lock, title: "Compliance Total", text: "Metodologia validada juridicamente. Evite diagnósticos clínicos indevidos em avaliações organizacionais." },
              { icon: CheckCircle2, title: "Planos de Ação", text: "Workflow integrado para definir responsáveis, prazos e acompanhar a mitigação dos riscos." },
              { icon: Star, title: "White Label", text: "Personalize os relatórios com a sua marca e entregue valor premium aos seus clientes." },
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white border border-slate-200/50 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - UPDATED: 4 Tiers, Trust Bar, Toggle */}
      <section className="py-24 bg-slate-950 text-white scroll-mt-20 relative overflow-hidden" id="pricing">
        {/* Background Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-900/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-900/40 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4 tracking-tight">
              Planos por volume de avaliações
            </h2>
            <p className="text-slate-400 text-lg font-light mb-8">
              Pague apenas pelo número de avaliações mensais e cresça no seu ritmo.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold tracking-wide transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
              
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700 hover:border-blue-500"
              >
                <div className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              
              <span className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Anual
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  2 Meses Grátis
                </span>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch mb-12">
            
            {/* 1. Consultor */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2 text-white tracking-tight">Consultor</h3>
              
              <div className="mb-2">
                {billingCycle === 'yearly' && (
                  <span className="text-sm text-slate-500 line-through decoration-red-500/50 block">R$ 199/mês</span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">R$ {billingCycle === 'yearly' ? '165' : '199'}</span>
                  <span className="text-sm font-normal text-slate-500">/mês</span>
                </div>
                {billingCycle === 'yearly' && <p className="text-[10px] text-emerald-400 font-medium">Cobrado R$ 1.990/ano</p>}
              </div>

              <div className="mb-6 min-h-[48px] flex items-start">
                 <p className="text-xs text-slate-400 leading-relaxed">Até 300 avaliações por mês.</p>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Ideal para quem está começando a digitalizar a gestão da NR-01 e quer testar o NR Zen na prática.</p>
              
              <Button fullWidth variant="dark" onClick={() => scrollToSection('contact')} className="mb-6">Começar agora</Button>
              
              <div className="border-t border-slate-800 pt-6 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">O que está incluso</p>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> CNPJs Ilimitados</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Relatório PDF Padrão</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Histórico unificado</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Suporte por E-mail</li>
                </ul>
              </div>
            </div>

            {/* 2. Business - FEATURED */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-1 relative transform shadow-2xl shadow-blue-900/50 flex flex-col hover:scale-105 transition-transform duration-300 z-20">
              <div className="bg-blue-600 rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/20 text-white text-[9px] px-2 py-1 rounded-bl-lg font-bold tracking-widest uppercase backdrop-blur-md animate-pulse">Mais Escolhido</div>
                
                <h3 className="text-lg font-bold mb-2 text-white tracking-tight">Business</h3>
                
                <div className="mb-2">
                  {billingCycle === 'yearly' && (
                    <span className="text-sm text-blue-300 line-through decoration-white/30 block">R$ 597/mês</span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tracking-tight">R$ {billingCycle === 'yearly' ? '499' : '597'}</span>
                    <span className="text-sm font-normal text-blue-200">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && <p className="text-[10px] text-white font-medium bg-white/20 inline-block px-2 rounded-full mt-1">Economia de R$ 1.176/ano</p>}
                </div>

                <div className="mb-6 min-h-[48px]">
                   <p className="text-xs text-blue-100 font-medium">Até 1.500 avaliações por mês.</p>
                   <p className="text-[10px] text-blue-200 mt-1 opacity-90">Menos de R$ 0,40 por avaliação no limite da franquia.</p>
                </div>
                <p className="text-sm text-white mb-6 italic min-h-[60px]">Para consultorias que já têm carteira ativa e precisam de mais previsibilidade e eficiência na gestão da NR-01.</p>
                
                <Button 
                  fullWidth 
                  variant="white"
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-bold shadow-lg py-3 border-none mb-6" 
                  onClick={() => scrollToSection('contact')}
                >
                  Assinar Business
                </Button>

                <div className="border-t border-white/20 pt-6 flex-1 relative z-10">
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">O que está incluso</p>
                  <ul className="space-y-3 text-sm text-white">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white flex-shrink-0"/> Tudo do Consultor</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white flex-shrink-0"/> Relatório White-Label</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white flex-shrink-0"/> Painel eSocial/NR-01</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white flex-shrink-0"/> Gestão de Acessos</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white flex-shrink-0"/> Suporte Prioritário</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Corporate */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2 text-white tracking-tight">Corporate</h3>
              
              <div className="mb-2">
                {billingCycle === 'yearly' && (
                  <span className="text-sm text-slate-500 line-through decoration-red-500/50 block">R$ 899/mês</span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">R$ {billingCycle === 'yearly' ? '749' : '899'}</span>
                  <span className="text-sm font-normal text-slate-500">/mês</span>
                </div>
                {billingCycle === 'yearly' && <p className="text-[10px] text-emerald-400 font-medium">Economia de R$ 1.800/ano</p>}
              </div>

              <div className="mb-6 min-h-[48px]">
                  <p className="text-xs text-slate-400">Até 5.000 avaliações por mês.</p>
                  <p className="text-[10px] text-slate-500 mt-1">A partir de ~R$ 0,18 por avaliação no limite da franquia.</p>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Para consultorias que atendem grandes contratos e precisam de apoio próximo na implantação do NR Zen.</p>
              
              <Button fullWidth variant="dark" onClick={() => scrollToSection('contact')} className="mb-6">Contratar Corporate</Button>

              <div className="border-t border-slate-800 pt-6 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">O que está incluso</p>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Tudo do Business</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Onboarding Assistido</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Treinamento Inicial</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 flex-shrink-0"/> Canal de Sugestões</li>
                </ul>
              </div>
            </div>

            {/* 4. Enterprise - CUSTOM COLOR (Deep Navy + Gold Accent) */}
            <div className="bg-[#0B1120] rounded-3xl p-6 border border-[#1E293B] hover:border-amber-500/40 transition-all hover:shadow-2xl hover:shadow-amber-900/10 flex flex-col group h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B1120] via-amber-500/60 to-[#0B1120]"></div>
              
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">Enterprise</h3>
                 <Gem size={18} className="text-amber-500" />
              </div>
              
              <div className="mb-2">
                 <div className="text-3xl font-bold text-white">Custom</div>
                 <p className="text-[10px] text-amber-500/80 font-medium mt-1">Faturamento Personalizado</p>
              </div>

              <div className="mb-6 min-h-[48px] flex items-start">
                  <p className="text-xs text-slate-400 leading-relaxed">Volume &gt; 5.000 avaliações.</p>
              </div>
              <p className="text-sm text-slate-300 mb-6 italic min-h-[60px]">Para grandes empresas, assessorias, franquias e SESMT corporativo que precisam de alto volume e contrato flexível.</p>
              
              <Button fullWidth variant="dark" onClick={() => scrollToSection('contact')} className="hover:border-amber-500/50 hover:text-amber-400 mb-6">Falar com Vendas</Button>

              <div className="border-t border-slate-800 pt-6 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">O que está incluso</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Volume e condições sob medida</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Integrações (API/ERP)</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Migração Assistida</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> SLA Garantido (99.9%)</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Contrato Personalizado</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Trust Bar / Footer Pricing - FONT SIZE INCREASED */}
          <div className="border-t border-slate-800/50 pt-10 mt-12 bg-slate-900/30 rounded-2xl p-8 backdrop-blur-sm">
             <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
               <div className="px-4 space-y-3">
                 <div className="w-14 h-14 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-900/20">
                   <ShieldCheck size={28} />
                 </div>
                 <h4 className="text-white font-bold text-lg">Garantia de Preço</h4>
                 <p className="text-slate-400 text-base leading-relaxed">Clientes pioneiros garantem este preço vitalício, mesmo com futuros aumentos de tabela.</p>
               </div>
               
               <div className="px-4 space-y-3 pt-6 md:pt-0">
                  <div className="w-14 h-14 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-900/20">
                    <Unlock size={28} />
                  </div>
                  <h4 className="text-white font-bold text-lg">Liberdade Total</h4>
                  <p className="text-slate-400 text-base leading-relaxed">Sem contratos de fidelidade ou multas. Cancele sua assinatura a qualquer momento.</p>
               </div>
               
               <div className="px-4 space-y-3 pt-6 md:pt-0">
                  <div className="w-14 h-14 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-900/20">
                    <HeartHandshake size={28} />
                  </div>
                  <h4 className="text-white font-bold text-lg">Setup Assistido</h4>
                  <p className="text-slate-400 text-base leading-relaxed">No primeiro mês, nosso time te ajuda a configurar a conta e importar seus primeiros clientes.</p>
               </div>
             </div>
          </div>

        </div>
      </section>

      {/* Form */}
      <section className="py-24 bg-white scroll-mt-20" id="contact">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4 text-slate-900 tracking-tight">Agende uma conversa</h2>
            <p className="text-slate-500 text-lg font-light">Entenda como o NR ZEN pode transformar a entrega da sua consultoria.</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100">
            {formSubmitted ? (
               <div className="text-center py-12 animate-fade-in-down">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
                   <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicitação Recebida</h3>
                 <p className="text-slate-500">Nosso time comercial entrará em contato em até 24h.</p>
                 <Button variant="ghost" className="mt-8" onClick={() => setFormSubmitted(false)}>Enviar nova mensagem</Button>
               </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome completo</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="João Silva" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                    <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="joao@empresa.com.br" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Celular</label>
                    <input 
                      required 
                      type="tel" 
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Qual seu perfil?</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-slate-700"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  >
                    <option value="Consultoria de SST">Consultoria de SST</option>
                    <option value="Engenheiro/Técnico Autônomo">Engenheiro/Técnico Autônomo</option>
                    <option value="SESMT Corporativo (RH/Empresa)">SESMT Corporativo (RH/Empresa)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                
                {profile === 'Outro' && (
                  <div className="animate-fade-in-down">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Qual?</label>
                    <input 
                      required 
                      type="text" 
                      value={otherProfile}
                      onChange={(e) => setOtherProfile(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
                      placeholder="Especifique seu perfil" 
                    />
                  </div>
                )}
                
                <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-blue-600/20 mt-2 py-4 text-lg">Solicitar Contato</Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-3 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
               <Logo />
             </Link>
             <div className="flex gap-8 text-sm font-medium text-slate-500">
               <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
               <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
               <a href="#" className="hover:text-blue-600 transition-colors">Ajuda</a>
             </div>
             <div className="text-xs text-slate-400">
               © 2025 NR ZEN. Tecnologia para SST.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;