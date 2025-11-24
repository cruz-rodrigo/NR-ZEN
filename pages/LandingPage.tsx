import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, BarChart3, Lock, Users, FileCheck, Menu, X, ChevronDown, Star } from 'lucide-react';
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Planos</button>
            <Link to="/demo" className="hover:text-blue-600 transition-colors flex items-center gap-2">
              Teste Grátis
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/app" className="text-slate-600 font-medium hover:text-blue-600 px-4">Login</Link>
            <Button size="md" onClick={() => scrollToSection('contact')}>Falar com Consultor</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-800 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 absolute w-full shadow-2xl animate-fade-in-down">
            <nav className="flex flex-col gap-6 text-lg">
              <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left font-medium text-slate-600">Planos</button>
              <Link to="/demo" className="font-medium text-blue-600">Teste Grátis</Link>
              <hr className="border-slate-100"/>
              <Link to="/app" className="font-medium text-slate-800">Login</Link>
              <Button fullWidth onClick={() => scrollToSection('contact')}>Falar com Consultor</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        
        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Star size={12} className="fill-blue-600" />
              Plataforma de Gestão de Riscos
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight text-slate-900">
              Psicossociais no PGR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">com excelência.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Avalie riscos, gere evidências auditáveis e planos de ação em minutos. A ferramenta essencial para consultorias de alta performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/demo')} className="shadow-xl shadow-blue-600/20">
                Iniciar Demonstração
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection('features')}>
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
          
          {/* Hero Visual */}
          <div className="lg:w-1/2 w-full perspective-1000 relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-[100px] -z-10"></div>
            
            <div className="relative transform lg:rotate-y-6 lg:rotate-x-2 transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 p-2 border border-white">
                <div className="bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                  {/* Fake Browser UI */}
                  <div className="h-10 border-b border-slate-200 flex items-center px-4 gap-2 bg-white/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    <div className="flex-1 text-center text-[10px] text-slate-400 font-mono">{APP_URL}</div>
                  </div>
                  
                  {/* Dashboard Content Mock */}
                  <div className="p-6 bg-white min-h-[400px]">
                     <div className="flex justify-between items-center mb-8">
                       <div>
                         <h3 className="text-xl font-bold text-slate-900">Dashboard Executivo</h3>
                         <p className="text-sm text-slate-400">Visão Geral da Carteira</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <BarChart3 size={20} />
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                         <div className="text-3xl font-bold text-blue-700">18</div>
                         <div className="text-xs text-blue-400 font-bold uppercase mt-1">Empresas Ativas</div>
                       </div>
                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                         <div className="text-3xl font-bold text-slate-700">487</div>
                         <div className="text-xs text-slate-400 font-bold uppercase mt-1">Vidas Impactadas</div>
                       </div>
                     </div>

                     <div className="space-y-4">
                       <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                         <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">A</div>
                         <div className="flex-1">
                           <div className="font-bold text-slate-800">Metalúrgica Alpha</div>
                           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                             <div className="bg-red-500 h-1.5 rounded-full w-[85%]"></div>
                           </div>
                         </div>
                         <div className="text-red-500 font-bold text-sm">Alto Risco</div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                         <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">T</div>
                         <div className="flex-1">
                           <div className="font-bold text-slate-800">Tech Solutions</div>
                           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                             <div className="bg-cyan-500 h-1.5 rounded-full w-[35%]"></div>
                           </div>
                         </div>
                         <div className="text-cyan-600 font-bold text-sm">Controlado</div>
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
      <section className="py-24 bg-white scroll-mt-20" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Por que NR ZEN?</span>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mt-3">
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
              <div key={i} className="group p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-900 text-white scroll-mt-20" id="pricing">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Planos escaláveis
              </h2>
              <p className="text-slate-400">Escolha o plano ideal para o tamanho da sua carteira de clientes.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-white">Consultor</h3>
              <div className="text-4xl font-bold mb-4 text-white">R$ 199<span className="text-base font-normal text-slate-500">/mês</span></div>
              <p className="text-sm text-slate-400 mb-8 h-10">Para profissionais independentes iniciando a digitalização.</p>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Até 5 Empresas</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Relatório PDF Padrão</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Suporte por E-mail</li>
              </ul>
              <Button fullWidth variant="white" onClick={() => scrollToSection('contact')}>Começar</Button>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 rounded-2xl p-8 border border-blue-500 shadow-2xl relative transform md:-translate-y-4 flex flex-col">
              <div className="absolute top-0 right-0 bg-white/10 text-white text-xs px-3 py-1.5 rounded-bl-lg font-bold tracking-wide backdrop-blur-sm">MAIS ESCOLHIDO</div>
              <h3 className="text-xl font-bold mb-2 text-white">Business</h3>
              <div className="text-4xl font-bold mb-4 text-white">R$ 499<span className="text-base font-normal text-blue-200">/mês</span></div>
              <p className="text-sm text-blue-100 mb-8 h-10">Para consultorias estabelecidas que buscam eficiência.</p>
              <ul className="space-y-4 mb-8 text-sm text-white flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Até 30 Empresas</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Relatório White-Label (Seu Logo)</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Gestão de Acessos de Equipe</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-white flex-shrink-0"/> Suporte Prioritário</li>
              </ul>
              {/* Fix: Use white variant but override text color for blue contrast on blue card */}
              <Button 
                fullWidth 
                variant="white"
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-bold" 
                onClick={() => scrollToSection('contact')}
              >
                Assinar Agora
              </Button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-white">Enterprise</h3>
              <div className="text-4xl font-bold mb-4 text-white">Custom</div>
              <p className="text-sm text-slate-400 mb-8 h-10">Para grandes assessorias, franquias e SESMT corporativo.</p>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Empresas Ilimitadas</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Integração API</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Treinamento Dedicado</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-blue-500 flex-shrink-0"/> Contrato Personalizado</li>
              </ul>
              <Button fullWidth variant="white" onClick={() => scrollToSection('contact')}>Falar com Vendas</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 bg-white scroll-mt-20" id="contact">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4 text-slate-900">Agende uma conversa</h2>
            <p className="text-slate-500">Entenda como o NR ZEN pode transformar a entrega da sua consultoria.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100">
            {formSubmitted ? (
               <div className="text-center py-12">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicitação Recebida</h3>
                 <p className="text-slate-500">Nosso time comercial entrará em contato em até 24h.</p>
                 <Button variant="ghost" className="mt-6" onClick={() => setFormSubmitted(false)}>Enviar nova mensagem</Button>
               </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="João Silva" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                    <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="joao@empresa.com.br" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Celular</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Qual seu perfil?</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Qual?</label>
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
                
                <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-blue-600/20">Solicitar Contato</Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-3 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
               <Logo />
             </div>
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