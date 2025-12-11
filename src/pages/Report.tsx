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
    <div className="bg-slate-200 min-h-screen p-8 print:p-0 print:bg-white font-sans text-slate-900 overflow-auto">
      
      {/* Barra de Controle (Não sai na impressão) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden animate-fade-in-down no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-blue-600"/> 
            Relatório Técnico PGR/GRO
          </h1>
          <p className="text-sm text-slate-500">Visualize o documento abaixo ou utilize a função de impressão.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <Button 
            variant="primary"
            onClick={() => window.print()}
            className="flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Printer size={18} />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Folha A4 */}
      <div className="print-container max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl print:shadow-none p-[20mm] relative overflow-hidden">
        
        {/* Cabeçalho */}
        <header className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
          <div>
             <div className="mb-4 scale-90 origin-left">
                <Logo size="lg" />
             </div>
             <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Gerenciamento de Riscos Ocupacionais</div>
          </div>
          <div className="text-right text-sm leading-tight">
             <p className="font-bold text-slate-900 text-lg">Indústrias Metalúrgicas Beta</p>
             <p className="text-slate-600">CNPJ: 12.345.678/0001-99</p>
             <p className="text-slate-600">CNAE: 25.39-0 - Obras de caldeiraria pesada</p>
             <div className="mt-3 text-xs text-slate-400">
               Ref: Inventário de Riscos Psicossociais<br/>
               Emissão: {currentDate}
             </div>
          </div>
        </header>

        {/* Título do Relatório */}
        <div className="mb-10 text-center bg-slate-50 py-4 border border-slate-100 rounded-lg print:border print:border-slate-200 print:bg-slate-50">
           <h1 className="text-2xl font-heading font-bold text-slate-900 mb-1 uppercase">Relatório de Avaliação Psicossocial</h1>
           <h2 className="text-lg text-slate-600">Anexo ao Programa de Gerenciamento de Riscos (PGR)</h2>
           <div className="mt-2 inline-block">
             <span className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded border border-blue-100 print:text-blue-800 print:bg-blue-50 print:border-blue-100">
               Setor Avaliado: <strong>Operação Logística – Turno 1</strong>
             </span>
           </div>
        </div>

        {/* 1. Metodologia */}
        <section className="mb-8 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 mb-4 pb-1">
            1. Metodologia e Critérios de Avaliação (NR-01.5.4.4)
          </h3>
          <p className="text-sm text-justify text-slate-700 leading-relaxed mb-4">
            A presente avaliação visa identificar perigos e avaliar riscos psicossociais relacionados ao trabalho, em conformidade com a <strong>NR-01</strong> e <strong>NR-17 (Ergonomia)</strong>. 
            Utilizou-se o método de levantamento quantitativo via questionário validado (Escala NR ZEN), onde a percepção dos trabalhadores é convertida em um Índice de Risco Psicossocial (0 a 100).
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-xs text-center">
            <div className="border border-emerald-200 bg-emerald-50 p-2 rounded print:bg-emerald-50 print:border-emerald-200">
              <span className="block font-bold text-emerald-700 mb-1">0 - 39 (Risco Baixo)</span>
              <span>Monitoramento periódico. Nenhuma ação imediata requerida.</span>
            </div>
            <div className="border border-amber-200 bg-amber-50 p-2 rounded print:bg-amber-50 print:border-amber-200">
              <span className="block font-bold text-amber-700 mb-1">40 - 69 (Risco Moderado)</span>
              <span>Estado de atenção. Requer plano de ação para melhorias a médio prazo.</span>
            </div>
            <div className="border border-red-200 bg-red-50 p-2 rounded print:bg-red-50 print:border-red-200">
              <span className="block font-bold text-red-700 mb-1">70 - 100 (Risco Alto)</span>
              <span>Crítico. Requer intervenção imediata para mitigação do risco.</span>
            </div>
          </div>
        </section>

        {/* 2. Inventário */}
        <section className="mb-8 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 mb-4 pb-1">
            2. Inventário de Riscos Ocupacionais (Identificação de Perigos)
          </h3>
          <p className="text-xs text-slate-500 mb-3">Fonte Geradora: Organização do Trabalho</p>
          
          <table className="w-full border-collapse text-sm border border-slate-300">
             <thead className="bg-slate-100 print:bg-slate-100">
               <tr>
                 <th className="border border-slate-300 p-2 text-left w-1/3 text-slate-800">Fator de Risco (Perigo)</th>
                 <th className="border border-slate-300 p-2 text-center w-20 text-slate-800">Probabilidade</th>
                 <th className="border border-slate-300 p-2 text-center w-20 text-slate-800">Severidade</th>
                 <th className="border border-slate-300 p-2 text-center w-24 text-slate-800">Nível de Risco</th>
                 <th className="border border-slate-300 p-2 text-left text-slate-800">Descrição / Evidência</th>
               </tr>
             </thead>
             <tbody>
               {[
                 { name: "Sobrecarga Cognitiva (Demandas)", prob: "3", sev: "2", level: "Moderado", text: "Ritmo intenso e prazos exíguos relatados por 45% da equipe." },
                 { name: "Falta de Autonomia", prob: "1", sev: "1", level: "Baixo", text: "Equipe relata boa liberdade operacional (Fator Protetivo)." },
                 { name: "Suporte Gerencial Insuficiente", prob: "4", sev: "3", level: "Alto", text: "Ausência de feedback e suporte em momentos de crise." },
                 { name: "Conflito Interpessoal", prob: "2", sev: "2", level: "Moderado", text: "Atritos pontuais na passagem de turno." },
               ].map((row, i) => (
                 <tr key={i}>
                   <td className="border border-slate-300 p-2 font-medium">{row.name}</td>
                   <td className="border border-slate-300 p-2 text-center">{row.prob}</td>
                   <td className="border border-slate-300 p-2 text-center">{row.sev}</td>
                   <td className="border border-slate-300 p-2 text-center">
                     <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        row.level === 'Alto' ? 'bg-red-50 border-red-200 text-red-700 print:bg-red-50' : 
                        row.level === 'Moderado' ? 'bg-amber-50 border-amber-200 text-amber-700 print:bg-amber-50' : 
                        'bg-emerald-50 border-emerald-200 text-emerald-700 print:bg-emerald-50'
                     }`}>
                       {row.level}
                     </span>
                   </td>
                   <td className="border border-slate-300 p-2 text-xs text-slate-600">{row.text}</td>
                 </tr>
               ))}
             </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-1 italic">* Probabilidade e Severidade estimadas conforme matriz da organização.</p>
        </section>

        {/* 3. Plano de Ação */}
        <section className="mb-10 print-break-inside-avoid">
           <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 mb-4 pb-1">
            3. Plano de Ação (Medidas de Prevenção)
          </h3>
           <table className="w-full border-collapse text-sm border border-slate-300">
             <thead className="bg-slate-100 print:bg-slate-100">
               <tr>
                 <th className="border border-slate-300 p-2 text-left font-semibold text-slate-800">O Que (Ação)</th>
                 <th className="border border-slate-300 p-2 text-left font-semibold text-slate-800">Por Que (Motivo)</th>
                 <th className="border border-slate-300 p-2 text-left font-semibold w-24 text-slate-800">Responsável</th>
                 <th className="border border-slate-300 p-2 text-center font-semibold w-24 text-slate-800">Prazo</th>
               </tr>
             </thead>
             <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-800">Implementar programa de desenvolvimento de liderança (foco em feedback).</td>
                  <td className="border border-slate-300 p-2 text-slate-600">Mitigar risco alto de suporte gerencial insuficiente.</td>
                  <td className="border border-slate-300 p-2 text-slate-600">RH / T&D</td>
                  <td className="border border-slate-300 p-2 text-center text-slate-600">Dez/25</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-800">Revisão do cronograma de entregas e dimensionamento.</td>
                  <td className="border border-slate-300 p-2 text-slate-600">Adequar a carga de trabalho à capacidade instalada.</td>
                  <td className="border border-slate-300 p-2 text-slate-600">Ger. Operações</td>
                  <td className="border border-slate-300 p-2 text-center text-slate-600">Nov/25</td>
                </tr>
             </tbody>
           </table>
        </section>

        {/* Assinaturas */}
        <section className="mt-16 print-break-inside-avoid">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-b border-slate-400 w-full h-8 mb-2"></div>
              <p className="font-bold text-slate-900 text-sm">João Silva</p>
              <p className="text-xs text-slate-500">Engenheiro de Seg. do Trabalho</p>
              <p className="text-xs text-slate-500">CREA: 123456/SP</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase">Responsável Técnico</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 w-full h-8 mb-2"></div>
              <p className="font-bold text-slate-900 text-sm">Representante Legal</p>
              <p className="text-xs text-slate-500">Indústrias Metalúrgicas Beta</p>
              <p className="text-[10px] text-slate-400 mt-4 uppercase">Responsável pela Organização</p>
            </div>
          </div>
        </section>

        {/* Rodapé do Papel */}
        <footer className="absolute bottom-6 left-[20mm] right-[20mm] border-t border-slate-200 pt-2 flex justify-between items-center text-[10px] text-slate-400">
           <div className="flex items-center gap-2">
             <span>NR ZEN - Tecnologia para SST</span>
           </div>
           <span>Este documento é parte integrante do PGR da organização.</span>
           <span>Página 1 de 1</span>
        </footer>

      </div>
    </div>
  );
};

export default Report;