
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
    { 
      id: 3, 
      company: "Transportadora Veloz", 
      sector: "Motoristas Frota Pesada", 
      date: "01/10/2025", 
      status: "Concluído", 
      type: "PGR Anexo II",
      icon: <LayoutList size={18} className="text-blue-600" />,
      tag: "Final",
      description: "INVENTÁRIO COMPLETO: Documento oficial para o GRO. Contém Matriz de Risco e Plano de Ação conforme NR-01."
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
          <p className="text-slate-500 mt-1">Histórico de documentos técnicos gerados.</p>
        </div>
        <div className="bg-slate-900 text-white rounded-xl px-5 py-4 flex items-center gap-4 text-xs shadow-2xl border border-slate-700 max-w-md">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <HelpCircle size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-blue-400 mb-1 uppercase tracking-tight">Qual a diferença?</p>
            <p className="opacity-70 leading-relaxed text-[11px]">
              O <b>PGR II</b> é o documento final legal. A <b>Preliminar</b> é sua ferramenta de triagem para decidir onde focar o plano de ação.
            </p>
          </div>
        </div>
      </header>

      {/* pb-48 garante que o tooltip da última linha tenha espaço para abrir para baixo */}
      <Card padding="p-0 pb-48">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Documento</th>
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
                      <div className="relative">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-800 text-sm">{report.type}</p>
                          
                          {/* TOOLTIP FIX: Agora abre para baixo (top-full) e tem Z-INDEX alto */}
                          <div className="group/info relative inline-block">
                            <Info size={14} className="text-slate-300 cursor-help hover:text-blue-500 transition-colors" />
                            <div className="absolute top-full left-0 mt-3 hidden group-hover/info:block w-72 p-4 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-[9999] leading-relaxed border border-white/10 animate-fade-in">
                              <div className="font-bold mb-1.5 text-blue-400 uppercase tracking-tighter border-b border-white/10 pb-1.5 flex justify-between">
                                Finalidade Técnica
                                <span className="bg-white/10 px-1.5 rounded text-[9px]">{report.tag}</span>
                              </div>
                              {report.description}
                              {/* Seta do tooltip apontando para CIMA */}
                              <div className="absolute bottom-full left-1 border-8 border-transparent border-b-slate-900"></div>
                            </div>
                          </div>
                        </div>
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

      <div className="mt-12 text-center border-t border-slate-100 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Padrão Normativo NR-01 • NR-17 • ISO 45003
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
