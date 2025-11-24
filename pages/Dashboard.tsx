import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Activity, Plus } from 'lucide-react';
import { useMockData } from '../context/MockContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { companies, getCompanyStats } = useMockData();
  const stats = getCompanyStats();

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta, João.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="secondary" size="sm">Filtrar</Button>
           <Button size="sm" onClick={() => navigate('/app/onboarding')}><Plus size={16} className="mr-1"/> Nova Empresa</Button>
           <div className="h-8 w-[1px] bg-slate-300 mx-1"></div>
           <div className="flex items-center gap-3 cursor-pointer hover:bg-white p-1 rounded-full transition-colors" onClick={() => navigate('/app/settings')}>
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">JS</div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-700">João Silva</p>
              <p className="text-xs text-slate-500">Consultor Senior</p>
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
        <Card className="flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respostas (mês)</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.responses}</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Activity size={24} /></div>
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
          <div className="flex gap-2">
            <input type="text" placeholder="Buscar empresa..." className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Setores</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Última Coleta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risco Global</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate('/app/setor/1')}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {company.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{company.name}</div>
                        <div className="text-xs text-slate-500">{company.cnpj}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="font-semibold">{company.sectorsActive}</span> <span className="text-slate-400">/ {company.sectorsCount} ativos</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {company.lastCollection}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      company.status === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      company.status === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        company.status === 'low' ? 'bg-emerald-500' :
                        company.status === 'moderate' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></span>
                      {company.status === 'low' ? 'Baixo' : company.status === 'moderate' ? 'Moderado' : 'Alto'}
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
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Mostrando {companies.length} empresas</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Próxima</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;