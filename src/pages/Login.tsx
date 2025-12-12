import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

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
      // Se chegar aqui, é um erro muito grave, pois o fallback captura a maioria
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">Acesse sua conta</h1>
        <p className="text-slate-500 text-center mb-6">Bem-vindo de volta ao NR ZEN.</p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 text-sm text-blue-800 flex items-start gap-3">
           <Info className="shrink-0 mt-0.5" size={18} />
           <div>
             <span className="font-bold block mb-1">Ambiente de Demonstração</span>
             Caso a API não esteja conectada, você entrará automaticamente no modo offline. Use qualquer senha.
           </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
               <label className="block text-sm font-semibold text-slate-700">Senha</label>
               <a href="#" className="text-xs text-blue-600 hover:underline">Esqueceu?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="Digite qualquer senha"
            />
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4">
            {loading ? 'Acessando...' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Não tem uma conta? <Link to="/register" className="text-blue-600 font-bold hover:underline">Criar conta grátis</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;