import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Logo } from '../components/Layout';

const DemoLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Capture / Backend Processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Wait a moment to show success message before redirecting
      setTimeout(() => {
        navigate('/questionario');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navbar simplificada */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
         <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
           <Logo size="md" />
         </div>
         <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors hidden sm:block">
           Precisa de ajuda?
         </a>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 max-w-6xl mx-auto w-full gap-12 lg:gap-24">
        
        {/* Lado Esquerdo - Contexto */}
        <div className="hidden md:block max-w-md space-y-8">
           <div>
             <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
               Acesso Demonstração
             </span>
             <h1 className="text-4xl font-heading font-extrabold text-slate-900 leading-tight">
               Veja como é fácil gerenciar riscos psicossociais.
             </h1>
             <p className="mt-4 text-lg text-slate-500 leading-relaxed">
               Experimente a jornada completa: da resposta do colaborador à geração automática do relatório PGR.
             </p>
           </div>

           <div className="space-y-4">
              {[
                "Sem necessidade de cartão de crédito",
                "Acesso imediato ao dashboard simulado",
                "Relatório modelo PDF incluso"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  {item}
                </div>
              ))}
           </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full max-w-md">
           <Card className={`shadow-2xl shadow-blue-900/10 border-t-4 p-8 transition-colors duration-500 ${success ? 'border-t-emerald-500' : 'border-t-blue-600'}`}>
             
             {success ? (
               <div className="text-center py-8 animate-fade-in-down">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <CheckCircle2 size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Liberado!</h2>
                 <p className="text-slate-500 mb-6">
                   Seus dados foram validados com sucesso.<br/>
                   Redirecionando para o ambiente de teste...
                 </p>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out_forwards]" style={{ width: '0%' }}></div>
                 </div>
                 <style>{`
                   @keyframes progress {
                     0% { width: 0%; }
                     100% { width: 100%; }
                   }
                 `}</style>
               </div>
             ) : (
               <>
                 <div className="mb-6 md:hidden">
                    <h1 className="text-2xl font-bold text-slate-900">Acesse a Demo</h1>
                    <p className="text-slate-500 text-sm">Preencha para iniciar o teste.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-5">
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo</label>
                     <input 
                        required 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                        placeholder="Ex: João Silva"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail corporativo</label>
                     <input 
                        required 
                        type="email" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                        placeholder="voce@empresa.com.br"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Celular / WhatsApp</label>
                     <input 
                        required 
                        type="tel" 
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                        placeholder="(11) 99999-9999"
                     />
                   </div>

                   <Button 
                    type="submit" 
                    fullWidth 
                    size="lg" 
                    disabled={loading}
                    className="mt-4 shadow-lg shadow-blue-600/20 py-3.5"
                   >
                     {loading ? (
                       <span className="flex items-center justify-center gap-2">
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Validando...
                       </span>
                     ) : (
                       <span className="flex items-center justify-center gap-2">
                         Acessar Questionário <ArrowRight size={18} />
                       </span>
                     )}
                   </Button>
                 </form>
                 
                 <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                   <Lock size={12} className="text-emerald-500" />
                   <span>Seus dados estão protegidos.</span>
                 </div>
               </>
             )}
           </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;