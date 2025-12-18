
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
      description: "DOCUMENTO COMPLETO: Relatório consolidado com Inventário de Riscos (Matriz 3x3/4x4) e Plano de Ação estruturado para o PGR."
    },
    { 
      id: 2, 
      company: "Indústrias Metalúrgicas Beta", 
      sector: "Administrativo", 
      date: "05/10/2025", 
      status: "Em Análise", 
      type: "Preliminar",
      icon: <ClipboardCheck size={18} className="text-amber-600" />,
      description: "TRIAGEM (NR-01.5.4.4.1): Levantamento inicial de perigos psicossociais para triagem de campo e conformidade rápida."
    },
    { 
      id: 3, 
      company: "Transportadora Veloz", 
      sector: "Motoristas Frota Pesada", 
      date: "01/10/2025", 
      status: "Concluído", 
      type: "PGR Anexo II",
      icon: <LayoutList size={18} className="text-blue-600" />,
      description: "DOCUMENTO COMPLETO: Relatório consolidado com Inventário de Riscos (Matriz 3x3/4x4) e Plano de Ação estruturado para o PGR."
    },
  ];

  const handleDownload = (id: number) => {
    navigate('/relatorio?download=true');
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500 mt-1">Histórico de laudos e avaliações geradas.</p>
        </div>
        <div className="bg-slate-800 text-white rounded-lg px-4 py-3 flex items-center gap-3 text-xs shadow-lg border border-slate-700">
          <HelpCircle size={18} className="text-blue-400" />
          <div>
            <p className="font-bold">Guia de Documentos:</p>
            <p className="opacity-80">Use <b>PGR II</b> para entregas finais e <b>Preliminar</b> para auditorias de campo.</p>
          </div>
        </div>
      </header>

      {/* PB-40 garante que o tooltip do último item também tenha espaço para abrir para baixo */}
      <Card padding="p-0 pb-40">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${report.type === 'Preliminar' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                        {report.icon}
                      </div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-800 text-sm">{report.type}</p>
                          
                          {/* TOOLTIP FIX: Agora abre para baixo (top-full) para nunca ser cortado no topo */}
                          <div className="group/info relative inline-block">
                            <Info size={14} className="text-slate-300 cursor-help hover:text-blue-500 transition-colors" />
                            <div className="absolute top-full left-0 mt-2 hidden group-hover/info:block w-72 p-4 bg-slate-900 text-white text-[11px] rounded-lg shadow-2xl z-[999] leading-relaxed border border-slate-700 animate-fade-in">
                              <div className="font-bold mb-1.5 text-blue-400 uppercase tracking-tighter border-b border-white/10 pb-1">
                                Especificação Técnica
                              </div>
                              {report.description}
                              {/* Seta do tooltip apontando para CIMA */}
                              <div className="absolute bottom-full left-1 border-8 border-transparent border-b-slate-900"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{report.status}</p>
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
      
      <div className="mt-8 text-center border-t border-slate-100 pt-6">
        <p className="text-[10px] text-slate-300 uppercase font-black tracking-[0.3em]">
          Padronização NR ZEN • Tecnologia para Consultorias
        </p>
      </div>
    </Layout>
  );
};

export default Reports;
