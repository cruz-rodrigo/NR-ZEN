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
    <div className="bg-slate-600 min-h-screen p-8 print:p-0 print:bg-white font-sans text-slate-900 overflow-auto flex justify-center">
      
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

      {/* Folha A4 */}
      <div className="mt-20 print:mt-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none flex flex-col relative mx-auto print:w-full print:h-full box-border p-[15mm] print:p-[15mm]">
        
        {/* HEADER */}
        <header className="border-b-[3px] border-slate-900 pb-4 mb-8">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <div className="mb-3 transform scale-110 origin-left">
                        <Logo size="lg" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Gerenciamento de Riscos
                    </span>
                </div>
                
                <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Indústrias Metalúrgicas Beta</h2>
                    <p className="text-xs text-slate-500 mt-1">CNPJ: 12.345.678/0001-99</p>
                    <p className="text-xs text-slate-500">CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">
                        DOC REF: #IRP-2025-001 • EMISSÃO: {currentDate}
                    </div>
                </div>
            </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1">
            
            <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-2">
                    Avaliação de Riscos Psicossociais
                </h1>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">
                    Anexo ao PGR (Programa de Gerenciamento de Riscos)
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Setor Avaliado:</span>
                    <span className="text-sm font-bold text-slate-900">Operação Logística – Turno 1</span>
                </div>
            </div>

            {/* 1. Metodologia */}
            <section className="mb-8 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-3 border-b border-slate-200 pb-2">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold">1</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Metodologia e Critérios (NR-01.5.4.4)</h3>
                </div>
                <p className="text-xs text-justify text-slate-600 leading-relaxed mb-4">
                    A presente avaliação visa identificar perigos e avaliar riscos psicossociais relacionados ao trabalho, em estrita conformidade com a <strong>NR-01</strong> e <strong>NR-17 (Ergonomia)</strong>. Utilizou-se o método de levantamento quantitativo validado (Escala NR ZEN), onde a percepção dos trabalhadores é convertida estatisticamente em um Índice de Risco (0 a 100).
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                        <span className="block font-bold text-emerald-700 text-xs mb-1">0 - 39 (Risco Baixo)</span>
                        <span className="text-[10px] text-slate-600 leading-tight block">Condição aceitável. Monitoramento periódico.</span>
                    </div>
                    <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                        <span className="block font-bold text-amber-700 text-xs mb-1">40 - 69 (Moderado)</span>
                        <span className="text-[10px] text-slate-600 leading-tight block">Estado de alerta. Requer plano de ação a médio prazo.</span>
                    </div>
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50/50">
                        <span className="block font-bold text-red-700 text-xs mb-1">70 - 100 (Alto)</span>
                        <span className="text-[10px] text-slate-600 leading-tight block">Situação crítica. Intervenção imediata requerida.</span>
                    </div>
                </div>
            </section>

            {/* 2. Inventário */}
            <section className="mb-8 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-3 border-b border-slate-200 pb-2">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold">2</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Inventário de Riscos (Identificação)</h3>
                </div>
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-slate-100 border-y border-slate-300">
                            <th className="p-2 text-left font-bold text-slate-800 border-r border-slate-200 w-1/3">Fator de Risco</th>
                            <th className="p-2 text-center font-bold text-slate-800 border-r border-slate-200 w-12">Prob.</th>
                            <th className="p-2 text-center font-bold text-slate-800 border-r border-slate-200 w-12">Sev.</th>
                            <th className="p-2 text-center font-bold text-slate-800 border-r border-slate-200 w-24">Nível</th>
                            <th className="p-2 text-left font-bold text-slate-800">Evidência Técnica</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                        {[
                            { name: "Sobrecarga Cognitiva", prob: 3, sev: 2, level: "MODERADO", desc: "Ritmo intenso e prazos exíguos relatados por 45% da equipe." },
                            { name: "Falta de Autonomia", prob: 1, sev: 1, level: "BAIXO", desc: "Equipe relata boa liberdade operacional (Fator Protetivo)." },
                            { name: "Suporte Gerencial Insuficiente", prob: 4, sev: 3, level: "ALTO", desc: "Ausência de feedback estruturado e suporte em crises." },
                            { name: "Conflito Interpessoal", prob: 2, sev: 2, level: "MODERADO", desc: "Relatos de atritos pontuais na passagem de turno." },
                        ].map((row, i) => (
                            <tr key={i}>
                                <td className="p-2 font-semibold text-slate-700 border-r border-slate-100">{row.name}</td>
                                <td className="p-2 text-center text-slate-600 border-r border-slate-100">{row.prob}</td>
                                <td className="p-2 text-center text-slate-600 border-r border-slate-100">{row.sev}</td>
                                <td className="p-2 text-center border-r border-slate-100">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                        row.level === 'ALTO' ? 'bg-red-50 text-red-700 border-red-200' :
                                        row.level === 'MODERADO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>{row.level}</span>
                                </td>
                                <td className="p-2 text-slate-600 italic">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* 3. Plano de Ação */}
            <section className="mb-10 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-3 border-b border-slate-200 pb-2">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold">3</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Plano de Ação (Medidas de Controle)</h3>
                </div>
                <table className="w-full border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-3 text-left font-bold text-slate-800 border-r border-slate-200">O Que (Ação)</th>
                            <th className="p-3 text-left font-bold text-slate-800 border-r border-slate-200">Por Que (Motivo)</th>
                            <th className="p-3 text-left font-bold text-slate-800 border-r border-slate-200 w-24">Responsável</th>
                            <th className="p-3 text-center font-bold text-slate-800 w-16">Prazo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        <tr>
                            <td className="p-3 font-medium text-slate-800 border-r border-slate-100">Implementar programa de desenvolvimento de liderança (foco em feedback).</td>
                            <td className="p-3 text-slate-600 border-r border-slate-100">Mitigar risco alto de suporte gerencial insuficiente.</td>
                            <td className="p-3 text-slate-600 border-r border-slate-100">RH / T&D</td>
                            <td className="p-3 text-center font-mono text-slate-500">Dez/25</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-medium text-slate-800 border-r border-slate-100">Revisão do cronograma de entregas e dimensionamento.</td>
                            <td className="p-3 text-slate-600 border-r border-slate-100">Adequar a carga de trabalho à capacidade instalada.</td>
                            <td className="p-3 text-slate-600 border-r border-slate-100">Ger. Operações</td>
                            <td className="p-3 text-center font-mono text-slate-500">Nov/25</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Assinaturas */}
            <section className="mt-12 mb-8 print:break-inside-avoid">
                <div className="flex justify-between gap-12">
                    <div className="flex-1 text-center">
                        <div className="border-b border-slate-800 h-10 mb-2 w-3/4 mx-auto"></div>
                        <p className="font-bold text-slate-900 text-sm">João Silva</p>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Engenheiro de Seg. do Trabalho</p>
                        <p className="text-[10px] text-slate-400">CREA: 123456/SP</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border-b border-slate-800 h-10 mb-2 w-3/4 mx-auto"></div>
                        <p className="font-bold text-slate-900 text-sm">Representante Legal</p>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Indústrias Metalúrgicas Beta</p>
                        <p className="text-[10px] text-slate-400">Responsável pela Organização</p>
                    </div>
                </div>
            </section>

        </main>

        {/* FOOTER */}
        <footer className="mt-auto pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="font-black text-slate-700 tracking-tight">NR ZEN</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Tecnologia para Segurança do Trabalho</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                    <span>Este documento é parte integrante do PGR da organização.</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">Página 1/1</span>
                </div>
            </div>
        </footer>

      </div>
    </div>
  );
};

export default Report;