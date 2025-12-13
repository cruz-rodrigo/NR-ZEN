import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, Home, Printer, ArrowRight, Zap } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { QUESTIONNAIRE_DATA } from '../constants';
import { ScoreResult, Domain, Question } from '../types';
import { Logo } from '../components/Layout';

type Screen = 'consent' | 'questions' | 'result';

const DEMO_DATA = QUESTIONNAIRE_DATA.map((domain: Domain) => ({
  ...domain,
  questions: domain.questions.slice(0, 2)
}));

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [screen, setScreen] = useState<Screen>('consent');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ScoreResult | null>(null);

  const [meta, setMeta] = useState({ sector: "Setor Logística", shift: "Geral" });

  useEffect(() => {
    if (code) {
      if (code.includes('adm')) setMeta({ sector: "Administrativo", shift: "Comercial" });
      else if (code.includes('log')) setMeta({ sector: "Operação Logística", shift: "Turno 1" });
      else if (code.includes('ref')) setMeta({ sector: "Produção", shift: "Geral" });
    }
  }, [code]);

  const ACTIVE_DATA = DEMO_DATA;

  const calculateResults = () => {
    // TODO: MIGRAÇÃO PARA BACKEND (lib/riskEngine.ts)
    // Atualmente o cálculo é feito no client-side para demonstração.
    // Em produção, esta função deve enviar `answers` para o endpoint POST /api/survey/submit
    // O backend usará `calculateRisk` do riskEngine.ts para garantir integridade e salvar no banco.
    
    let globalSum = 0;
    const domainScores = ACTIVE_DATA.map((domain: Domain) => {
      let domainSum = 0;
      let count = 0;
      
      domain.questions.forEach((q: Question) => {
        const val = answers[q.id];
        if (val) {
          let score = 0;
          // Logic: 100 = High Risk, 0 = Low Risk
          // NOTE: Esta lógica deve bater com scoreForQuestion do riskEngine.ts
          if (q.type === 'positive') {
             // Positive factor (e.g. Support): High Value (5) = Low Risk (0)
             score = ((5 - val) / 4) * 100;
          } else {
             // Negative factor (e.g. Stress): High Value (5) = High Risk (100)
             score = ((val - 1) / 4) * 100;
          }
          domainSum += score;
          count++;
        }
      });

      const avg = count > 0 ? Math.round(domainSum / count) : 0;
      globalSum += avg;
      
      return { id: domain.id, title: domain.title, score: avg };
    });

    const globalAvg = Math.round(globalSum / ACTIVE_DATA.length);
    
    let riskLevel: ScoreResult['riskLevel'] = 'Moderado';
    let riskColor = '#F59E0B'; 

    if (globalAvg <= 39) {
      riskLevel = 'Baixo';
      riskColor = '#10B981';
    } else if (globalAvg >= 70) {
      riskLevel = 'Alto';
      riskColor = '#EF4444'; 
    }

    setResult({
      globalScore: globalAvg,
      domainScores,
      riskLevel,
      riskColor
    });
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    const allQuestions = ACTIVE_DATA.flatMap((d: Domain) => d.questions);
    const unanswered = allQuestions.find((q: Question) => !answers[q.id]);
    
    if (unanswered) {
      const el = document.getElementById(unanswered.id);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-red-300');
          setTimeout(() => el.classList.remove('ring-2', 'ring-red-300'), 2000);
      }
      return;
    }
    calculateResults();
  };

  const handleRestart = () => {
    setAnswers({});
    setResult(null);
    setScreen('consent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = () => {
    window.location.href = '/#pricing';
  };

  if (screen === 'consent') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 animate-fade-in-down">
            <Link to="/" className="inline-flex justify-center mb-4 hover:opacity-80 transition-opacity">
               <Logo size="lg" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
              Pesquisa de Clima & Riscos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Setor: {meta.sector} - {meta.shift}</p>
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
                <Button size="lg" fullWidth onClick={() => { setScreen('questions'); window.scrollTo(0,0); }} className="shadow-lg shadow-blue-600/20">
                  Li e concordo em participar
                </Button>
                <Button variant="ghost" fullWidth onClick={() => navigate('/')}>
                  Não desejo participar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (screen === 'result' && result) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (result.globalScore / 100) * circumference;

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center font-sans">
        
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
             <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Respostas Enviadas!</h2>
          <p className="text-slate-500">Obrigado pela sua participação.</p>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative print:shadow-none print:border print:w-full print:max-w-none">
          
          <header className="bg-slate-900 text-white p-8 relative z-10 flex justify-between items-start">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck size={20} className="text-blue-400" />
                   <h3 className="font-heading font-bold text-xl uppercase tracking-wider">Relatório Preliminar</h3>
                </div>
                <p className="text-xs text-slate-400">Análise Automática de Riscos Psicossociais</p>
             </div>
             <div className="text-right">
                <div className="text-[10px] font-bold bg-blue-600/20 text-blue-200 px-2 py-1 rounded border border-blue-500/30 inline-block mb-1 backdrop-blur-sm">
                  AMBIENTE DEMO
                </div>
                <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
             </div>
          </header>

          <div className="relative z-10 p-8 pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
              
              <div className="flex flex-col items-center justify-center text-center">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r={radius} stroke="#F1F5F9" strokeWidth="12" fill="none" />
                      <circle 
                        cx="80" cy="80" r={radius} 
                        stroke={result.riskColor} strokeWidth="12" fill="none" 
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-slate-800">{result.globalScore}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Índice de Risco</span>
                    </div>
                 </div>
                 <div className="mt-2 text-sm font-bold px-3 py-1 rounded-full border" style={{ color: result.riskColor, borderColor: result.riskColor, backgroundColor: result.riskColor + '10' }}>
                    {result.riskLevel.toUpperCase()}
                 </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Detalhamento por Fator</h4>
                 {result.domainScores.map(d => (
                   <div key={d.id}>
                      <div className="flex justify-between text-xs mb-1">
                         <span className="font-medium text-slate-600 truncate pr-2">{d.title}</span>
                         <span className="font-bold text-slate-800">{d.score}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${d.score}%`,
                            backgroundColor: d.score <= 39 ? '#10B981' : d.score >= 70 ? '#EF4444' : '#F59E0B'
                          }}
                        ></div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center mb-6">
               <p className="text-xs text-slate-500 leading-relaxed italic">
                 "Este relatório é gerado automaticamente pelo algoritmo NR ZEN para fins de demonstração. Em um ambiente real, este painel é visível apenas para a consultoria de SST e o RH."
               </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center print:hidden shadow-lg shadow-blue-900/20">
              <h4 className="font-bold text-lg mb-2">Gostou da experiência?</h4>
              <p className="text-blue-100 text-sm mb-4">Leve essa tecnologia para sua consultoria e profissionalize seu PGR.</p>
              <Button variant="white" onClick={handleCtaClick} className="text-blue-700 font-bold border-none shadow-md hover:bg-blue-50">
                Ver Planos e Preços <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
               <p className="text-xs font-bold text-slate-900">{meta.sector}</p>
               <p className="text--[10px] text-slate-500">{meta.shift}</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
               {meta.sector.substring(0,1)}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24 print:hidden">
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start shadow-sm">
          <div className="bg-blue-100 p-1.5 rounded-full shrink-0 mt-0.5">
            <Zap size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Coleta Rápida (Pocket)</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Você está respondendo à versão reduzida de 12 questões. O tempo estimado é de 2 minutos.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8 flex gap-3 items-start">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <p>Responda com sinceridade pensando nos <strong>últimos 30 dias</strong> de trabalho. Não existem respostas certas ou erradas.</p>
          </div>
        </div>

        <div className="space-y-8">
          {ACTIVE_DATA.map((domain: Domain, index: number) => (
            <div key={domain.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                 <span className="bg-white border border-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{index + 1}</span>
                 <h3 className="font-heading font-bold text-lg text-slate-800">{domain.title}</h3>
              </div>
              
              <div className="p-2 sm:p-6 space-y-1">
                {domain.questions.map((q: Question) => (
                  <div key={q.id} id={q.id} className="p-4 rounded-xl hover:bg-slate-50 transition-colors group scroll-mt-24">
                    <p className="font-medium text-slate-800 mb-5 text-base sm:text-lg leading-relaxed">{q.text}</p>
                    
                    <div className="grid grid-cols-5 gap-1 sm:gap-3">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const labels = ["Nunca", "Raramente", "Às Vezes", "Frequentemente", "Sempre"];
                        const isSelected = answers[q.id] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleAnswer(q.id, val)}
                            className={`
                              relative flex flex-col items-center justify-center py-3 sm:py-4 rounded-lg border transition-all duration-200 group/btn
                              ${isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50'}
                            `}
                          >
                            <span className={`text-xl sm:text-2xl font-bold mb-1 ${!isSelected && 'group-hover/btn:text-blue-600'}`}>{val}</span>
                            <span className={`hidden sm:block text-[9px] font-medium leading-tight uppercase tracking-wide opacity-90 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                               {labels[val-1]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
           <div className="hidden sm:block text-sm text-slate-500">
              {Object.keys(answers).length} de {ACTIVE_DATA.flatMap((d: Domain) => d.questions).length} respondidas
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