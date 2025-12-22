
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Building2, Users, ArrowRight, CheckCircle2, AlertCircle, Lock, Gem, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<'LIMIT' | 'API' | null>(null);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({ name: '', cnpj: '', sectorName: '', employees: '' });

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      setErrorType(null);
      try {
        await apiCall('/api/companies', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            cnpj: formData.cnpj,
            firstSectorName: formData.sectorName, 
            employeesCount: formData.employees
          })
        });
        setStep(3);
      } catch (err: any) {
        if (err.message?.includes('LIMIT_REACHED')) {
          setErrorType('LIMIT');
        } else {
          setErrorType('API');
          setApiError(err.message || 'Erro inesperado.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        {errorType === 'LIMIT' ? (
           <div className="animate-fade-in-down">
              <Card className="text-center p-12 border-t-4 border-t-amber-500 shadow-2xl overflow-hidden relative bg-white">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Gem size={120} />
                 </div>
                 <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-100">
                    <Lock size={40} />
                 </div>
                 <h2 className="text-3xl font-heading font-black text-slate-900 mb-4 tracking-tight">Limite Atingido</h2>
                 <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
                   O plano **Trial** permite gerenciar apenas **1 empresa**. <br/> 
                   Para expandir sua consultoria e gerar laudos em massa, mude para um plano profissional.
                 </p>
                 <div className="flex flex-col gap-3">
                   <Button size="lg" fullWidth onClick={() => navigate('/app/billing')} className="h-16 uppercase text-xs font-black tracking-widest shadow-xl shadow-blue-600/20">
                     Escolher Plano Profissional <ChevronRight size={16} className="ml-2"/>
                   </Button>
                   <Button variant="ghost" size="lg" fullWidth onClick={() => navigate('/app')} className="h-14 uppercase text-xs font-black tracking-widest text-slate-400">
                     Voltar ao Painel
                   </Button>
                 </div>
              </Card>
           </div>
        ) : (
          <>
            <div className="mb-10 text-center md:text-left">
               <h1 className="text-3xl font-heading font-black text-slate-800 tracking-tight">Estruturar Nova Coleta</h1>
               <p className="text-slate-500 font-medium">Configure os parâmetros técnicos para iniciar o diagnóstico.</p>
            </div>

            <Card className="p-10 shadow-2xl border-t-4 border-blue-600">
               {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                       <Building2 className="text-blue-600" />
                       <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Dados da Organização</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Razão Social</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" placeholder="Ex: Indústrias Metalúrgicas Beta" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CNPJ</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono" placeholder="00.000.000/0001-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                    </div>
                    <div className="pt-6 flex justify-end">
                       <Button onClick={handleNext} className="h-14 px-10 uppercase text-xs font-black tracking-widest">Próximo Passo <ArrowRight size={16} className="ml-3"/></Button>
                    </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                       <Users className="text-blue-600" />
                       <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Escopo da Avaliação</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Setor / GHE</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" placeholder="Ex: Logística - Turno 1" value={formData.sectorName} onChange={e => setFormData({...formData, sectorName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">População Total do Setor</label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" placeholder="Ex: 45" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} />
                    </div>
                    {errorType === 'API' && <div className="text-red-600 text-sm font-bold flex items-center gap-2 bg-red-50 p-4 rounded-2xl border border-red-100 animate-fade-in"><AlertCircle size={16}/> {apiError}</div>}
                    <div className="pt-6 flex justify-between items-center">
                       <Button variant="ghost" onClick={() => setStep(1)} disabled={loading} className="font-black text-xs uppercase tracking-widest text-slate-400">Voltar</Button>
                       <Button onClick={handleNext} disabled={loading} className="h-14 px-10 uppercase text-xs font-black tracking-widest shadow-lg shadow-blue-600/20">{loading ? 'Validando Quota...' : 'Concluir Estrutura'}</Button>
                    </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="text-center py-6 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200"><CheckCircle2 size={40}/></div>
                    <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Coleta Estruturada!</h2>
                    <p className="text-slate-500 mb-10 font-medium italic">Seu cliente foi cadastrado e os links de resposta estão ativos.</p>
                    <Button fullWidth onClick={() => navigate('/app')} className="h-16 uppercase text-xs font-black tracking-widest shadow-xl shadow-blue-600/20">Acessar Área de Gestão</Button>
                  </div>
               )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Onboarding;
