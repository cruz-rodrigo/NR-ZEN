import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Download, Eye, Calendar, Building2, Info, HelpCircle, ClipboardCheck, LayoutList } from 'lucide-react';

const Reports: React.FC = () => {
  const navigate = useNavigate();

  const reports = [
    { 
      id: 1, 
      company: "Indústrias Metalúrgicas Beta", 
      sector: "Operação Logística – Turno 1", 
      date: "10/10/2025", 
      status: "Concluído", 
      type: "PGR Anexo II",
      icon: <LayoutList size={18} className="text-blue-600" />,
      tag: "Final",
      description: "INVENTÁRIO COMPLETO: Documento oficial para o GRO. Contém Matriz de Risco (Probabilidade x Severidade) e o Plano de Ação (Medidas de Controle) exigidos pela NR-01."
    },
    { 
      id: 2, 
      company: "Indústrias Metalúrgicas Beta", 
      sector: "Administrativo", 
      date: "05/10/2025", 
      status: "Em Análise", 
      type: "Preliminar",
      icon: <ClipboardCheck size={18} className="text-amber-600" />,
      tag: "Campo",
      description: "LEVANTAMENTO PRELIMINAR: Triagem inicial baseada na percepção dos trabalhadores. Utilizado para identificar se há necessidade de uma avaliação mais profunda."
    },
  ];

  const handleDownload = (id: number) => {
    navigate('/relatorio?download=true');
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Relatórios Técnicos</h1>
          <p className="text-slate-500 mt-1">Histórico de documentos gerados para PGR/GRO.</p>
        </div>
        <div className="bg-slate-900 text-white rounded-xl px-5 py-4 flex items-center gap-4 text-xs shadow-2xl border border-slate-700 max-w-md">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <HelpCircle size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-blue-400 mb-1 uppercase tracking-tight">Qual a diferença?</p>
            <p className="opacity-70 leading-relaxed text-[11px]">
              O <b>PGR II</b> é o documento final legal. A <b>Preliminar</b> é sua ferramenta de triagem inicial.
            </p>
          </div>
        </div>
      </header>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa / Setor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Emissão</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${report.type === 'Preliminar' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                        {report.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{report.type}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${report.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400"/> {report.company}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5">{report.sector}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400"/>
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => navigate('/relatorio')}>
                        <Eye size={16} className="mr-1.5"/> Ver
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-blue-600"
                        onClick={() => handleDownload(report.id)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
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

export default Reports;