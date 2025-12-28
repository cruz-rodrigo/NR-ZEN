
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { getPendingCheckout, setPendingCheckout } from '../lib/pendingCheckout';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth(); // Usamos apenas o register do contexto
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const urlPlan = searchParams.get('plan');
  const urlCycle = searchParams.get('cycle') || 'monthly';
  const pending = getPendingCheckout();
  const activePlan = urlPlan || pending?.plan;
  const activeCycle = urlCycle || pending?.cycle || 'monthly';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (urlPlan) {
        setPendingCheckout({ plan: urlPlan, cycle: urlCycle });
      }

      // 1. Criar o usuário
      await register(formData.name, formData.email, formData.password);
      
      // 2. LOGIN MANUAL (Bypass do Contexto para evitar re-render antecipado)
      const loginRes = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) throw new Error(loginData.error || 'Erro ao autenticar novo usuário.');

      // Grava diretamente no disco (Ação Atômica)
      localStorage.setItem('nrzen_token', loginData.token);
      localStorage.setItem('nrzen_user', JSON.stringify(loginData.user));
      if (loginData.refreshToken) localStorage.setItem('nrzen_refresh_token', loginData.refreshToken);

      // 3. REDIRECIONAMENTO NATIVO (Hard redirect via hash)
      setRedirecting(true);
      if (activePlan) {
        window.location.hash = `/checkout/start?plan=${activePlan}&cycle=${activeCycle}`;
      } else {
        window.location.hash = '/app';
      }
      
      // Força o reload completo da página para limpar qualquer estado de cache do React
      window.location.reload();

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 size={32} className="animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Preparando Acesso</h2>
        <p className="text-slate-500 font-medium italic">Sincronizando faturamento seguro...</p>
        <div className="mt-8">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="mb-8 hover:opacity-80 transition-opacity">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-blue-600">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center uppercase tracking-tight">
          {activePlan ? 'Assinar Plano ' + activePlan.toUpperCase() : 'Crie sua conta'}
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium italic">
          {activePlan ? 'Cadastre seu acesso para seguir ao Stripe.' : 'Inicie sua gestão de riscos agora.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold uppercase tracking-wider">Consultoria / Empresa</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: NR Consultoria Master"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold uppercase tracking-wider">E-mail Profissional</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="exemplo@empresa.com.br"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold uppercase tracking-wider">Senha de Segurança</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4 shadow-lg shadow-blue-600/20 py-4 uppercase text-[11px] font-black tracking-widest">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : activePlan ? (
              <span className="flex items-center gap-2">Finalizar e Ir ao Pagamento <ArrowRight size={18} /></span>
            ) : 'Criar Minha Conta Grátis'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium pt-6 border-t border-slate-100">
          Já possui conta? <Link to={`/login${activePlan ? `?plan=${activePlan}&cycle=${activeCycle}` : ''}`} className="text-blue-600 font-bold hover:underline">Fazer Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
