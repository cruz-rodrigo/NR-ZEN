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
      
      {/* Barra de Controle (Flutuante na Tela) */}
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

      {/* Folha A4 - Design para Impressão */}
      <div className="print-container mt-16 print:mt-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none p-[20mm] flex flex-col justify-between box-border mx-auto relative">
        
        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Cabeçalho */}
          <header className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <div>
               <div className="mb-4 scale-100 origin-left">
                  <Logo size="lg" />
               </div>
               <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                 Gerenciamento de Riscos
               </div>
            </div>
            <div className="text-right text-xs leading-tight">
               <p className="font-bold text-slate-900 text-base mb-1">Indústrias Metalúrgicas Beta</p>
               <p className="text-slate-600">CNPJ: 12.345.678/0001-99</p>
               <p className="text-slate-600">CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
               <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                 DOC REF: #IRP-2025-001<br/>
                 EMISSÃO: {currentDate}
               </div>
            </div>
          </header>

          {/* Título do Relatório */}
          <div className="mb-10 text-center">
             <h1 className="text-2xl font-heading font-extrabold text-slate-900 mb-2 uppercase tracking-tight">Avaliação de Riscos Psicossociais</h1>
             <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-6">Anexo ao PGR (Programa de Gerenciamento de Riscos)</h2>
             
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
               <span className="text-xs font-bold text-slate-500 uppercase">Setor Avaliado:</span>
               <span className="text-sm font-bold text-slate-900">Operação Logística – Turno 1</span>
             </div>
          </div>

          {/* 1. Metodologia */}
          <section className="mb-10 print-break-inside-avoid">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
              <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Metodologia e Critérios (NR-01.5.4.4)</h3>
            </div>
            
            <p className="text-xs text-justify text-slate-700 leading-relaxed mb-6">
              A presente avaliação visa identificar perigos e avaliar riscos psicossociais relacionados ao trabalho, em estrita conformidade com a <strong>NR-01</strong> e <strong>NR-17 (Ergonomia)</strong>. 
              Utilizou-se o método de levantamento quantitativo validado (Escala NR ZEN), onde a percepção dos trabalhadores é convertida estatisticamente em um Índice de Risco (0 a 100).
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="border-l-4 border-emerald-500 bg-emerald-50/50 pl-3 py-2 pr-2">
                <span className="block font-bold text-emerald-700 text-xs mb-1">0 - 39 (Risco Baixo)</span>
                <span className="text-[10px] text-slate-600 leading-tight block">Condição aceitável. Monitoramento periódico.</span>
              </div>
              <div className="border-l-4 border-amber-500 bg-amber-50/50 pl-3 py-2 pr-2">
                <span className="block font-bold text-amber-700 text-xs mb-1">40 - 69 (Moderado)</span>
                <span className="text-[10px] text-slate-600 leading-tight block">Estado de alerta. Requer plano de ação a médio prazo.</span>
              </div>
              <div className="border-l-4 border-red-500 bg-red-50/50 pl-3 py-2 pr-2">
                <span className="block font-bold text-red-700 text-xs mb-1">70 - 100 (Alto)</span>
                <span className="text-[10px] text-slate-600 leading-tight block">Situação crítica. Intervenção imediata requerida.</span>
              </div>
            </div>
          </section>

          {/* 2. Inventário */}
          <section className="mb-10 print-break-inside-avoid">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
              <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Inventário de Riscos (Identificação)</h3>
            </div>
            
            <table className="w-full border-collapse text-xs">
               <thead className="bg-slate-100 border-y border-slate-300">
                 <tr>
                   <th className="p-3 text-left w-1/3 font-bold text-slate-800">Fator de Risco (Perigo)</th>
                   <th className="p-3 text-center w-16 font-bold text-slate-800">Prob.</th>
                   <th className="p-3 text-center w-16 font-bold text-slate-800">Sev.</th>
                   <th className="p-3 text-center w-24 font-bold text-slate-800">Nível</th>
                   <th className="p-3 text-left font-bold text-slate-800">Evidência Técnica</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 {[
                   { name: "Sobrecarga Cognitiva", prob: "3", sev: "2", level: "Moderado", text: "Ritmo intenso e prazos exíguos relatados por 45% da equipe." },
                   { name: "Falta de Autonomia", prob: "1", sev: "1", level: "Baixo", text: "Equipe relata boa liberdade operacional (Fator Protetivo)." },
                   { name: "Suporte Gerencial Insuficiente", prob: "4", sev: "3", level: "Alto", text: "Ausência de feedback estruturado e suporte em crises." },
                   { name: "Conflito Interpessoal", prob: "2", sev: "2", level: "Moderado", text: "Relatos de atritos pontuais na passagem de turno." },
                 ].map((row, i) => (
                   <tr key={i} className="group">
                     <td className="p-3 font-semibold text-slate-700">{row.name}</td>
                     <td className="p-3 text-center text-slate-600">{row.prob}</td>
                     <td className="p-3 text-center text-slate-600">{row.sev}</td>
                     <td className="p-3 text-center">
                       <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full border ${
                          row.level === 'Alto' ? 'bg-red-50 border-red-200 text-red-700' : 
                          row.level === 'Moderado' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                          'bg-emerald-50 border-emerald-200 text-emerald-700'
                       }`}>
                         {row.level}
                       </span>
                     </td>
                     <td className="p-3 text-slate-600 italic">{row.text}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </section>

          {/* 3. Plano de Ação */}
          <section className="mb-10 print-break-inside-avoid">
             <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
              <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Plano de Ação (Medidas de Controle)</h3>
            </div>

             <table className="w-full border-collapse text-xs border border-slate-200 rounded-lg overflow-hidden">
               <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                   <th className="p-3 text-left font-bold text-slate-800 border-r border-slate-200">O Que (Ação)</th>
                   <th className="p-3 text-left font-bold text-slate-800 border-r border-slate-200">Por Que (Motivo)</th>
                   <th className="p-3 text-left font-bold w-24 text-slate-800 border-r border-slate-200">Responsável</th>
                   <th className="p-3 text-center font-bold w-20 text-slate-800">Prazo</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 text-slate-800 font-medium border-r border-slate-200">Implementar programa de desenvolvimento de liderança (foco em feedback).</td>
                    <td className="p-3 text-slate-600 border-r border-slate-200">Mitigar risco alto de suporte gerencial insuficiente.</td>
                    <td className="p-3 text-slate-600 border-r border-slate-200">RH / T&D</td>
                    <td className="p-3 text-center text-slate-600 font-mono">Dez/25</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-800 font-medium border-r border-slate-200">Revisão do cronograma de entregas e dimensionamento.</td>
                    <td className="p-3 text-slate-600 border-r border-slate-200">Adequar a carga de trabalho à capacidade instalada.</td>
                    <td className="p-3 text-slate-600 border-r border-slate-200">Ger. Operações</td>
                    <td className="p-3 text-center text-slate-600 font-mono">Nov/25</td>
                  </tr>
               </tbody>
             </table>
          </section>

          {/* Assinaturas */}
          <section className="mt-16 print-break-inside-avoid">
            <div className="grid grid-cols-2 gap-16">
              <div className="text-center">
                <div className="border-b border-slate-400 w-3/4 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-sm">João Silva</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Engenheiro de Seg. do Trabalho</p>
                <p className="text-[10px] text-slate-400">CREA: 123456/SP</p>
              </div>
              <div className="text-center">
                <div className="border-b border-slate-400 w-3/4 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-sm">Representante Legal</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Indústrias Metalúrgicas Beta</p>
                <p className="text-[10px] text-slate-400">Responsável pela Organização</p>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé Fixo na Impressão */}
        <footer className="border-t border-slate-200 pt-3 mt-8 flex justify-between items-center text-[9px] text-slate-400">
           <div className="flex items-center gap-2">
             <span className="font-bold text-slate-600 uppercase tracking-wider">NR ZEN</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>Plataforma de Inteligência em SST</span>
           </div>
           <div className="flex items-center gap-4">
             <span>Este documento é parte integrante do PGR da organização.</span>
             <span className="font-mono">Página 1 de 1</span>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default Report;