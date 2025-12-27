
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

  // Parâmetros vindos da Landing Page via URL
  const planSlug = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const selectedPlan = planSlug ? PLANS.find(p => p.id === planSlug) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Cria a conta (O backend define como trial por padrão)
      await register(formData.name, formData.email, formData.password);
      
      // 2. Realiza o login para obter o token de autenticação
      await login(formData.email, formData.password);

      // 3. REGRA DE OURO: Se ele escolheu um plano, volta para o Orquestrador.
      // O Orquestrador agora tem o token e vai disparar o Stripe.
      if (planSlug) {
        setRedirecting(true);
        navigate(`/checkout/start?plan=${planSlug}&cycle=${cycle}`, { replace: true });
      } else {
        // Apenas se não houver intenção de compra, vai para o Dashboard Trial
        navigate('/app', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
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
        <p className="text-slate-500 font-medium">Iniciando ambiente de pagamento seguro...</p>
        <div className="mt-8">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
        </div>
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
        <p className="text-slate-500 text-center mb-8 leading-relaxed">
          {planSlug 
            ? `Você está a um passo de ativar o plano ${selectedPlan?.name}.` 
            : 'Comece a gerenciar riscos psicossociais hoje.'}
        </p>

        {selectedPlan && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 animate-fade-in-down">
             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
               <CreditCard size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Plano Selecionado</p>
               <p className="text-sm font-bold text-slate-800">{selectedPlan.name} • {cycle === 'yearly' ? 'Anual' : 'Mensal'}</p>
             </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in-down">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Consultoria / Profissional</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria SST Premium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha de Acesso</label>
            <input 
              type="password" required minLength={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4 shadow-lg shadow-blue-600/20 py-4 uppercase text-xs font-black tracking-widest">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : planSlug ? (
              <span className="flex items-center gap-2">Ir para o Pagamento <ArrowRight size={18} /></span>
            ) : 'Criar minha conta Trial'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium border-t border-slate-100 pt-6">
          Já possui conta? <Link to={`/login${planSlug ? `?plan=${planSlug}&cycle=${cycle}` : ''}`} className="text-blue-600 font-bold hover:underline">Fazer Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
