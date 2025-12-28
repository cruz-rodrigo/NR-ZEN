
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { getCheckoutIntent, clearCheckoutIntent } from '../lib/checkoutIntent';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login, setSessionFromApi } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', confirmEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Parâmetros de intenção de compra vindos da URL ou Storage
  const redirectPlan = searchParams.get('plan') || getCheckoutIntent()?.plan || undefined;
  const redirectCycle = searchParams.get('cycle') || getCheckoutIntent()?.cycle || 'monthly';

  const emailsDoNotMatch = formData.confirmEmail.length > 0 && 
    formData.email.toLowerCase().trim() !== formData.confirmEmail.toLowerCase().trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (emailsDoNotMatch) {
      setError('Os e-mails digitados não são iguais.');
      return;
    }

    setLoading(true);

    try {
      if (redirectPlan) {
        setRedirecting(true);

        const response = await fetch('/api/auth?action=register-and-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            plan: redirectPlan,
            cycle: redirectCycle
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao criar conta ou checkout.');

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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-inner">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Sincronizando</h2>
        <p className="text-slate-500 font-medium italic">Preparando seu ambiente seguro...</p>
        <div className="mt-8"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
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
          {redirectPlan ? 'Inicie sua Assinatura' : 'Criar Conta'}
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium italic opacity-80 tracking-tight leading-tight">
          {redirectPlan ? 'Sua conta será configurada e seguiremos para o pagamento.' : 'Comece a gerenciar riscos psicossociais hoje.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in-down">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Nome da Consultoria / Profissional</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria SST Master"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Seu melhor E-mail</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="seu@email.com"
            />
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              Use um e-mail válido: é por ele que você acessa o sistema e recebe comprovantes.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Confirme seu E-mail</label>
            <input 
              type="email" required
              onPaste={(e) => e.preventDefault()}
              className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 outline-none transition-all font-medium ${emailsDoNotMatch ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-600'}`}
              value={formData.confirmEmail}
              onChange={e => setFormData({...formData, confirmEmail: e.target.value})}
              placeholder="Repita seu e-mail"
            />
            {emailsDoNotMatch && <p className="text-red-500 text-[10px] mt-1 font-bold">Os e-mails não conferem.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Senha de Acesso</label>
            <input 
              type="password" required minLength={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading || emailsDoNotMatch} className="mt-4 shadow-lg shadow-blue-600/20 py-4 uppercase text-xs font-black tracking-widest">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <span className="flex items-center gap-2">
                {redirectPlan ? 'Seguir para Pagamento' : 'Criar Minha Conta'} <ArrowRight size={18} />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium pt-6 border-t border-slate-100">
          Já possui conta? <Link to="/login" className="text-blue-600 font-bold hover:underline">Fazer Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
