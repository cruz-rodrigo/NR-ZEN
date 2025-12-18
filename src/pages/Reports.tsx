
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Download, Eye, Calendar, Building2, Info, HelpCircle } from 'lucide-react';

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
      description: "Inventário de Riscos + Plano de Ação. Documento robusto para compor o PGR definitivo da empresa."
    },
    { 
      id: 2, 
      company: "Indústrias Metalúrgicas Beta", 
      sector: "Administrativo", 
      date: "05/10/2025", 
      status: "Em Análise", 
      type: "Preliminar",
      description: "Levantamento inicial de perigos psicossociais. Ideal para triagem e atendimento rápido à NR-01."
    },
    { 
      id: 3, 
      company: "Transportadora Veloz", 
      sector: "Motoristas Frota Pesada", 
      date: "01/10/2025", 
      status: "Concluído", 
      type: "PGR Anexo II",
      description: "Inventário de Riscos + Plano de Ação. Documento robusto para compor o PGR definitivo da empresa."
    },
  ];

  const handleDownload = (id: number) => {
    // Adiciona o parâmetro 'download=true' para o componente de relatório saber que deve abrir a impressão
    navigate('/relatorio?download=true');
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500 mt-1">Histórico de laudos e avaliações geradas.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex items-center gap-3 text-xs text-blue-700">
          <HelpCircle size={16} />
          <span>Dica: O <b>PGR II</b> é o documento completo com plano de ação; a <b>Preliminar</b> é para triagem inicial.</span>
        </div>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa / Setor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Referência</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-800 text-sm">{report.type}</p>
                          <div className="relative flex items-center group/tooltip">
                            <Info size={14} className="text-slate-300 cursor-help hover:text-blue-500 transition-colors" />
                            {/* TOOLTIP FIX: Centered and with higher Z-index */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-56 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-2xl z-[100] leading-relaxed animate-fade-in">
                              <div className="font-bold mb-1 border-b border-white/10 pb-1 uppercase">{report.type}</div>
                              {report.description}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{report.status}</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400"/>
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => navigate('/relatorio')}>
                        <Eye size={16} className="mr-1.5"/> Visualizar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Baixar PDF" 
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
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
      
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
          Padronização NR ZEN • SST 4.0
        </p>
      </div>
    </Layout>
  );
};

export default Reports;
