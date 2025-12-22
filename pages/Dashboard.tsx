
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Activity, Plus, Zap, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Company } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, apiCall, token } = useAuth();
  
  const [stats, setStats] = useState<any>({ 
    total: 0, 
    activeSectors: 0, 
    responses: 0, 
    riskHighPercent: 0, 
    limits: { maxCompanies: 1, maxResponses: 3, maxSectors: 1 } 
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isTrial = user?.plan_tier === 'trial';
  const companyLimitReached = stats.total >= (stats.limits?.maxCompanies || 1);
  const responseLimitReached = stats.responses >= (stats.limits?.maxResponses || 3);

  const fetchData = async () => {
    if (token === 'demo-token-jwt') {
      setStats({ total: 12, activeSectors: 34, responses: 892, riskHighPercent: 18, limits: { maxCompanies: 999, maxResponses: 999 } });
      setCompanies([{ id: '1', name: "Metalúrgica Beta", cnpj: "12.345.678/0001-99", sectorsCount: 8, sectorsActive: 8, status: "active" } as any]);
      setLoading(false);
      return;
    }

    try {
      const [statsData, companiesData] = await Promise.all([
        apiCall('/api/companies?mode=stats'),
        apiCall('/api/companies')
      ]);
      setStats(statsData);
      setCompanies(companiesData || []);
    } catch (err: any) {
      setError("Falha na sincronização.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  if (loading) return <Layout><div className="h-full flex items-center justify-center min-h-[60vh] animate-pulse font-bold text-slate-400 uppercase tracking-widest">Sincronizando...</div></Layout>;

  return (
    <Layout>
      {/* Barra de Quotas para Plano Trial */}
      {isTrial && (
        <div className={`mb-10 rounded-2xl border p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 shadow-sm ${companyLimitReached || responseLimitReached ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-xl shadow-inner ${companyLimitReached || responseLimitReached ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
               {companyLimitReached || responseLimitReached ? <Lock size={20} /> : <Zap size={20} />}
             </div>
             <div>
               <p className={`font-black text-sm uppercase tracking-tight ${companyLimitReached || responseLimitReached ? 'text-amber-900' : 'text-blue-900'}`}>
                 {companyLimitReached || responseLimitReached ? 'Limite do Plano Atingido' : 'Você está em modo Trial'}
               </p>
               <p className="text-xs font-medium opacity-60">
                 {stats.total}/{stats.limits.maxCompanies} Empresa • {stats.responses}/{stats.limits.maxResponses} Respostas este mês
               </p>
             </div>
          </div>
          <Link to="/app/billing" className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${companyLimitReached || responseLimitReached ? 'bg-slate-900 text-white hover:scale-105 shadow-xl' : 'text-blue-700 bg-white shadow-sm border border-blue-100 hover:bg-blue-50'}`}>
            {companyLimitReached || responseLimitReached ? 'Liberar Acesso Total' : 'Ver Planos'} <ChevronRight size={14} />
          </Link>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-800 tracking-tight">Painel Operacional</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Visão consolidada da sua carteira SST.</p>
        </div>
        <div className="flex items-center gap-3">
           {companyLimitReached && isTrial ? (
             <Button variant="dark" onClick={() => navigate('/app/billing')} className="bg-slate-900 border-none shadow-xl">
                <Lock size={16} className="mr-2 text-amber-500" /> Upgrade Necessário
             </Button>
           ) : (
             <Button onClick={() => navigate('/app/onboarding')}><Plus size={18} className="mr-2"/> Nova Empresa</Button>
           )}
        </div>
      </header>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Clientes", value: stats.total, icon: Building2, color: "blue", sub: isTrial ? `Limite: ${stats.limits.maxCompanies}` : "Ativos" },
          { label: "Setores", value: stats.activeSectors, icon: Users, color: "emerald", sub: isTrial ? "1 Unidade" : "Monitorados" },
          { label: "Respostas", value: stats.responses, icon: Activity, color: "indigo", sub: isTrial ? `/ ${stats.limits.maxResponses} mês` : "Acumuladas" },
          { label: "Riscos", value: `${stats.riskHighPercent}%`, icon: AlertTriangle, color: "red", sub: "Criticidade" },
        ].map((k, i) => (
          <Card key={i} className="group hover:border-blue-500 transition-all border-b-4 border-b-slate-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
                 <p className="text-3xl font-black text-slate-800 mt-1">{k.value}</p>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{k.sub}</p>
               </div>
               <div className={`p-3 rounded-xl bg-${k.color}-50 text-${k.color}-600 group-hover:scale-110 transition-transform`}>
                 <k.icon size={22} />
               </div>
             </div>
          </Card>
        ))}
      </div>

      <Card padding="p-0" className="overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organização</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-slate-700">{c.name}</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm" onClick={() => navigate('/app/companies')}>Gerenciar</Button>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-12 text-center text-slate-400 italic text-sm font-medium">Nenhuma empresa no inventário.</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </Card>
    </Layout>
  );
};

export default Dashboard;
