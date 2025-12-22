
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Building2, Users, ArrowRight, CheckCircle2, ChevronLeft, AlertCircle, Lock, Gem } from 'lucide-react';
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
              <Card className="text-center p-12 border-t-4 border-t-amber-500 shadow-2xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Gem size={100} />
                 </div>
                 <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Lock size={40} />
                 </div>
                 <h2 className="text-3xl font-heading font-black text-slate-900 mb-4 tracking-tight">Limite do Trial Atingido</h2>
                 <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
                   O plano de avaliação permite apenas **1 empresa e 1 setor**. <br/> 
                   Profissionalize sua consultoria para gerenciar múltiplos CNPJs e gerar laudos oficiais para seus clientes.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <Button size="lg" fullWidth onClick={() => navigate('/app/billing')} className="h-16 uppercase text-xs font-black tracking-widest shadow-xl shadow-blue-600/20">Escolher Plano Profissional</Button>
                   <Button variant="secondary" size="lg" fullWidth onClick={() => navigate('/app')} className="h-16 uppercase text-xs font-black tracking-widest">Voltar ao Painel</Button>
                 </div>
              </Card>
           </div>
        ) : (
          <>
            <div className="mb-10">
               <h1 className="text-3xl font-heading font-black text-slate-800 tracking-tight">Configuração de Organização</h1>
               <p className="text-slate-500 font-medium">Passo {step} de 3 • Estruturando nova coleta</p>
            </div>

            <Card className="p-10 shadow-2xl border-t-4 border-blue-600">
               {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                       <Building2 className="text-blue-600" />
                       <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Identificação Jurídica</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Razão Social</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Ex: Indústrias Metalúrgicas Beta" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CNPJ</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono" placeholder="00.000.000/0001-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                    </div>
                    <div className="pt-6 flex justify-end">
                       <Button onClick={handleNext} className="h-14 px-8 uppercase text-xs font-black tracking-widest">Próximo Passo <ArrowRight size={16} className="ml-3"/></Button>
                    </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                       <Users className="text-blue-600" />
                       <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Escopo da Coleta</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Primeiro Setor ou GHE</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Ex: Logística - Turno 1" value={formData.sectorName} onChange={e => setFormData({...formData, sectorName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Total de Funcionários</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Quantidade estimada" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} />
                    </div>
                    {errorType === 'API' && <div className="text-red-600 text-sm font-bold flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in"><AlertCircle size={14}/> {apiError}</div>}
                    <div className="pt-6 flex justify-between">
                       <Button variant="ghost" onClick={() => setStep(1)} disabled={loading} className="font-black text-xs uppercase tracking-widest">Voltar</Button>
                       <Button onClick={handleNext} disabled={loading} className="h-14 px-8 uppercase text-xs font-black tracking-widest shadow-lg shadow-blue-600/20">{loading ? 'Salvando...' : 'Concluir Cadastro'}</Button>
                    </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="text-center py-6 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle2 size={40}/></div>
                    <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Empresa Cadastrada!</h2>
                    <p className="text-slate-500 mb-10 font-medium italic">O ambiente de coleta está pronto para receber respostas.</p>
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
