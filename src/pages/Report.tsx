import React from 'react';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import { FileText, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Report: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/app/reports');
    }
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="bg-slate-600 min-h-screen p-4 md:p-8 print:p-0 print:bg-white font-sans text-slate-900 overflow-auto flex justify-center">
      
      {/* Barra de Controle */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur shadow-md z-50 p-4 print:hidden no-print transition-all">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-600"/> 
              Relatório Técnico PGR/GRO
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} size="sm">
              <ArrowLeft size={16} className="mr-2"/> Voltar
            </Button>
            <Button variant="primary" onClick={() => window.print()} size="sm" className="shadow-lg shadow-blue-600/20">
              <Printer size={16} className="mr-2"/> Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Folha A4 - Otimizada para Caber em 1 Página */}
      <div className="mt-20 print:mt-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none flex flex-col relative mx-auto box-border p-[12mm] print:p-[12mm]">
        
        {/* HEADER COM CLASSE print-header PARA FORÇAR EXIBIÇÃO */}
        <header className="border-b-2 border-slate-900 pb-2 mb-4 print-header">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <div className="mb-2 scale-90 origin-left -ml-1">
                        <Logo size="lg" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em]">
                        Gerenciamento de Riscos
                    </span>
                </div>
                
                <div className="text-right">
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">Indústrias Metalúrgicas Beta</h2>
                    <div className="text-[9px] text-slate-500 mt-0.5 space-y-0.5">
                        <p>CNPJ: 12.345.678/0001-99</p>
                        <p>CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
                    </div>
                    <div className="mt-1 text-[8px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded inline-block border border-slate-100">
                        REF: #IRP-2025-001 • {currentDate}
                    </div>
                </div>
            </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1">
            
            {/* Title Block */}
            <div className="text-center mb-5 bg-slate-50 py-3 rounded border border-slate-100 print:border-none">
                <h1 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mb-1">
                    Avaliação de Riscos Psicossociais
                </h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">
                    Anexo ao PGR (Programa de Gerenciamento de Riscos)
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Setor Avaliado:</span>
                    <span className="text-[10px] font-bold text-slate-900">Operação Logística – Turno 1</span>
                </div>
            </div>

            {/* 1. Metodologia */}
            <section className="mb-5 print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
                    <span className="bg-slate-900 text-white w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold">1</span>
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Metodologia (NR-01.5.4.4)</h3>
                </div>
                <p className="text-[9px] text-justify text-slate-600 leading-relaxed mb-3">
                    Avaliação quantitativa de perigos psicossociais conforme <strong>NR-01</strong> e <strong>NR-17</strong>. Método: Escala NR ZEN (Índice 0-100).
                </p>
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded border border-emerald-200 bg-emerald-50/50">
                        <span className="block font-bold text-emerald-700 text-[10px] mb-0.5">0 - 39 (Risco Baixo)</span>
                        <span className="text-[8px] text-slate-600 leading-tight block">Monitoramento periódico.</span>
                    </div>
                    <div className="p-2 rounded border border-amber-200 bg-amber-50/50">
                        <span className="block font-bold text-amber-700 text-[10px] mb-0.5">40 - 69 (Moderado)</span>
                        <span className="text-[8px] text-slate-600 leading-tight block">Requer plano de ação.</span>
                    </div>
                    <div className="p-2 rounded border border-red-200 bg-red-50/50">
                        <span className="block font-bold text-red-700 text-[10px] mb-0.5">70 - 100 (Alto)</span>
                        <span className="text-[8px] text-slate-600 leading-tight block">Intervenção imediata.</span>
                    </div>
                </div>
            </section>

            {/* 2. Inventário */}
            <section className="mb-5 print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
                    <span className="bg-slate-900 text-white w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold">2</span>
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Inventário de Riscos</h3>
                </div>
                <table className="w-full border-collapse text-[9px]">
                    <thead>
                        <tr className="bg-slate-100 border-y border-slate-300">
                            <th className="py-1.5 px-2 text-left font-bold text-slate-800 border-r border-slate-200 w-[35%]">Fator de Risco</th>
                            <th className="py-1.5 px-2 text-center font-bold text-slate-800 border-r border-slate-200 w-[8%]">Prob.</th>
                            <th className="py-1.5 px-2 text-center font-bold text-slate-800 border-r border-slate-200 w-[8%]">Sev.</th>
                            <th className="py-1.5 px-2 text-center font-bold text-slate-800 border-r border-slate-200 w-[15%]">Nível</th>
                            <th className="py-1.5 px-2 text-left font-bold text-slate-800">Evidência Técnica</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                        {[
                            { name: "Sobrecarga Cognitiva", prob: 3, sev: 2, level: "MODERADO", desc: "Ritmo intenso e prazos exíguos (45% da equipe)." },
                            { name: "Falta de Autonomia", prob: 1, sev: 1, level: "BAIXO", desc: "Equipe relata boa liberdade operacional." },
                            { name: "Suporte Gerencial Insuficiente", prob: 4, sev: 3, level: "ALTO", desc: "Ausência de feedback estruturado e suporte em crises." },
                            { name: "Conflito Interpessoal", prob: 2, sev: 2, level: "MODERADO", desc: "Relatos de atritos pontuais na passagem de turno." },
                        ].map((row, i) => (
                            <tr key={i} className="even:bg-slate-50/30">
                                <td className="py-1.5 px-2 font-semibold text-slate-700 border-r border-slate-100">{row.name}</td>
                                <td className="py-1.5 px-2 text-center text-slate-600 border-r border-slate-100">{row.prob}</td>
                                <td className="py-1.5 px-2 text-center text-slate-600 border-r border-slate-100">{row.sev}</td>
                                <td className="py-1.5 px-2 text-center border-r border-slate-100">
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                                        row.level === 'ALTO' ? 'bg-red-50 text-red-700 border-red-200' :
                                        row.level === 'MODERADO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>{row.level}</span>
                                </td>
                                <td className="py-1.5 px-2 text-slate-600 italic">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* 3. Plano de Ação */}
            <section className="mb-6 print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
                    <span className="bg-slate-900 text-white w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold">3</span>
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Plano de Ação (Controle)</h3>
                </div>
                <table className="w-full border-collapse text-[9px] border border-slate-200 rounded overflow-hidden">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="py-1.5 px-2 text-left font-bold text-slate-800 border-r border-slate-200">Ação Recomendada</th>
                            <th className="py-1.5 px-2 text-left font-bold text-slate-800 border-r border-slate-200">Justificativa</th>
                            <th className="py-1.5 px-2 text-left font-bold text-slate-800 border-r border-slate-200 w-[15%]">Responsável</th>
                            <th className="py-1.5 px-2 text-center font-bold text-slate-800 w-[10%]">Prazo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        <tr>
                            <td className="py-2 px-2 font-medium text-slate-800 border-r border-slate-100">Implementar programa de desenvolvimento de liderança (foco feedback).</td>
                            <td className="py-2 px-2 text-slate-600 border-r border-slate-100">Mitigar risco alto de suporte gerencial.</td>
                            <td className="py-2 px-2 text-slate-600 border-r border-slate-100">RH / T&D</td>
                            <td className="py-2 px-2 text-center font-mono text-slate-500">Dez/25</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-2 font-medium text-slate-800 border-r border-slate-100">Revisão do cronograma de entregas e dimensionamento.</td>
                            <td className="py-2 px-2 text-slate-600 border-r border-slate-100">Adequar carga de trabalho à capacidade.</td>
                            <td className="py-2 px-2 text-slate-600 border-r border-slate-100">Operações</td>
                            <td className="py-2 px-2 text-center font-mono text-slate-500">Nov/25</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Assinaturas */}
            <section className="mt-8 mb-4 print:break-inside-avoid">
                <div className="flex justify-between gap-12 px-8">
                    <div className="flex-1 text-center">
                        <div className="border-b border-slate-800 h-8 mb-2 w-full mx-auto"></div>
                        <p className="font-bold text-slate-900 text-[10px]">João Silva</p>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wide">Eng. Segurança do Trabalho</p>
                        <p className="text-[8px] text-slate-400">CREA: 123456/SP</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border-b border-slate-800 h-8 mb-2 w-full mx-auto"></div>
                        <p className="font-bold text-slate-900 text-[10px]">Representante Legal</p>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wide">Indústrias Metalúrgicas Beta</p>
                        <p className="text-[8px] text-slate-400">Responsável pela Organização</p>
                    </div>
                </div>
            </section>

        </main>

        {/* FOOTER COM CLASSE print-footer PARA FORÇAR EXIBIÇÃO */}
        <footer className="mt-auto pt-2 border-t border-slate-200 print-footer">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-black text-slate-700 text-[9px] tracking-tight">NR ZEN</span>
                    <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wide">Tecnologia para Segurança do Trabalho</span>
                </div>
                <div className="flex items-center gap-3 text-[8px] text-slate-400 font-medium">
                    <span>Documento parte integrante do PGR.</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Página 1/1</span>
                </div>
            </div>
        </footer>

      </div>
    </div>
  );
};

export default Report;