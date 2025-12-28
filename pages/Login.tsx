import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react';
import { getCheckoutIntent, clearCheckoutIntent } from '../lib/checkoutIntent';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginDemo, setSessionFromApi } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      const intent = getCheckoutIntent();

      if (intent) {
        // Fluxo Transacional: Login e Início de Checkout em um só passo
        const response = await fetch('/api/auth?action=login-and-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            plan: intent.plan,
            cycle: intent.cycle
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'E-mail ou senha incorretos.');

        // Estabelece sessão local sem navegar para /app
        setSessionFromApi({ token: data.token, refreshToken: data.refreshToken, user: data.user });
        
        // Limpa intenção apenas no sucesso absoluto
        clearCheckoutIntent();
        
        // Manda direto para o Stripe
        window.location.replace(data.url);
        return;
      }

      await login(formData.email, formData.password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao conectar.');
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
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center uppercase tracking-tight">Acesse sua conta</h1>
        <p className="text-slate-500 text-center mb-6 font-medium italic opacity-80 tracking-tight">Gestão de Riscos Psicossociais</p>

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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
               <label className="block text-sm font-semibold text-slate-700 font-bold">Senha</label>
               <Link to="/forgot-password" title="Esqueceu a senha?" className="text-xs text-blue-600 hover:underline font-bold">Esqueceu?</Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-2 py-3.5 shadow-lg shadow-blue-600/20 font-black uppercase text-xs tracking-widest">
            {loading ? 'Acessando...' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-6">
           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-black tracking-widest">Ou</span>
              </div>
           </div>

           <Button 
             variant="secondary" 
             fullWidth 
             size="lg" 
             onClick={handleDemoLogin}
             className="mt-6 border-dashed font-black uppercase text-[10px] tracking-widest"
           >
             <Zap size={14} className="mr-2 text-amber-500 fill-amber-500" />
             Acessar Modo Demo (Offline)
           </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 flex flex-col gap-2">
          <p className="font-medium">Ainda não tem cadastro?</p>
          <Link to="/register" className="text-blue-600 font-bold hover:underline inline-flex items-center justify-center gap-1">
            Criar conta grátis <ArrowRight size={14} />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;