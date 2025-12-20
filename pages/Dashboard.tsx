import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Activity, Plus, ArrowRight, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Company } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, apiCall, token } = useAuth();
  
  const [stats, setStats] = useState({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DEMO_STATS = { total: 12, activeSectors: 34, responses: 892, riskHighPercent: 18 };
  const DEMO_COMPANIES: Company[] = [
    { id: '1', name: "Indústrias Metalúrgicas Beta", cnpj: "12.345.678/0001-99", sectorsCount: 8, sectorsActive: 8, lastCollection: "10/10/2025", status: "active" },
    { id: '2', name: "Transportadora Veloz", cnpj: "98.765.432/0001-11", sectorsCount: 4, sectorsActive: 2, lastCollection: "05/10/2025", status: "active" },
    { id: '3', name: "Call Center Solutions", cnpj: "11.222.333/0001-00", sectorsCount: 12, sectorsActive: 12, lastCollection: "12/10/2025", status: "active" },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    if (token === 'demo-token-jwt') {
      setStats(DEMO_STATS);
      setCompanies(DEMO_COMPANIES);
      setLoading(false);
      return;
    }

    try {
      const [statsData, companiesData] = await Promise.all([
        apiCall('/api/companies?mode=stats'),
        apiCall('/api/companies')
      ]);
      
      setStats(statsData || { total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });
      setCompanies(companiesData || []);
    } catch (error: any) {
      console.error("Erro no Dashboard:", error);
      setError("Não foi possível sincronizar os dados com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiCall, token]);

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Sincronizando dados...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 mt-1">Bem-vindo, <span className="font-semibold text-slate-700">{user?.name?.split(' ')[0] || 'Consultor'}</span>. Aqui está o resumo da sua carteira.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="secondary" size="sm" onClick={fetchData} className="hidden md:flex">
             <RefreshCcw size={16} className="mr-2"/> Atualizar
           </Button>
           <Button size="sm" onClick={() => navigate('/app/onboarding')} className="shadow-lg shadow-blue-600/20">
             <Plus size={16} className="mr-1"/> Nova Empresa
           </Button>
        </div>
      </header>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={fetchData} className="text-xs font-bold uppercase tracking-widest hover:underline">Tentar novamente</button>
        </div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Empresas", value: stats.total, icon: Building2, color: "blue" },
          { label: "Setores Ativos", value: stats.activeSectors, icon: Users, color: "emerald" },
          { label: "Amostragem", value: stats.responses, icon: Activity, color: "indigo" },
          { label: "Risco Crítico", value: `${stats.riskHighPercent}%`, icon: AlertTriangle, color: "red" },
        ].map((kpi, i) => (
          <Card key={i} className={`relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-b-4 border-b-${kpi.color}-500`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-slate-800 tracking-tighter">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                <kpi.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Client List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Carteira de Clientes Ativos</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{companies.length} registros</span>
        </div>
        
        <div className="overflow-x-auto">
          {companies.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} />
              </div>
              <h4 className="text-slate-800 font-bold text-lg">Sua carteira está vazia</h4>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 mb-8">Comece cadastrando sua primeira empresa para automatizar os diagnósticos.</p>
              <Button onClick={() => navigate('/app/onboarding')}>Configurar Primeira Empresa</Button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentação</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operação</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                          {company.name.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{company.name}</p>
                          <p className="text-xs text-slate-400">{company.lastCollection || 'Sem coletas'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-mono text-slate-600">{company.cnpj}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">CNPJ REGULAR</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{company.sectorsActive || 0}</span>
                        <span className="text-xs text-slate-400">setores ativos</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                         <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/app/companies')} className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                        Gerenciar <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;