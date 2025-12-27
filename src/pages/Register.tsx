
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2, CreditCard } from 'lucide-react';
import { PLANS } from '../config/plans.ts';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Parâmetros de contexto vindos da LP ou Orquestrador
  const planSlug = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const selectedPlan = planSlug ? PLANS.find(p => p.id === planSlug) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Cria a conta (trial por padrão no backend)
      await register(formData.name, formData.email, formData.password);
      
      // 2. Faz login automático para obter o token
      await login(formData.email, formData.password);

      // 3. Se veio de um plano, redireciona para o orquestrador de checkout
      if (planSlug) {
        setRedirecting(true);
        navigate(`/checkout/start?plan=${planSlug}&cycle=${cycle}`);
      } else {
        // Fluxo normal: Dashboard (Modo Trial)
        navigate('/app');
      }
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        setError('Este e-mail já possui conta. Faça login para continuar.');
      } else {
        setError(err.message || 'Erro ao criar conta.');
      }
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-inner">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Conta Criada!</h2>
        <p className="text-slate-500 font-medium">Redirecionando para o ambiente de pagamento...</p>
        <Loader2 className="animate-spin mt-6 text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-blue-600">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">
          {planSlug ? 'Inicie sua Assinatura' : 'Crie sua conta'}
        </h1>
        <p className="text-slate-500 text-center mb-8">
          {planSlug ? 'Sua conta trial será criada e você seguirá para o pagamento.' : 'Comece a gerenciar riscos psicossociais hoje.'}
        </p>

        {selectedPlan && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 animate-fade-in-down">
             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
               <CreditCard size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Checkout Agendado</p>
               <p className="text-sm font-bold text-slate-800">{selectedPlan.name} • {cycle === 'yearly' ? 'Anual' : 'Mensal'}</p>
             </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex flex-col gap-3 border border-red-100 animate-fade-in-down">
            <div className="flex items-center gap-2 font-bold">
               <AlertCircle size={16} /> {error}
            </div>
            {error.includes('login') && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/login?plan=${planSlug}&cycle=${cycle}`)}>
                Ir para Login
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Consultoria / Profissional</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria ABC"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha (Mínimo 6 caracteres)</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4 shadow-lg shadow-blue-600/20 py-4 uppercase text-xs tracking-widest">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Validando...
              </span>
            ) : planSlug ? (
              <span className="flex items-center gap-2">
                Seguir para Pagamento <ArrowRight size={18} />
              </span>
            ) : 'Cadastrar Gratuitamente'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          Já possui conta? <Link to={`/login${planSlug ? `?plan=${planSlug}&cycle=${cycle}` : ''}`} className="text-blue-600 font-bold hover:underline">Fazer Login</Link>
        </div>
      </Card>
      
      {planSlug && (
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 max-w-md text-center shadow-sm">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
             🔒 Sua assinatura de <strong>{planSlug.toUpperCase()}</strong> é processada via Stripe. <br/> Você concorda com nossos termos ao prosseguir.
           </p>
        </div>
      )}
    </div>
  );
};

export default Register;
