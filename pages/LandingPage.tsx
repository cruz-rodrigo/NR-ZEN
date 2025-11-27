import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, Menu, X, Star, Gem } from 'lucide-react';
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
          <div className="md:hidden bg-white border-t border-slate-100 p-6 absolute w-full shadow-2xl animate-fade-in-down">
            <nav className="flex flex-col gap-6 text-xl">
              <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left font-medium text-slate-600">Planos</button>
              <Link to="/demo" className="font-medium text-blue-600">Teste Grátis</Link>
              <hr className="border-slate-100"/>
              <Link to="/app" className="font-medium text-slate-800">Login</Link>
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

      {/* Pricing */}
      <section className="py-24 bg-slate-950 text-white scroll-mt-20 relative overflow-hidden" id="pricing">
        {/* Background Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-900/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-900/40 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-800 pb-8">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4 tracking-tight">
                Planos escaláveis
              </h2>
              <p className="text-slate-400 text-lg font-light">Escolha a potência ideal para impulsionar sua consultoria.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Starter */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-black/20 flex flex-col group h-min">
              <h3 className="text-xl font-bold mb-2 text-white tracking-tight group-hover:text-blue-400 transition-colors">Consultor</h3>
              <div className="text-4xl font-bold mb-4 text-white">R$ 199<span className="text-base font-normal text-slate-500">/mês</span></div>
              <p className="text-sm text-slate-400 mb-8 h-10 leading-relaxed">Para profissionais independentes iniciando a digitalização.</p>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Até 5 Empresas</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Relatório PDF Padrão</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Suporte por E-mail</li>
              </ul>
              <Button fullWidth variant="white" onClick={() => scrollToSection('contact')} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600">Começar</Button>
            </div>

            {/* Pro - ANIMATED */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-1 relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/50 flex flex-col hover:scale-105 transition-transform duration-300 z-20">
              <div className="bg-blue-600 rounded-[22px] p-8 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/20 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold tracking-widest uppercase backdrop-blur-md animate-pulse">Mais Escolhido</div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
                
                <h3 className="text-xl font-bold mb-2 text-white tracking-tight">Business</h3>
                <div className="text-5xl font-bold mb-4 text-white tracking-tight">R$ 499<span className="text-base font-normal text-blue-200">/mês</span></div>
                <p className="text-sm text-blue-100 mb-8 h-10 leading-relaxed font-medium">Para consultorias estabelecidas que buscam eficiência máxima.</p>
                <ul className="space-y-4 mb-8 text-sm text-white flex-1 relative z-10">
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Até 30 Empresas</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Relatório White-Label (Seu Logo)</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Gestão de Acessos de Equipe</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Suporte Prioritário</li>
                </ul>
                <Button 
                  fullWidth 
                  variant="white"
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-bold shadow-lg py-4 border-none" 
                  onClick={() => scrollToSection('contact')}
                >
                  Assinar Agora
                </Button>
              </div>
            </div>

            {/* Enterprise - CUSTOM COLOR (Deep Navy + Gold Accent) */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700/50 hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-900/10 flex flex-col group h-min relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-700 via-amber-500/50 to-slate-700"></div>
              
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">Enterprise</h3>
                 <Gem size={20} className="text-amber-500" />
              </div>
              
              <div className="text-4xl font-bold mb-4 text-white">Custom</div>
              <p className="text-sm text-slate-400 mb-8 h-10 leading-relaxed">Para grandes empresas, assessorias, franquias e SESMT corporativo.</p>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 flex-shrink-0"/> Volume Personalizado (+50 CNPJs)</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 flex-shrink-0"/> Migração de Dados Assistida</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 flex-shrink-0"/> SLA Garantido (99.9%)</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 flex-shrink-0"/> Treinamento Dedicado</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 flex-shrink-0"/> Contrato Personalizado</li>
              </ul>
              <Button fullWidth variant="white" onClick={() => scrollToSection('contact')} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-amber-500/50 hover:text-amber-400">Falar com Vendas</Button>
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
             <Link to="/" className="flex items-center gap-3 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
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