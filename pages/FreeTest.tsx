
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, Loader2, ArrowRight, CheckCircle2, BarChart3, 
  ShieldCheck, Info, FileText, Star 
} from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { QUESTIONNAIRE_DATA } from '../constants.ts';
import { calculateRisk } from '../lib/riskEngine.ts';

type Step = 'lead' | 'questions' | 'result';

const FreeTest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('lead');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [leadData, setLeadData] = useState({ name: '', email: '', profile: 'Consultoria SST' });

  // 12 questões (2 por domínio da NR-17)
  const POCKET_QUESTIONS = QUESTIONNAIRE_DATA.map(d => ({
    ...d,
    questions: d.questions.slice(0, 2)
  }));
  const allPocketQuestions = POCKET_QUESTIONS.flatMap(d => d.questions);

  const startTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Captura lead em background
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...leadData, source: 'teste-gratis-start' })
    }).catch(console.error);

    setTimeout(() => {
      setStep('questions');
      setLoading(false);
      window.scrollTo(0,0);
    }, 600);
  };

  const handleAnswer = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const processResult = () => {
    const payload = Object.entries(answers).map(([id, val]) => ({ questionId: id, value: val }));
    const domains = POCKET_QUESTIONS.map(d => ({ id: d.id, name: d.title, weight: 1.0 }));
    const questions = allPocketQuestions.map(q => ({ 
      id: q.id, 
      domainId: parseInt(q.id.split('_')[0].replace('D','')), 
      type: q.type 
    }));

    const riskResult = calculateRisk(payload as any, questions as any, domains);
    setResult(riskResult);
    setStep('result');
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/"><Logo size="md" /></Link>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
            Demonstração Rápida
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-6">
        {step === 'lead' && (
          <div className="animate-fade-in-down">
            <div className="text-center mb-10">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Acesso Imediato</span>
              <h1 className="text-3xl font-heading font-extrabold text-slate-900 mt-4">
                Diagnóstico Organizacional NR-17
              </h1>
              <p className="text-slate-500 mt-2">Veja como funciona a automatização do PGR psicossocial.</p>
            </div>

            <Card className="p-8 shadow-2xl border-t-4 border-blue-600">
              <form onSubmit={startTest} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Seu Nome (Opcional)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Como quer ser chamado?" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail (Para resultados e novidades)</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="seu@email.com" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} />
                </div>
                <Button fullWidth size="lg" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2"/> : <Zap size={18} className="mr-2 fill-white"/>}
                  Iniciar Teste Zero Fricção
                </Button>
                <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                  Sem cartão • Sem cadastro prévio • 1 minuto
                </p>
              </form>
            </Card>
          </div>
        )}

        {step === 'questions' && (
          <div className="animate-fade-in">
             <div className="mb-8 flex justify-between items-end">
               <div>
                 <h2 className="text-2xl font-bold text-slate-800">Avaliação Pocket</h2>
                 <p className="text-sm text-slate-500">Responda simulando um colaborador do seu cliente.</p>
               </div>
               <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                 {Object.keys(answers).length} / 12
               </span>
             </div>

             <div className="space-y-8">
               {POCKET_QUESTIONS.map((domain) => (
                 <div key={domain.id} className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-3">{domain.title}</h3>
                    {domain.questions.map((q) => (
                      <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-base font-medium text-slate-800 mb-6">{q.text}</p>
                        <div className="grid grid-cols-5 gap-2">
                          {[1,2,3,4,5].map(v => (
                            <button key={v} onClick={() => handleAnswer(q.id, v)} className={`py-4 rounded-xl border-2 transition-all font-bold ${answers[q.id] === v ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-blue-200'}`}>
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
                          <span>Nunca</span>
                          <span>Sempre</span>
                        </div>
                      </div>
                    ))}
                 </div>
               ))}
             </div>

             <div className="mt-12 pt-10 border-t border-slate-200">
                <Button fullWidth size="lg" onClick={processResult} disabled={Object.keys(answers).length < 12}>
                  Ver Resultado do Diagnóstico
                </Button>
             </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="animate-fade-in-down">
            <header className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-3xl font-heading font-black text-slate-900 leading-tight">Diagnóstico Simulado</h2>
              <p className="text-slate-500">O NR ZEN processou as respostas com o algoritmo oficial.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="md:col-span-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900 text-white border-none">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Score Global</span>
                <div className="text-6xl font-black mb-2">{result.globalScore}</div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.riskLevel === 'high' ? 'bg-red-500' : result.riskLevel === 'moderate' ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500'}`}>
                  Risco {result.riskLevel}
                </div>
              </Card>

              <Card className="md:col-span-2 p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-600" /> Percepção por Fator
                </h3>
                <div className="space-y-4">
                  {result.domainScores.slice(0, 3).map((ds: any) => (
                    <div key={ds.domainId}>
                       <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                         <span>{ds.name}</span>
                         <span>{ds.score}%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full transition-all duration-1000 ${ds.score > 70 ? 'bg-red-500' : ds.score > 40 ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${ds.score}%` }} />
                       </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="bg-white rounded-3xl p-1 shadow-2xl border border-blue-100">
               <div className="bg-white rounded-[22px] p-8 text-center">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase mb-6 border border-amber-100">
                   <Star size={12} className="fill-amber-500"/> Recomendação para Consultores
                 </div>
                 <h3 className="text-2xl font-heading font-black text-slate-900 mb-4">
                    Gostou da velocidade? <br/> Aplique nos seus clientes.
                 </h3>
                 <p className="text-slate-500 mb-8 text-lg">
                    Crie sua conta Trial gratuita agora. Gere relatórios em PDF para a NR-01, gerencie múltiplos CNPJs e tenha suporte técnico especializado.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button size="lg" className="px-10" onClick={() => navigate('/register')}>
                     Criar Minha Conta (Trial Grátis)
                     <ArrowRight size={20} className="ml-2"/>
                   </Button>
                   <Button variant="secondary" size="lg" onClick={() => navigate('/#pricing')}>
                     Ver Planos e Preços
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center">
        <Logo size="sm" className="opacity-30 grayscale mb-4 mx-auto" />
      </footer>
    </div>
  );
};

export default FreeTest;
