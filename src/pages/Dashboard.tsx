
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
// Added ChevronRight to the imports from lucide-react
import { Building2, Users, AlertTriangle, Activity, Plus, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (token === 'demo-token-jwt') {
        if (isMounted) {
          setStats(DEMO_STATS);
          setCompanies(DEMO_COMPANIES);
          setLoading(false);
        }
        return;
      }
      try {
        const [statsData, companiesData] = await Promise.all([
          apiCall('/api/companies?mode=stats'),
          apiCall('/api/companies')
        ]);
        if (isMounted) {
          setStats(statsData || { total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });
          setCompanies(companiesData || []);
        }
      } catch (error: any) {
        if (isMounted) setError("Erro na sincronização de dados.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [apiCall, token]);

  if (loading) return <Layout><div className="h-full flex items-center justify-center min-h-[60vh] animate-pulse text-slate-300 font-black uppercase tracking-widest">Sincronizando Sistema...</div></Layout>;

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-[44px] font-heading font-black text-slate-900 tracking-tight leading-none">Painel de Controle</h1>
          <p className="text-xl text-slate-500 mt-3 font-medium italic opacity-80">Gestão consolidada SST para {user?.name?.split(' ')[0]}.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/app/onboarding')} className="h-20 px-12 text-base shadow-2xl">
          <Plus size={24} className="mr-3" strokeWidth={3} />
          Cadastrar Empresa
        </Button>
      </header>

      {/* Grid de KPIs - Cards Maiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: "Empresas", value: stats.total, icon: Building2, color: "blue", border: "border-l-blue-600" },
          { label: "Setores", value: stats.activeSectors, icon: Users, color: "emerald", border: "border-l-emerald-500" },
          { label: "Respostas", value: stats.responses, icon: Activity, color: "blue", border: "border-l-blue-400" },
          { label: "Risco Alto", value: `${stats.riskHighPercent}%`, icon: AlertTriangle, color: "red", border: "border-l-red-500" },
        ].map((k, i) => (
          <Card key={i} className={`flex items-center justify-between p-10 shadow-lg hover:shadow-2xl transition-all border-l-[6px] ${k.border} group`}>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{k.label}</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{k.value}</p>
            </div>
            <div className={`p-5 rounded-2xl bg-${k.color}-50 text-${k.color}-600 group-hover:scale-110 transition-transform shadow-sm`}>
              <k.icon size={32} strokeWidth={2.5} />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabela de Empresas - Fontes Maiores */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-2xl text-slate-900 tracking-tight">Carteira Ativa</h3>
          <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100">Atualizado Agora</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Organização</th>
                <th className="px-10 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">CNPJ</th>
                <th className="px-10 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => navigate('/app/companies')}>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {c.name.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-black text-slate-800 text-lg tracking-tight">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-base text-slate-500 font-mono">{c.cnpj}</td>
                  <td className="px-10 py-8 text-right">
                    <Button variant="ghost" className="text-sm font-black uppercase tracking-widest text-blue-600 group-hover:bg-blue-50">
                      Gerenciar <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
