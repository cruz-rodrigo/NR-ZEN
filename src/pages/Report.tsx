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
      navigate('/app');
    }
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="bg-slate-500 min-h-screen p-8 print:p-0 print:bg-white font-sans text-slate-900 overflow-auto flex justify-center">
      
      {/* Barra de Controle (Flutuante para não atrapalhar visualização) */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur shadow-md z-50 p-4 print:hidden no-print">
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

      {/* Folha A4 - Simulada na tela, Real na impressão */}
      <div className="print-container mt-16 print:mt-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none p-[15mm] flex flex-col justify-between">
        
        {/* Conteúdo Principal */}
        <div>
          {/* Cabeçalho do Documento */}
          <header className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end print-header">
            <div>
               <div className="mb-4 scale-90 origin-left">
                  <Logo size="lg" />
               </div>
               <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Gerenciamento de Riscos Ocupacionais</div>
            </div>
            <div className="text-right text-xs leading-tight">
               <p className="font-bold text-slate-900 text-base">Indústrias Metalúrgicas Beta</p>
               <p className="text-slate-600">CNPJ: 12.345.678/0001-99</p>
               <p className="text-slate-600">CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
               <div className="mt-2 text-[10px] text-slate-400">
                 Ref: Inventário de Riscos Psicossociais<br/>
                 Emissão: {currentDate}
               </div>
            </div>
          </header>

          {/* Título */}
          <div className="mb-8 text-center bg-slate-50 py-4 border border-slate-100 rounded-lg print:border-slate-200 print:bg-slate-50">
             <h1 className="text-xl font-heading font-bold text-slate-900 mb-1 uppercase">Relatório de Avaliação Psicossocial</h1>
             <h2 className="text-sm text-slate-600">Anexo ao Programa de Gerenciamento de Riscos (PGR)</h2>
             <div className="mt-2 inline-block">
               <span className="text-xs font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded border border-blue-100 print:text-blue-800 print:bg-blue-50 print:border-blue-100">
                 Setor Avaliado: <strong>Operação Logística – Turno 1</strong>
               </span>
             </div>
          </div>

          {/* 1. Metodologia */}
          <section className="mb-8 print-break-inside-avoid">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 mb-3 pb-1">
              1. Metodologia e Critérios (NR-01.5.4.4)
            </h3>
            <p className="text-xs text-justify text-slate-700 leading-relaxed mb-4">
              Avaliação de riscos psicossociais conforme <strong>NR-01</strong> e <strong>NR-17</strong>. 
              Método: Escala NR ZEN (Quantitativo). Índice de Risco (0 a 100).
            </p>
            
            <div className="grid grid-cols-3 gap-3 text-[10px] text-center">
              <div className="border border-emerald-200 bg-emerald-50 p-2 rounded print:bg-emerald-50 print:border-emerald-200">
                <span className="block font-bold text-emerald-700 mb-1">0 - 39 (Baixo)</span>
                <span>Monitoramento.</span>
              </div>
              <div className="border border-amber-200 bg-amber-50 p-2 rounded print:bg-amber-50 print:border-amber-200">
                <span className="block font-bold text-amber-700 mb-1">40 - 69 (Moderado)</span>
                <span>Requer Plano de Ação.</span>
              </div>
              <div className="border border-red-200 bg-red-50 p-2 rounded print:bg-red-50 print:border-red-200">
                <span className="block font-bold text-red-700 mb-1">70 - 100 (Alto)</span>
                <span>Intervenção Imediata.</span>
              </div>
            </div>
          </section>

          {/* 2. Inventário */}
          <section className="mb-8 print-break-inside-avoid">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 mb-3 pb-1">
              2. Inventário de Riscos (Identificação de Perigos)
            </h3>
            
            <table className="w-full border-collapse text-xs border border-slate-300">
               <thead className="bg-slate-100 print:bg-slate-100">
                 <tr>
                   <th className="border border-slate-300 p-1.5 text-left w-1/3 text-slate-800">Fator de Risco</th>
                   <th className="border border-slate-300 p-1.5 text-center w-16 text-slate-800">Prob.</th>
                   <th className="border border-slate-300 p-1.5 text-center w-16 text-slate-800">Sev.</th>
                   <th className="border border-slate-300 p-1.5 text-center w-20 text-slate-800">Nível</th>
                   <th className="border border-slate-300 p-1.5 text-left text-slate-800">Evidência</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   { name: "Sobrecarga Cognitiva", prob: "3", sev: "2", level: "Moderado", text: "Ritmo intenso e prazos exíguos (45% da equipe)." },
                   { name: "Falta de Autonomia", prob: "1", sev: "1", level: "Baixo", text: "Boa liberdade operacional (Fator Protetivo)." },
                   { name: "Suporte Gerencial Insuficiente", prob: "4", sev: "3", level: "Alto", text: "Ausência de feedback em crises." },
                   { name: "Conflito Interpessoal", prob: "2", sev: "2", level: "Moderado", text: "Atritos pontuais na troca de turno." },
                 ].map((row, i) => (
                   <tr key={i}>
                     <td className="border border-slate-300 p-1.5 font-medium">{row.name}</td>
                     <td className="border border-slate-300 p-1.5 text-center">{row.prob}</td>
                     <td className="border border-slate-300 p-1.5 text-center">{row.sev}</td>
                     <td className="border border-slate-300 p-1.5 text-center">
                       <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          row.level === 'Alto' ? 'bg-red-50 border-red-200 text-red-700 print:bg-red-50' : 
                          row.level === 'Moderado' ? 'bg-amber-50 border-amber-200 text-amber-700 print:bg-amber-50' : 
                          'bg-emerald-50 border-emerald-200 text-emerald-700 print:bg-emerald-50'
                       }`}>
                         {row.level}
                       </span>
                     </td>
                     <td className="border border-slate-300 p-1.5 text-[10px] text-slate-600">{row.text}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </section>

          {/* 3. Plano de Ação */}
          <section className="mb-10 print-break-inside-avoid">
             <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 mb-3 pb-1">
              3. Plano de Ação (Prevenção)
            </h3>
             <table className="w-full border-collapse text-xs border border-slate-300">
               <thead className="bg-slate-100 print:bg-slate-100">
                 <tr>
                   <th className="border border-slate-300 p-1.5 text-left font-semibold text-slate-800">Ação</th>
                   <th className="border border-slate-300 p-1.5 text-left font-semibold text-slate-800">Motivo</th>
                   <th className="border border-slate-300 p-1.5 text-left font-semibold w-20 text-slate-800">Resp.</th>
                   <th className="border border-slate-300 p-1.5 text-center font-semibold w-16 text-slate-800">Prazo</th>
                 </tr>
               </thead>
               <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-slate-800">Programa de desenvolvimento de liderança (feedback).</td>
                    <td className="border border-slate-300 p-1.5 text-slate-600">Mitigar risco de suporte insuficiente.</td>
                    <td className="border border-slate-300 p-1.5 text-slate-600">RH / T&D</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-600">Dez/25</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-slate-800">Revisão do cronograma de entregas.</td>
                    <td className="border border-slate-300 p-1.5 text-slate-600">Adequar carga de trabalho.</td>
                    <td className="border border-slate-300 p-1.5 text-slate-600">Operações</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-600">Nov/25</td>
                  </tr>
               </tbody>
             </table>
          </section>

          {/* Assinaturas */}
          <section className="mt-12 print-break-inside-avoid">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-b border-slate-400 w-2/3 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-xs">João Silva</p>
                <p className="text-[10px] text-slate-500">Engenheiro de Seg. do Trabalho</p>
                <p className="text-[10px] text-slate-500">CREA: 123456/SP</p>
              </div>
              <div className="text-center">
                <div className="border-b border-slate-400 w-2/3 mx-auto h-8 mb-2"></div>
                <p className="font-bold text-slate-900 text-xs">Representante Legal</p>
                <p className="text-[10px] text-slate-500">Indústrias Metalúrgicas Beta</p>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé fixo no final da folha */}
        <footer className="border-t border-slate-200 pt-2 flex justify-between items-center text-[9px] text-slate-400 mt-auto">
           <div className="flex items-center gap-2">
             <span className="font-bold text-slate-500">NR ZEN</span> - Tecnologia para SST
           </div>
           <span>Documento parte integrante do PGR.</span>
           <span>Página 1 de 1</span>
        </footer>

      </div>
    </div>
  );
};

export default Report;