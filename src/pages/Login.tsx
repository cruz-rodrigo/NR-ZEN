import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Info, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ email: 'teste@nrzen.com', password: '' });
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
      // Tenta login (AuthContext lidará com fallback se API falhar)
      await login(formData.email, formData.password || '123456');
      navigate('/app');
    } catch (err: any) {
      // Fallback final para garantir acesso em caso de erro crítico
      console.error("Erro crítico no login, forçando modo offline:", err);
      // Se o AuthContext falhar completamente (o que é raro com o fallback interno),
      // podemos ter uma rede de segurança aqui, mas o AuthContext já deve lidar com isso.
      setError(err.message || 'Erro inesperado ao conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 hover:opacity-80 transition-opacity">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-blue-600">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">Acesse sua conta</h1>
        <p className="text-slate-500 text-center mb-6">Bem-vindo de volta ao NR ZEN.</p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 text-sm text-blue-800 flex items-start gap-3">
           <Info className="shrink-0 mt-0.5" size={18} />
           <div>
             <span className="font-bold block mb-1">Ambiente de Demonstração</span>
             O sistema entrará em modo offline caso a API não esteja disponível. Use a senha sugerida ou qualquer outra.
           </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
               <label className="block text-sm font-semibold text-slate-700">Senha</label>
               <a href="#" className="text-xs text-blue-600 hover:underline">Esqueceu?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="Digite qualquer senha"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-2 py-3.5 shadow-lg shadow-blue-600/20">
            {loading ? 'Acessando...' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 flex flex-col gap-2">
          <p>Não tem uma conta?</p>
          <Link to="/register" className="text-blue-600 font-bold hover:underline inline-flex items-center justify-center gap-1">
            Criar conta grátis <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <Lock size={10} /> Conexão Segura SSL
        </div>
      </Card>
    </div>
  );
};

export default Login;