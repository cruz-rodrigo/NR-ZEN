
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Lock, ArrowRight, Zap, CreditCard } from 'lucide-react';
import { PLANS } from '../config/plans.ts';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginDemo } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Parâmetros de contexto de compra para evitar queda no trial
  const planSlug = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const selectedPlan = planSlug ? PLANS.find(p => p.id === planSlug) : null;

  useEffect(() => {
    if (searchParams.get('success')) {
      setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // FLUXO CORRIGIDO: Se houver intenção de compra, vai direto para o orquestrador
      if (planSlug) {
        navigate(`/checkout/start?plan=${planSlug}&cycle=${cycle}`, { replace: true });
      } else {
        navigate('/app', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 hover:opacity-80 transition-opacity">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-blue-600">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">Acesse sua conta</h1>
        <p className="text-slate-500 text-center mb-6">Gestão de Riscos Psicossociais</p>

        {selectedPlan && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 animate-fade-in-down">
             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
               <CreditCard size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Checkout Pendente</p>
               <p className="text-sm font-bold text-slate-800">{selectedPlan.name} • {cycle === 'yearly' ? 'Anual' : 'Mensal'}</p>
             </div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-emerald-100 animate-fade-in-down">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in-down">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
               <label className="block text-sm font-semibold text-slate-700">Senha</label>
               <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Esqueceu?</Link>
            </div>
            <input 
              type="password" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-2 py-3.5 shadow-lg shadow-blue-600/20">
            {loading ? 'Validando Acesso...' : (planSlug ? 'Login e Continuar' : 'Entrar na Plataforma')}
          </Button>
        </form>

        {((import.meta as any).env?.VITE_ENABLE_OFFLINE_DEMO === 'true') && (
          <div className="mt-6">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">Ou teste sem senha</span>
                </div>
             </div>

             <Button 
               variant="secondary" 
               fullWidth 
               size="lg" 
               onClick={handleDemoLogin}
               className="mt-6 border-dashed"
             >
               <Zap size={16} className="mr-2 text-amber-500" />
               Acessar Modo Demo (Offline)
             </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 flex flex-col gap-2">
          <p>Ainda não tem cadastro?</p>
          <Link to={`/register${planSlug ? `?plan=${planSlug}&cycle=${cycle}` : ''}`} className="text-blue-600 font-bold hover:underline inline-flex items-center justify-center gap-1">
            Criar conta e Iniciar Plano <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <Lock size={10} /> Conexão Segura SSL 256-bit
        </div>
      </Card>
    </div>
  );
};

export default Login;
