import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { QUESTIONNAIRE_DATA } from '../constants';
import { ScoreResult } from '../types';
import { Logo } from '../components/Layout';

type Screen = 'consent' | 'questions' | 'result';

const Questionnaire: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('consent');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ScoreResult | null>(null);

  // Helper to calculate score
  const calculateResults = () => {
    let globalSum = 0;
    const domainScores = QUESTIONNAIRE_DATA.map(domain => {
      let domainSum = 0;
      let count = 0;
      
      domain.questions.forEach(q => {
        const val = answers[q.id];
        if (val) {
          // 1-5 Scale logic
          let score = 0;
          if (q.type === 'positive') {
            score = ((val - 1) / 4) * 100;
          } else {
            score = (((6 - val) - 1) / 4) * 100;
          }
          domainSum += score;
          count++;
        }
      });

      const avg = count > 0 ? Math.round(domainSum / count) : 0;
      globalSum += avg;
      
      return { id: domain.id, title: domain.title, score: avg };
    });

    const globalAvg = Math.round(globalSum / QUESTIONNAIRE_DATA.length);
    let riskLevel: ScoreResult['riskLevel'] = 'Moderado';
    let riskColor = '#F59E0B'; // Amber

    if (globalAvg <= 39) {
      riskLevel = 'Alto';
      riskColor = '#EF4444'; // Red
    } else if (globalAvg >= 70) {
      riskLevel = 'Baixo';
      riskColor = '#06B6D4'; // Cyan (Low Risk)
    }

    setResult({
      globalScore: globalAvg,
      domainScores,
      riskLevel,
      riskColor
    });
    setScreen('result');
    window.scrollTo(0,0);
  };

  const handleAnswer = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    const allQuestions = QUESTIONNAIRE_DATA.flatMap(d => d.questions);
    const unanswered = allQuestions.find(q => !answers[q.id]);
    
    if (unanswered) {
      alert("Por favor, responda todas as perguntas antes de enviar.");
      const el = document.getElementById(unanswered.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    calculateResults();
  };

  // --- RENDERERS ---

  if (screen === 'consent') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full">
          {/* Header decorativo simples */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="inline-flex justify-center mb-4">
               <Logo size="lg" />
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Pesquisa de Clima & Riscos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Setor: Logística - Turno 1</p>
          </div>

          <Card className="border-t-4 border-t-blue-600 shadow-xl shadow-blue-900/5">
            <div className="p-2 space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                   <ShieldCheck size={100} />
                 </div>
                 <h3 className="text-blue-800 font-bold text-lg mb-2 relative z-10">Termo de Consentimento</h3>
                 <p className="text-blue-900/80 text-sm leading-relaxed relative z-10">
                   Este questionário tem como objetivo identificar fatores psicossociais no ambiente de trabalho para o <strong>Programa de Gerenciamento de Riscos (PGR)</strong>.
                 </p>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Anônimo & Seguro</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Seus dados individuais nunca são revelados. A análise é feita apenas por grupos/setores.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Proteção de Dados</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Em conformidade com a LGPD e normas técnicas de SST.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button size="lg" fullWidth onClick={() => setScreen('questions')} className="shadow-lg shadow-blue-600/20">
                  Li e concordo em participar
                </Button>
                <Button variant="ghost" fullWidth onClick={() => alert("Janela pode ser fechada.")}>
                  Não desejo participar
                </Button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Plataforma NR ZEN</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (screen === 'result' && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <Card className="max-w-xl w-full text-center shadow-2xl border-t-4" style={{borderTopColor: result.riskColor}}>
          
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg -mt-16 relative z-10">
            <div className={`w-full h-full rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-500 ${
              result.riskLevel === 'Baixo' ? 'text-emerald-500 bg-emerald-50' : 
              result.riskLevel === 'Alto' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50'
            }`}>
              <CheckCircle2 size={48} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Obrigado!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Suas respostas foram enviadas e criptografadas com sucesso.</p>

          {/* Demo Feedback Area */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
              DEMO VIEW
            </div>
            
            <h3 className="font-bold text-xs text-slate-400 uppercase mb-6 tracking-wider text-center">Resultado Preliminar (Simulação)</h3>
            
            <div className="flex flex-col items-center justify-center mb-6">
               <div className="text-6xl font-extrabold tracking-tighter" style={{ color: result.riskColor }}>
                 {result.globalScore}
               </div>
               <div className="text-sm font-bold uppercase mt-2 px-3 py-1 rounded-full bg-white border shadow-sm" style={{ color: result.riskColor, borderColor: result.riskColor }}>
                 Risco {result.riskLevel}
               </div>
            </div>
            
            <p className="text-center text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              * Nota: Na versão real, o colaborador não visualiza este score, apenas a confirmação de envio para evitar viés.
            </p>
          </div>
          
          <Button variant="secondary" onClick={() => window.location.reload()} fullWidth>
            Reiniciar Demonstração
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
               <p className="text-xs font-bold text-slate-900">Logística</p>
               <p className="text-[10px] text-slate-500">Turno 1</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
               L1
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Progress Warning */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 items-start">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p>Responda com sinceridade pensando nos <strong>últimos 30 dias</strong> de trabalho. Não existem respostas certas ou erradas.</p>
          </div>
        </div>

        <div className="space-y-8">
          {QUESTIONNAIRE_DATA.map((domain, index) => (
            <div key={domain.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                 <span className="bg-white border border-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{index + 1}</span>
                 <h3 className="font-heading font-bold text-lg text-slate-800">{domain.title}</h3>
              </div>
              
              <div className="p-2 sm:p-6 space-y-1">
                {domain.questions.map((q) => (
                  <div key={q.id} id={q.id} className="p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                    <p className="font-medium text-slate-800 mb-5 text-base sm:text-lg leading-relaxed">{q.text}</p>
                    
                    {/* Scale Logic */}
                    <div className="grid grid-cols-5 gap-1 sm:gap-3">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const labels = ["Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"];
                        const isSelected = answers[q.id] === val;
                        // Color logic for selection
                        const activeColorClass = val < 3 ? 'bg-red-500 border-red-500' : val > 3 ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-500 border-slate-500';
                        const textClass = val < 3 ? 'text-red-600' : val > 3 ? 'text-emerald-600' : 'text-slate-600';

                        return (
                          <button
                            key={val}
                            onClick={() => handleAnswer(q.id, val)}
                            className={`
                              relative flex flex-col items-center justify-center py-3 sm:py-4 rounded-lg border transition-all duration-200 group/btn
                              ${isSelected 
                                ? `${activeColorClass} text-white shadow-md scale-[1.02]` 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50'}
                            `}
                          >
                            <span className={`text-xl sm:text-2xl font-bold mb-1 ${!isSelected && 'group-hover/btn:text-blue-600'}`}>{val}</span>
                            <span className={`hidden sm:block text-[9px] font-medium leading-tight uppercase tracking-wide opacity-90 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                               {labels[val-1].split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2 px-1 sm:hidden">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">Discordo</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">Concordo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
           <div className="hidden sm:block text-sm text-slate-500">
              {Object.keys(answers).length} de {QUESTIONNAIRE_DATA.flatMap(d => d.questions).length} respondidas
           </div>
           <Button size="lg" onClick={handleSubmit} className="w-full sm:w-auto shadow-lg shadow-blue-600/20 px-8">
             Finalizar e Enviar
             <ChevronRight className="ml-2 w-5 h-5" />
           </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;