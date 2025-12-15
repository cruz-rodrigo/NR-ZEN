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
      {/* Ajustado padding de 20mm para 15mm para ganhar espaço vertical */}
      <div className="print-container mt-16 print:mt-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none p-[15mm] flex flex-col justify-between box-border mx-auto relative">
        
        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Cabeçalho - Compactado */}
          <header className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-end">
            <div>
               <div className="mb-2 scale-90 origin-left">
                  <Logo size="lg" />
               </div>
               <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">
                 Gerenciamento de Riscos
               </div>
            </div>
            <div className="text-right text-xs leading-tight">
               <p className="font-bold text-slate-900 text-sm mb-0.5">Indústrias Metalúrgicas Beta</p>
               <p className="text-slate-600 text-[10px]">CNPJ: 12.345.678/0001-99</p>
               <p className="text-slate-600 text-[10px]">CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
               <div className="mt-1 pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-mono">
                 DOC REF: #IRP-2025-001 • EMISSÃO: {currentDate}
               </div>
            </div>
          </header>

          {/* Título do Relatório - Compactado */}
          <div className="mb-6 text-center bg-slate-50 py-3 rounded-lg border border-slate-100 print:border-slate-200">
             <h1 className="text-xl font-heading font-extrabold text-slate-900 mb-1 uppercase tracking-tight">Avaliação de Riscos Psicossociais</h1>
             <h2 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Anexo ao PGR (Programa de Gerenciamento de Riscos)</h2>
             
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 shadow-sm">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Setor Avaliado:</span>
               <span className="text-xs font-bold text-slate-900">Operação Logística – Turno 1</span>
             </div>
          </div>

          {/* 1. Metodologia */}
          <section className="mb-6 print-break-inside-avoid">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
              <span className="bg-slate-900 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold">1</span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Metodologia e Critérios (NR-01.5.4.4)</h3>
            </div>
            
            <p className="text-[10px] text-justify text-slate-700 leading-relaxed mb-3">
              A presente avaliação visa identificar perigos e avaliar riscos psicossociais relacionados ao trabalho, em estrita conformidade com a <strong>NR-01</strong> e <strong>NR-17 (Ergonomia)</strong>. 
              Utilizou-se o método de levantamento quantitativo validado (Escala NR ZEN), onde a percepção dos trabalhadores é convertida estatisticamente em um Índice de Risco (0 a 100).
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-200 bg-emerald-50 pl-2 py-1.5 pr-2 rounded-md">
                <span className="block font-bold text-emerald-700 text-[10px] mb-0.5">0 - 39 (Risco Baixo)</span>
                <span className="text-[9px] text-slate-600 leading-tight block">Condição aceitável. Monitoramento periódico.</span>
              </div>
              <div className="border border-amber-200 bg-amber-50 pl-2 py-1.5 pr-2 rounded-md">
                <span className="block font-bold text-amber-700 text-[10px] mb-0.5">40 - 69 (Moderado)</span>
                <span className="text-[9px] text-slate-600 leading-tight block">Estado de alerta. Requer plano de ação a médio prazo.</span>
              </div>
              <div className="border border-red-200 bg-red-50 pl-2 py-1.5 pr-2 rounded-md">
                <span className="block font-bold text-red-700 text-[10px] mb-0.5">70 - 100 (Alto)</span>
                <span className="text-[9px] text-slate-600 leading-tight block">Situação crítica. Intervenção imediata requerida.</span>
              </div>
            </div>
          </section>

          {/* 2. Inventário */}
          <section className="mb-6 print-break-inside-avoid">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
              <span className="bg-slate-900 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold">2</span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Inventário de Riscos (Identificação)</h3>
            </div>
            
            <table className="w-full border-collapse text-[10px]">
               <thead className="bg-slate-100 border-y border-slate-300">
                 <tr>
                   <th className="p-2 text-left w-1/3 font-bold text-slate-800 border-r border-slate-200">Fator de Risco (Perigo)</th>
                   <th className="p-2 text-center w-10 font-bold text-slate-800 border-r border-slate-200">Prob.</th>
                   <th className="p-2 text-center w-10 font-bold text-slate-800 border-r border-slate-200">Sev.</th>
                   <th className="p-2 text-center w-20 font-bold text-slate-800 border-r border-slate-200">Nível</th>
                   <th className="p-2 text-left font-bold text-slate-800">Evidência Técnica</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                 {[
                   { name: "Sobrecarga Cognitiva", prob: "3", sev: "2", level: "Moderado", text: "Ritmo intenso e prazos exíguos relatados por 45% da equipe." },
                   { name: "Falta de Autonomia", prob: "1", sev: "1", level: "Baixo", text: "Equipe relata boa liberdade operacional (Fator Protetivo)." },
                   { name: "Suporte Gerencial Insuficiente", prob: "4", sev: "3", level: "Alto", text: "Ausência de feedback estruturado e suporte em crises." },
                   { name: "Conflito Interpessoal", prob: "2", sev: "2", level: "Moderado", text: "Relatos de atritos pontuais na passagem de turno." },
                 ].map((row, i) => (
                   <tr key={i} className="group">
                     <td className="p-2 font-semibold text-slate-700 border-r border-slate-100">{row.name}</td>
                     <td className="p-2 text-center text-slate-600 border-r border-slate-100">{row.prob}</td>
                     <td className="p-2 text-center text-slate-600 border-r border-slate-100">{row.sev}</td>
                     <td className="p-2 text-center border-r border-slate-100">
                       <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-sm border ${
                          row.level === 'Alto' ? 'bg-red-50 border-red-200 text-red-700' : 
                          row.level === 'Moderado' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                          'bg-emerald-50 border-emerald-200 text-emerald-700'
                       }`}>
                         {row.level}
                       </span>
                     </td>
                     <td className="p-2 text-slate-600 italic leading-tight">{row.text}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </section>

          {/* 3. Plano de Ação */}
          <section className="mb-6 print-break-inside-avoid">
             <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
              <span className="bg-slate-900 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold">3</span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Plano de Ação (Medidas de Controle)</h3>
            </div>

             <table className="w-full border-collapse text-[10px] border border-slate-300 rounded-lg overflow-hidden">
               <thead className="bg-slate-50 border-b border-slate-300">
                 <tr>
                   <th className="p-2 text-left font-bold text-slate-800 border-r border-slate-200">O Que (Ação)</th>
                   <th className="p-2 text-left font-bold text-slate-800 border-r border-slate-200">Por Que (Motivo)</th>
                   <th className="p-2 text-left font-bold w-20 text-slate-800 border-r border-slate-200">Responsável</th>
                   <th className="p-2 text-center font-bold w-16 text-slate-800">Prazo</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 text-slate-800 font-medium border-r border-slate-200">Implementar programa de desenvolvimento de liderança (foco em feedback).</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">Mitigar risco alto de suporte gerencial insuficiente.</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">RH / T&D</td>
                    <td className="p-2 text-center text-slate-600 font-mono">Dez/25</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-800 font-medium border-r border-slate-200">Revisão do cronograma de entregas e dimensionamento.</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">Adequar a carga de trabalho à capacidade instalada.</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">Ger. Operações</td>
                    <td className="p-2 text-center text-slate-600 font-mono">Nov/25</td>
                  </tr>
               </tbody>
             </table>
          </section>

          {/* Assinaturas - Adicionado margem superior e break-inside-avoid */}
          <section className="mt-8 print-break-inside-avoid border-t border-slate-200 pt-8">
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                <div className="border-b border-slate-800 w-3/4 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-xs">João Silva</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Engenheiro de Seg. do Trabalho</p>
                <p className="text-[9px] text-slate-400">CREA: 123456/SP</p>
              </div>
              <div className="text-center">
                <div className="border-b border-slate-800 w-3/4 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-xs">Representante Legal</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Indústrias Metalúrgicas Beta</p>
                <p className="text-[9px] text-slate-400">Responsável pela Organização</p>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé Fixo */}
        <footer className="border-t border-slate-200 pt-2 mt-4 flex justify-between items-center text-[8px] text-slate-400 print:absolute print:bottom-[15mm] print:left-[15mm] print:right-[15mm]">
           <div className="flex items-center gap-2">
             <span className="font-bold text-slate-600 uppercase tracking-wider">NR ZEN</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>Tecnologia para Segurança do Trabalho</span>
           </div>
           <div className="flex items-center gap-4">
             <span>Este documento é parte integrante do PGR da organização.</span>
             <span className="font-mono">Página 1/1</span>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default Report;