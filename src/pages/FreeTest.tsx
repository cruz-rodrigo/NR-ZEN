
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, Loader2, ArrowRight, CheckCircle2, BarChart3, 
  Star 
} from 'lucide-react';
import { Logo } from '../components/Layout.tsx';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import { QUESTIONNAIRE_DATA } from '../constants.ts';
// Importação corrigida para subir dois níveis e encontrar a pasta lib na raiz
import { calculateRisk } from '../../lib/riskEngine';

type Step = 'cadastro' | 'perguntas' | 'resultado';

const FreeTest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('cadastro');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [leadData, setLeadData] = useState({ name: '', email: '', profile: 'Consultoria SST' });

  const POCKET_QUESTIONS = QUESTIONNAIRE_DATA.map(d => ({
    ...d,
    questions: d.questions.slice(0, 2)
  }));
  const allPocketQuestions = POCKET_QUESTIONS.flatMap(d => d.questions);

  const startTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...leadData, source: 'teste-gratis-direto' })
    }).catch(console.error);

    setTimeout(() => {
      setStep('perguntas');
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
    setStep('resultado');
    window.scrollTo(0,0);
  };

  const getRiskLabel = (level: string) => {
    switch(level) {
      case 'high': return 'ALTO';
      case 'moderate': return 'MODERADO';
      case 'low': return 'BAIXO';
      default: return level.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/"><Logo size="md" /></Link>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
            Demonstração da Metodologia
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-6">
        {step === 'cadastro' && (
          <div className="animate-fade-in-down">
            <div className="text-center mb-10">
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Acesso Imediato</span>
              <h1 className="text-3xl font-heading font-black text-slate-900 mt-6 tracking-tight">
                Diagnóstico de Riscos NR-17
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Veja na prática como automatizar seu PGR Psicossocial.</p>
            </div>

            <Card className="p-8 shadow-2xl border-t-4 border-blue-600">
              <form onSubmit={startTest} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Seu Nome (Opcional)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Como quer ser chamado?" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Corporativo</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="seu@email.com" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} />
                </div>
                <Button fullWidth size="lg" disabled={loading} className="h-16 uppercase text-sm font-black tracking-widest">
                  {loading ? <Loader2 className="animate-spin mr-2"/> : <Zap size={18} className="mr-2 fill-white"/>}
                  INICIAR TESTE
                </Button>
                <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">
                  Sem cartão • Resultado em 1 minuto
                </p>
              </form>
            </Card>
          </div>
        )}

        {step === 'perguntas' && (
          <div className="animate-fade-in">
             <div className="mb-10 flex justify-between items-end">
               <div>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Avaliação Simplificada</h2>
                 <p className="text-sm text-slate-500 font-medium">Responda pensando em um colaborador real.</p>
               </div>
               <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                 {Object.keys(answers).length} / 12
               </span>
             </div>

             <div className="space-y-10">
               {POCKET_QUESTIONS.map((domain) => (
                 <div key={domain.id} className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">{domain.title}</h3>
                    {domain.questions.map((q) => (
                      <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                        <p className="text-lg font-bold text-slate-800 mb-8 leading-tight">{q.text}</p>
                        <div className="grid grid-cols-5 gap-3">
                          {[1,2,3,4,5].map(v => (
                            <button 
                              key={v} 
                              onClick={() => handleAnswer(q.id, v)} 
                              className={`h-14 rounded-2xl border-2 transition-all font-black text-lg ${answers[q.id] === v ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-xl shadow-blue-600/20' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-blue-100'}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Nunca / Discordo</span>
                          <span>Sempre / Concordo</span>
                        </div>
                      </div>
                    ))}
                 </div>
               ))}
             </div>

             <div className="mt-16 pt-10 border-t border-slate-200">
                <Button fullWidth size="lg" onClick={processResult} disabled={Object.keys(answers).length < 12} className="h-20 text-lg font-black uppercase tracking-widest">
                  GERAR DIAGNÓSTICO
                </Button>
             </div>
          </div>
        )}

        {step === 'resultado' && result && (
          <div className="animate-fade-in-down">
            <header className="text-center mb-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Resultado do Simulado</h2>
              <p className="text-slate-500 font-medium mt-2">Dados processados pelo algoritmo NR ZEN conforme a NR-01.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="md:col-span-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950 text-white border-none rounded-[40px] shadow-2xl">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 opacity-70">Pontuação Geral</span>
                <div className="text-7xl font-heading font-black mb-4 tracking-tighter">{result.globalScore}</div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${result.riskLevel === 'high' ? 'bg-red-600 text-white' : result.riskLevel === 'moderate' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'}`}>
                  RISCO {getRiskLabel(result.riskLevel)}
                </div>
              </Card>

              <Card className="md:col-span-2 p-10 rounded-[40px] border border-slate-100 flex flex-col justify-center">
                <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 uppercase text-xs tracking-widest">
                  <BarChart3 size={18} className="text-blue-600" /> Percepção por Fator
                </h3>
                <div className="space-y-6">
                  {result.domainScores.slice(0, 3).map((ds: any) => (
                    <div key={ds.domainId}>
                       <div className="flex justify-between text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wide">
                         <span>{ds.name}</span>
                         <span className="text-slate-900">{ds.score}%</span>
                       </div>
                       <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                         <div className={`h-full rounded-full transition-all duration-1000 ${ds.score > 70 ? 'bg-red-500' : ds.score > 40 ? 'bg-amber-400' : 'bg-blue-600'}`} style={{ width: `${ds.score}%` }} />
                       </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="bg-white rounded-[48px] p-1.5 shadow-2xl border border-blue-50">
               <div className="bg-white rounded-[46px] p-10 text-center border border-slate-100">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase mb-8 border border-amber-100 tracking-widest">
                   <Star size={14} className="fill-amber-500 text-amber-500"/> Recomendação para Consultores
                 </div>
                 <h3 className="text-3xl font-heading font-black text-slate-900 mb-6 leading-tight tracking-tight">
                    Gostou da agilidade? <br/> <span className="text-blue-600">Aplique em seus clientes.</span>
                 </h3>
                 <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                    Crie sua conta e tenha acesso ao questionário completo da NR-17, gere relatórios oficiais em PDF para o PGR e gerencie múltiplos CNPJs em um só lugar.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                   <Button size="lg" className="h-20 px-12 text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 w-full sm:w-auto" onClick={() => navigate('/register')}>
                     CRIAR MINHA CONTA
                     <ArrowRight size={20} className="ml-3"/>
                   </Button>
                   <Button variant="secondary" size="lg" className="h-20 px-12 text-sm font-black uppercase tracking-widest w-full sm:w-auto border-2" onClick={() => navigate('/#pricing')}>
                     VER PLANOS
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-16 text-center opacity-20 hover:opacity-50 transition-opacity">
        <Logo size="sm" className="grayscale mb-4 mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Tecnologia SST • Segurança e Ordem</p>
      </footer>
    </div>
  );
};

export default FreeTest;
