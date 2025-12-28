
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getCheckoutIntent, clearCheckoutIntent } from '../lib/checkoutIntent';
import EmailConfirmationFields from '../components/auth/EmailConfirmationFields';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login, setSessionFromApi } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', confirmEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Intenção de compra
  const redirectPlan = searchParams.get('plan') || getCheckoutIntent()?.plan || undefined;
  const redirectCycle = searchParams.get('cycle') || getCheckoutIntent()?.cycle || 'monthly';

  const getFriendlyPlanName = (slug?: string) => {
    const map: Record<string, string> = {
      'consultant': 'CONSULTOR',
      'business': 'BUSINESS',
      'corporate': 'CORPORATE'
    };
    return map[slug || ''] || slug?.toUpperCase() || 'ASSINATURA';
  };

  const emailsMatch = formData.email.trim().length > 0 && 
    formData.email.trim().toLowerCase() === formData.confirmEmail.trim().toLowerCase();

  const isFormValid = formData.name.length >= 3 && emailsMatch && formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setError('');
    setLoading(true);

    try {
      if (redirectPlan) {
        setRedirecting(true);
        const response = await fetch('/api/auth?action=register-and-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            plan: redirectPlan,
            cycle: redirectCycle
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao processar registro.');

        setSessionFromApi({ token: data.token, refreshToken: data.refreshToken, user: data.user });
        clearCheckoutIntent();
        window.location.replace(data.url);
        return;
      }

      await register(formData.name, formData.email, formData.password);
      await login(formData.email, formData.password);
      navigate('/app');

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
      setLoading(false);
      setRedirecting(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-bounce shadow-xl">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Sincronizando</h2>
        <p className="text-slate-500 font-medium italic">Preparando seu ambiente seguro...</p>
        <div className="mt-10"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="mb-8 hover:opacity-80 transition-opacity">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-2xl border-t-4 border-t-blue-600">
        <h1 className="text-2xl font-heading font-black text-slate-900 mb-2 text-center uppercase tracking-tight">
          {redirectPlan ? 'Inicie sua Assinatura' : 'Criar Conta'}
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium italic opacity-80 leading-tight">
          {redirectPlan ? 'Sua conta será configurada e seguiremos para o pagamento.' : 'Comece a gerenciar riscos psicossociais hoje.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in font-bold">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome da Consultoria / Profissional</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-700"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria SST Master"
            />
          </div>

          <EmailConfirmationFields 
            email={formData.email}
            confirmEmail={formData.confirmEmail}
            onEmailChange={(v) => setFormData({...formData, email: v})}
            onConfirmEmailChange={(v) => setFormData({...formData, confirmEmail: v})}
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Senha de Acesso</label>
            <input 
              type="password" required minLength={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-700"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <Button 
            fullWidth size="lg" type="submit" 
            disabled={loading || !isFormValid} 
            className="mt-4 h-16 shadow-xl shadow-blue-600/20 py-4 uppercase text-xs font-black tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <span className="flex items-center gap-3">
                {redirectPlan ? 'Seguir para Pagamento' : 'Criar Minha Conta'} <ArrowRight size={20} />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium pt-6 border-t border-slate-100">
          Já possui conta? <Link to="/login" className="text-blue-600 font-black hover:underline">Fazer Login</Link>
        </div>
      </Card>
      
      {redirectPlan && (
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-6 max-w-md text-center shadow-sm">
           <p className="text-[11px] text-blue-800 font-black leading-relaxed uppercase tracking-widest">
             Sua assinatura de <strong>{getFriendlyPlanName(redirectPlan)}</strong> será processada via Stripe com segurança bancária.
           </p>
        </div>
      )}
    </div>
  );
};

export default Register;
