
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Parâmetros de intenção de compra vindos da Landing Page
  const planSlug = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Cria a conta
      await register(formData.name, formData.email, formData.password);
      
      // 2. Faz login automático para gerar o token no sistema
      await login(formData.email, formData.password);

      // 3. REGRA INFALÍVEL: Se ele escolheu um plano, volta para o Orquestrador.
      // Não tentamos chamar a API do Stripe aqui para evitar conflito de estado do Token.
      if (planSlug) {
        setRedirecting(true);
        navigate(`/checkout/start?plan=${planSlug}&cycle=${cycle}`, { replace: true });
      } else {
        // Fluxo normal para quem não escolheu plano (Trial puro)
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Criada com Sucesso!</h2>
        <p className="text-slate-500 font-medium">Redirecionando para o pagamento seguro...</p>
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
        <p className="text-slate-500 text-center mb-8">
          {planSlug ? 'Complete seu cadastro para ativar seu plano profissional.' : 'Comece a gerenciar riscos psicossociais hoje.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in-down">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Consultoria / Profissional</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria SST"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha de Acesso</label>
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

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4 shadow-lg shadow-blue-600/20 py-4 uppercase text-xs font-black tracking-widest">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : planSlug ? (
              <span className="flex items-center gap-2">Próximo Passo: Pagamento <ArrowRight size={18} /></span>
            ) : 'Criar minha conta Trial'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium pt-6 border-t border-slate-100">
          Já possui conta? <Link to={`/login${planSlug ? `?plan=${planSlug}&cycle=${cycle}` : ''}`} className="text-blue-600 font-bold hover:underline">Fazer Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
