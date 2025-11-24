import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Building2, Users, ArrowRight, CheckCircle2, ChevronLeft, AlertCircle, Copy, HelpCircle, Briefcase } from 'lucide-react';
import { APP_URL } from '../constants';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    sectorName: '',
    employees: ''
  });

  // Validation State
  const [errors, setErrors] = useState({
    name: '',
    cnpj: '',
    sectorName: '',
    employees: ''
  });

  // CNPJ Mask
  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cnpj') {
      setFormData({ ...formData, [name]: formatCNPJ(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error on type
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (currentStep: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'A Razão Social é obrigatória.';
        isValid = false;
      }
      if (!formData.cnpj.trim() || formData.cnpj.length < 18) {
        newErrors.cnpj = 'CNPJ inválido ou incompleto.';
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.sectorName.trim()) {
        newErrors.sectorName = 'O nome do setor é obrigatório.';
        isValid = false;
      }
      if (!formData.employees || parseInt(formData.employees) < 1) {
        newErrors.employees = 'Informe ao menos 1 funcionário.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      navigate('/app');
    }, 1000);
  };

  const handleCopyLink = () => {
    const link = `${APP_URL}/#/questionario/ref-${formData.cnpj.slice(0,3)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
        
        {/* Breadcrumb / Title */}
        <div className="mb-8">
           <h1 className="text-2xl font-heading font-bold text-slate-800">Nova Empresa</h1>
           <p className="text-slate-500 text-sm">Passo a passo para configurar um novo cliente.</p>
        </div>

        {/* Stepper Visual Refined */}
        <div className="mb-12 px-4">
           <div className="flex items-center justify-between relative max-w-xl mx-auto">
             {/* Background Line */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
             
             {/* Active Line Progress */}
             <div 
               className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
               style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
             ></div>

             {/* Steps */}
             {[
                { num: 1, label: 'Dados Cadastrais', icon: Building2 }, 
                { num: 2, label: 'Primeiro Setor', icon: Users }, 
                { num: 3, label: 'Conclusão', icon: CheckCircle2 }
             ].map((s) => (
               <div key={s.num} className="flex flex-col items-center bg-[#F8FAFC] px-4 cursor-default">
                 <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-[3px] transition-all duration-300 relative z-10
                    ${step >= s.num 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' 
                      : 'bg-white border-slate-300 text-slate-400'}
                 `}>
                   <s.icon size={20} strokeWidth={2.5} />
                 </div>
                 <span className={`text-xs font-bold mt-3 uppercase tracking-wider transition-colors duration-300 ${step >= s.num ? 'text-blue-700' : 'text-slate-400'}`}>
                   {s.label}
                 </span>
               </div>
             ))}
           </div>
        </div>

        <Card className="p-0 overflow-hidden border-0 shadow-xl shadow-slate-200/50">
          <div className="p-8 md:p-10">
            {/* Step 1: Company Info */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                     <Building2 size={24} />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-800">Dados da Organização</h2>
                     <p className="text-sm text-slate-500">Informe os dados legais da empresa que será avaliada.</p>
                   </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Razão Social <span className="text-red-500">*</span></label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all placeholder:text-slate-400 ${
                        errors.name 
                          ? 'border-red-300 focus:ring-2 focus:ring-red-100 bg-red-50' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 hover:border-slate-300'
                      }`}
                      placeholder="Ex: Indústrias Metalúrgicas Beta Ltda" 
                      autoFocus
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1.5 flex items-center font-medium"><AlertCircle size={12} className="mr-1"/>{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CNPJ <span className="text-red-500">*</span></label>
                    <input 
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      type="text" 
                      maxLength={18}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 ${
                        errors.cnpj
                          ? 'border-red-300 focus:ring-2 focus:ring-red-100 bg-red-50' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 hover:border-slate-300'
                      }`}
                      placeholder="00.000.000/0001-00" 
                    />
                    {errors.cnpj && <p className="text-xs text-red-500 mt-1.5 flex items-center font-medium"><AlertCircle size={12} className="mr-1"/>{errors.cnpj}</p>}
                  </div>
                </div>
                
                <div className="pt-8 flex justify-end">
                   <Button onClick={handleNext} size="lg" className="px-8 shadow-lg shadow-blue-600/20">
                     Continuar <ArrowRight size={18} className="ml-2"/>
                   </Button>
                </div>
              </div>
            )}

            {/* Step 2: First Sector */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                     <Users size={24} />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-800">Estrutura Inicial</h2>
                     <p className="text-sm text-slate-500">Cadastre o primeiro setor ou GHE para iniciar a coleta.</p>
                   </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex gap-4">
                  <div className="bg-white p-2 rounded-lg text-blue-600 h-min shadow-sm">
                    <HelpCircle size={20} />
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-800 mb-1">Dica de Especialista</p>
                    <p>Agrupe funcionários que compartilham as mesmas condições de trabalho e riscos similares (Conceito de Grupo Homogêneo de Exposição - GHE).</p>
                    <p className="mt-2 text-xs text-slate-500">Exemplos: "Administrativo", "Produção - Linha A", "Equipe de Vendas".</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Setor / GHE <span className="text-red-500">*</span></label>
                    <input 
                      name="sectorName"
                      value={formData.sectorName}
                      onChange={handleChange}
                      type="text" 
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all placeholder:text-slate-400 ${
                        errors.sectorName 
                          ? 'border-red-300 focus:ring-2 focus:ring-red-100 bg-red-50' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 hover:border-slate-300'
                      }`}
                      placeholder="Ex: Operação Logística - Turno 1" 
                      autoFocus
                    />
                    {errors.sectorName && <p className="text-xs text-red-500 mt-1.5 flex items-center font-medium"><AlertCircle size={12} className="mr-1"/>{errors.sectorName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">População Estimada (Vidas) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        name="employees"
                        value={formData.employees}
                        onChange={handleChange}
                        type="number" 
                        min="1"
                        className={`w-full px-4 py-3 pl-12 bg-slate-50 border rounded-lg outline-none transition-all placeholder:text-slate-400 ${
                          errors.employees
                            ? 'border-red-300 focus:ring-2 focus:ring-red-100 bg-red-50' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 hover:border-slate-300'
                        }`}
                        placeholder="0" 
                      />
                      <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                     {errors.employees && <p className="text-xs text-red-500 mt-1.5 flex items-center font-medium"><AlertCircle size={12} className="mr-1"/>{errors.employees}</p>}
                  </div>
                </div>

                <div className="pt-8 flex justify-between gap-4 border-t border-slate-50 mt-4">
                   <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700">
                     <ChevronLeft size={18} className="mr-2"/> Voltar
                   </Button>
                   <Button onClick={handleNext} size="lg" className="px-8 shadow-lg shadow-blue-600/20">
                     Finalizar Cadastro
                   </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
               <div className="animate-in fade-in zoom-in duration-300 text-center py-4">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-white ring-1 ring-emerald-50">
                   <CheckCircle2 size={40} />
                 </div>
                 
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Empresa Cadastrada!</h2>
                 <p className="text-slate-500 mb-8 max-w-md mx-auto">O ambiente para <strong className="text-slate-800">{formData.name}</strong> foi configurado e o link para o setor <strong className="text-slate-800">{formData.sectorName}</strong> já está ativo.</p>
                 
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-lg mx-auto mb-8 relative group text-left">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Link de Coleta
                      </p>
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">Vence em 30 dias</span>
                   </div>
                   
                   <div className="flex items-stretch gap-0 border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm hover:border-blue-400 transition-colors group-hover:ring-2 group-hover:ring-blue-100">
                     <div className="flex-1 px-4 py-3 text-slate-600 font-mono text-sm truncate select-all border-r border-slate-100 flex items-center">
                       {APP_URL}/#/questionario/ref-{formData.cnpj.slice(0,3)}-{formData.sectorName.slice(0,3).toLowerCase()}
                     </div>
                     <button 
                      onClick={handleCopyLink}
                      className="bg-slate-50 px-5 hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-600 hover:text-blue-600 flex items-center justify-center relative"
                      title="Copiar Link"
                     >
                       {copied ? <CheckCircle2 size={20} className="text-emerald-600 scale-110 transition-transform" /> : <Copy size={20} />}
                     </button>
                   </div>
                   
                   <div className="h-6 mt-2 relative">
                    {copied && (
                        <p className="absolute left-0 text-xs text-emerald-600 font-bold flex items-center animate-fade-in-down">
                            <CheckCircle2 size={12} className="mr-1"/> Link copiado para a área de transferência!
                        </p>
                    )}
                   </div>
                   
                   <div className="text-xs text-slate-400 border-t border-slate-200 pt-3 mt-1 flex gap-2">
                     <AlertCircle size={14} className="shrink-0"/>
                     <p>Envie este link via WhatsApp ou E-mail para os colaboradores. Eles não precisam de login para responder.</p>
                   </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button variant="secondary" onClick={() => navigate('/app/companies')}>
                     Ver Lista de Empresas
                   </Button>
                   <Button onClick={handleFinish} size="lg" disabled={loading} className="px-8 shadow-lg shadow-blue-600/20">
                     {loading ? 'Carregando...' : 'Ir para o Dashboard'} <ArrowRight size={18} className="ml-2"/>
                   </Button>
                 </div>
               </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Onboarding;