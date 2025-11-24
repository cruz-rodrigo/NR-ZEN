import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Building2 } from 'lucide-react';
import { useMockData } from '../context/MockContext';

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useMockData();

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Empresas</h1>
          <p className="text-slate-500 mt-1">Gerencie sua carteira de clientes e unidades.</p>
        </div>
        <Button onClick={() => navigate('/app/onboarding')}>
          <Plus size={18} className="mr-2"/> Nova Empresa
        </Button>
      </header>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Setores</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Atual</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                        <Building2 size={20} />
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {company.cnpj}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-xs">
                      {company.sectorsActive}
                    </span>
                    <span className="text-slate-400 ml-2">de {company.sectorsCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      company.status === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      company.status === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {company.status === 'low' ? 'Controlado' : company.status === 'moderate' ? 'Atenção' : 'Crítico'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                     <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                       <MoreVertical size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default Companies;