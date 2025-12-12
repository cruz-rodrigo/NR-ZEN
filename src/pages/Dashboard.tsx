import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Activity, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Company } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, apiCall } = useAuth();
  
  const [stats, setStats] = useState({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca simultânea de estatísticas e lista de empresas
        const [statsData, companiesData] = await Promise.all([
          apiCall('/api/dashboard/stats').catch(() => null),
          apiCall('/api/companies').catch(() => null)
        ]);
        
        // Fallbacks seguros caso a API falhe (comum em preview)
        setStats(statsData || { total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });
        setCompanies(companiesData || []);
        
      } catch (error) {
        console.error("Erro no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  if (loading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta, {user?.name || 'Visitante'}.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button size="sm" onClick={() => navigate('/app/onboarding')}><Plus size={16} className="mr-1"/> Nova Empresa</Button>
           <div className="h-8 w-[1px] bg-slate-300 mx-1"></div>
           <div className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded-full transition-colors" onClick={() => navigate('/app/settings')}>
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
              {user?.name ? user.name.substring(0,2).toUpperCase() : 'US'}
            </div>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Empresas</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Building2 size={24} /></div>
        </Card>
        <Card className="flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Setores Ativos</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.activeSectors}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Users size={24} /></div>
        </Card>
        <Card className="flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-400">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respostas (mês)</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.responses}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><Activity size={24} /></div>
        </Card>
        <Card className="flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">% Risco Alto</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.riskHighPercent}%</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl text-red-600"><AlertTriangle size={24} /></div>
        </Card>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-slate-800">Carteira de Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          {companies.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Building2 size={40} className="mx-auto text-slate-200 mb-3"/>
              <p>Nenhuma empresa encontrada.</p>
              <Button variant="ghost" className="mt-2 text-blue-600" onClick={() => navigate('/app/onboarding')}>
                Cadastre sua primeira empresa
              </Button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Setores</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/app/companies`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {company.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{company.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                      {company.cnpj}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="font-semibold">{company.sectorsActive || 0}</span> <span className="text-slate-400">ativos</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                         Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                        Gerenciar
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