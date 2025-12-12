import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, 
  Menu, X, Star, ShieldCheck, Zap, HeartHandshake, Unlock, 
  ChevronDown, ChevronUp, Play, Gem
} from 'lucide-react';
import Button from '../components/Button';
import { Logo } from '../components/Layout';
import { APP_URL } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:opacity-80 transition-opacity">
            <Logo size="lg" />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 transition-colors">Como Funciona</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-blue-600 transition-colors">Dúvidas</button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 text-sm transition-colors px-3 py-2">
              Entrar
            </Link>
            <Button size="md" onClick={() => navigate('/demo')} className="shadow-lg shadow-blue-600/20">
              Teste Grátis
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fade-in-down">
            <div className="flex flex-col p-6 gap-4">
              <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600 py-2 border-b border-slate-50">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left font-medium text-slate-600 py-2 border-b border-slate-50">Planos</button>
              <Link to="/login" className="font-bold text-slate-800 py-2">Fazer Login</Link>
              <Button fullWidth onClick={() => { navigate('/demo'); setMobileMenuOpen(false); }}>
                Começar Teste Grátis
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Text */}
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
              <Button size="lg" onClick={() => navigate('/demo')} className="h-14 px-8 text-base shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
                Iniciar Demonstração
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('how-it-works')} className="h-14 px-8 text-base bg-white/80 backdrop-blur">
                <Play size={18} className="mr-2 fill-slate-700" />
                Ver como funciona
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Adequado à LGPD</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Metodologia Validada</span>
            </div>
          </div>

          {/* Hero Visual (Interactive Mockup) */}
          <div className="lg:w-1/2 w-full perspective-1000">
            <div className="relative transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] transition-all duration-500 hover:rotate-0 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20 transform translate-y-10"></div>
              
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden relative z-10">
                {/* Mockup Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                  </div>
                  <div className="ml-4 bg-white border border-slate-200 px-3 py-1 rounded text-[10px] font-mono text-slate-400 flex-1 text-center">
                    app.nrzen.com.br/dashboard
                  </div>
                </div>

                {/* Mockup Body */}
                <div className="p-6 md:p-8 bg-slate-50/50">
                   <div className="flex justify-between items-center mb-8">
                     <div>
                       <h3 className="text-xl font-bold text-slate-800">Visão Geral</h3>
                       <p className="text-sm text-slate-500">Sua carteira de clientes em tempo real.</p>
                     </div>
                     <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                       <BarChart3 className="text-blue-600" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 font-bold uppercase">Empresas Ativas</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">24</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 font-bold uppercase">Vidas Impactadas</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">1.250</p>
                      </div>
                   </div>

                   <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between text-xs font-bold text-slate-500">
                        <span>CLIENTE</span>
                        <span>STATUS</span>
                      </div>
                      {[
                        { name: "Metalúrgica Alpha", status: "high", label: "Risco Alto" },
                        { name: "Transportes Rapido", status: "low", label: "Risco Baixo" },
                        { name: "Tech Softwares", status: "moderate", label: "Moderado" },
                      ].map((c, i) => (
                        <div key={i} className="px-4 py-3 flex justify-between items-center border-b border-slate-50 last:border-0">
                          <span className="text-sm font-medium text-slate-700">{c.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'high' ? 'bg-red-50 text-red-600' :
                            c.status === 'low' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {c.label}
                          </span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Recursos Poderosos</span>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mt-3 mb-6">
              Tudo o que você precisa para gerenciar o risco psicossocial.
            </h2>
            <p className="text-slate-500 text-lg">
              Substitua planilhas manuais e formulários desconexos por uma plataforma inteligente que automatiza o processo de ponta a ponta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Users, 
                title: "Coleta Anônima & Segura", 
                desc: "Links criptografados por setor. Protege a identidade do trabalhador e garante alta adesão (compliance LGPD)." 
              },
              { 
                icon: BarChart3, 
                title: "Diagnóstico Automático", 
                desc: "Algoritmo que processa as respostas em tempo real e gera mapas de calor de risco por setor e GHE." 
              },
              { 
                icon: FileCheck, 
                title: "Relatórios Técnicos (PGR)", 
                desc: "Geração de PDFs prontos para anexar ao PGR/GRO, com embasamento nas NRs e ISO 45003." 
              },
              { 
                icon: ShieldCheck, 
                title: "Matriz de Risco Personalizável", 
                desc: "Configure critérios de probabilidade e severidade alinhados à matriz de risco da sua consultoria." 
              },
              { 
                icon: CheckCircle2, 
                title: "Planos de Ação Integrados", 
                desc: "Workflow para definir responsáveis, prazos e acompanhar a mitigação dos riscos identificados." 
              },
              { 
                icon: Zap, 
                title: "White-Label Premium", 
                desc: "Personalize a plataforma e os relatórios com a sua marca e cores. Valorize sua entrega." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
           <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Planos flexíveis para sua consultoria</h2>
            <p className="text-slate-400 text-lg mb-8">
              Comece pequeno e cresça conforme sua carteira de clientes aumenta. Sem fidelidade.
            </p>

            {/* HIGH VISIBILITY TOGGLE SWITCH */}
            <div className="flex items-center justify-center gap-6 mt-8 mb-4">
              <span className={`text-base font-bold tracking-wide transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                Mensal
              </span>
              
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-20 h-10 bg-slate-800 rounded-full p-1 relative transition-all duration-300 border-2 border-slate-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                role="switch"
                aria-checked={billingCycle === 'yearly'}
              >
                {/* Track Background */}
                <div className={`absolute inset-1 rounded-full transition-colors duration-300 ${billingCycle === 'yearly' ? 'bg-blue-900/50' : 'bg-transparent'}`}></div>
                
                {/* Knob */}
                <div className={`w-7 h-7 bg-blue-500 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${billingCycle === 'yearly' ? 'translate-x-10 bg-emerald-400' : 'translate-x-0'}`}>
                   {billingCycle === 'yearly' && <span className="block w-2 h-2 bg-white rounded-full"></span>}
                </div>
              </button>
              
              <span className={`text-base font-bold tracking-wide transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Anual
                <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-lg shadow-emerald-500/20 animate-pulse">
                  -17% OFF
                </span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* PLANO CONSULTOR */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-slate-600 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Consultor</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">R$ {billingCycle === 'monthly' ? '199' : '165'}</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 min-h-[40px]">Para profissionais autônomos iniciando a digitalização.</p>
              <Button fullWidth variant="secondary" onClick={() => navigate('/register')} className="mb-6">Começar Agora</Button>
              
              <ul className="space-y-3 text-sm text-slate-300 flex-1">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Até 300 avaliações/mês</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> 1 Usuário Admin</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Relatórios Padrão</li>
              </ul>
            </div>

            {/* PLANO BUSINESS (DESTACADO) */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl p-1 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Mais Popular
              </div>
              <div className="bg-blue-600 rounded-xl p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">Business</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">R$ {billingCycle === 'monthly' ? '597' : '499'}</span>
                  <span className="text-blue-200 text-sm">/mês</span>
                </div>
                <p className="text-sm text-blue-100 mb-6 min-h-[40px]">Para consultorias em crescimento com equipe.</p>
                <Button fullWidth variant="white" onClick={() => navigate('/register')} className="mb-6 shadow-xl font-bold text-blue-700">
                  Assinar Business
                </Button>
                
                <ul className="space-y-3 text-sm text-white flex-1">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-300 shrink-0"/> Até 1.500 avaliações/mês</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-300 shrink-0"/> 3 Usuários Admin</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-300 shrink-0"/> Relatórios White-Label</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-300 shrink-0"/> Suporte Prioritário</li>
                </ul>
              </div>
            </div>

            {/* PLANO CORPORATE */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-slate-600 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Corporate</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">R$ {billingCycle === 'monthly' ? '899' : '749'}</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 min-h-[40px]">Para grandes consultorias com alto volume.</p>
              <Button fullWidth variant="secondary" onClick={() => navigate('/register')} className="mb-6">Assinar Corporate</Button>
              
              <ul className="space-y-3 text-sm text-slate-300 flex-1">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Até 5.000 avaliações/mês</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> 10 Usuários Admin</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> Onboarding Assistido</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> API de Integração</li>
              </ul>
            </div>

            {/* PLANO ENTERPRISE - RESTORED PREMIUM LOOK */}
            <div className="bg-[#0B1120] rounded-3xl p-6 border border-[#1E293B] hover:border-amber-500/40 transition-all hover:shadow-2xl hover:shadow-amber-900/10 flex flex-col group h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B1120] via-amber-500/60 to-[#0B1120]"></div>
              
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">Enterprise</h3>
                 <Gem size={20} className="text-amber-500" />
              </div>
              
              <div className="mb-4">
                 <div className="text-3xl font-bold text-white">Custom</div>
                 <p className="text-[10px] text-amber-500/80 font-medium mt-1 tracking-widest uppercase">Solução Sob Medida</p>
              </div>

              <p className="text-sm text-slate-300 mb-6 italic min-h-[40px]">Para grandes empresas, assessorias, franquias e SESMT Corporativo.</p>
              
              {/* BUTTON FIX: Use variant="dark" with amber accent */}
              <Button fullWidth variant="dark" onClick={() => scrollToSection('contact')} className="hover:border-amber-500/50 hover:text-amber-400 mb-6 transition-all group-hover:bg-slate-800">
                Falar com Vendas
              </Button>

              <div className="border-t border-slate-800 pt-6 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 group-hover:text-amber-500/50 transition-colors">Exclusivo Enterprise</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Volume Ilimitado</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Instância Dedicada</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Integração SSO & SAML</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> Contrato Personalizado</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-500 flex-shrink-0"/> SLA Garantido</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Trust Bar */}
          <div className="mt-16 pt-10 border-t border-slate-800 grid md:grid-cols-3 gap-8 text-center">
             <div className="px-4">
               <ShieldCheck className="w-10 h-10 text-blue-500 mx-auto mb-3" />
               <h4 className="font-bold text-white mb-1">Garantia de Preço</h4>
               <p className="text-xs text-slate-400">Preço fixo vitalício para early adopters.</p>
             </div>
             <div className="px-4">
               <Unlock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
               <h4 className="font-bold text-white mb-1">Sem Fidelidade</h4>
               <p className="text-xs text-slate-400">Cancele quando quiser, sem multas.</p>
             </div>
             <div className="px-4">
               <HeartHandshake className="w-10 h-10 text-blue-500 mx-auto mb-3" />
               <h4 className="font-bold text-white mb-1">Suporte Especializado</h4>
               <p className="text-xs text-slate-400">Time composto por Engenheiros de Segurança.</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900">Perguntas Frequentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "A metodologia é validada pelo Ministério do Trabalho?", a: "Sim. Utilizamos escalas baseadas no modelo demanda-controle e esforço-recompensa, citadas no manual da NR-17 e diretrizes da NR-01." },
              { q: "Posso colocar a minha logomarca nos relatórios?", a: "Sim! A partir do plano Business, todos os relatórios PDF são gerados com o seu logotipo e identidade visual (White-Label)." },
              { q: "Como funciona a coleta anônima?", a: "O sistema gera um link único para cada setor da empresa cliente. O trabalhador acessa sem login/senha, garantindo sigilo total das respostas individuais." },
              { q: "Existe limite de empresas cadastradas?", a: "Não. Você pode cadastrar quantos CNPJs quiser. O limite do plano é apenas sobre o volume total de avaliações (respondentes) no mês." }
            ].map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 text-left bg-white flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800">{item.q}</span>
                  {activeFaq === i ? <ChevronUp className="text-blue-600"/> : <ChevronDown className="text-slate-400"/>}
                </button>
                {activeFaq === i && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-xs">
              <Logo size="md" className="mb-4" />
              <p className="text-slate-500 text-sm">
                Tecnologia especializada em gestão de riscos ocupacionais para consultorias de alta performance.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Produto</h4>
                <ul className="space-y-2 text-slate-500">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-600">Funcionalidades</button></li>
                  <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600">Planos e Preços</button></li>
                  <li><Link to="/demo" className="hover:text-blue-600">Demonstração</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Legal</h4>
                <ul className="space-y-2 text-slate-500">
                  <li><a href="#" className="hover:text-blue-600">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-blue-600">Privacidade</a></li>
                  <li><a href="#" className="hover:text-blue-600">LGPD</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Contato</h4>
                <ul className="space-y-2 text-slate-500">
                  <li>suporte@nrzen.com.br</li>
                  <li>São Paulo, SP</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>&copy; 2025 NR ZEN Tecnologia Ltda. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <span>Feito com segurança para SST.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;