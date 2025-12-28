
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { getCheckoutIntent } from '../lib/checkoutIntent';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Cria a conta
      await register(formData.name, formData.email, formData.password);
      
      // 2. Faz login automático
      await login(formData.email, formData.password);

      // 3. LOGICA DE REDIRECIONAMENTO LIMPA:
      // Se existe intenção no storage, o Gate no topo do App vai capturar o 
      // próximo render e mandar para /checkout/start. 
      // Nós apenas sinalizamos sucesso e navegamos para o destino padrão (Trial).
      setRedirecting(true);
      
      const intent = getCheckoutIntent();
      if (intent) {
        // Força a ida para o orquestrador imediatamente para acelerar
        navigate('/checkout/start', { replace: true });
      } else {
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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Sucesso!</h2>
        <p className="text-slate-500 font-medium italic">Preparando seu ambiente...</p>
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
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center uppercase tracking-tight">Criar Conta</h1>
        <p className="text-slate-500 text-center mb-8 font-medium italic">Inicie sua gestão de riscos psicossociais hoje.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100 animate-fade-in">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Nome da Consultoria / Profissional</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Consultoria SST Master"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">E-mail Corporativo</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bold">Senha de Acesso</label>
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
            ) : (
              <span className="flex items-center gap-2">Criar Minha Conta <ArrowRight size={18} /></span>
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
