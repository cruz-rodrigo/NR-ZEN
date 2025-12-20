import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <Card className="p-8 text-center max-w-md border-t-4 border-red-500 shadow-xl">
          <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Link Inválido</h2>
          <p className="text-slate-500 mb-6">O link de recuperação está incompleto ou expirado.</p>
          <Button fullWidth onClick={() => navigate('/login')}>Voltar ao Login</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      setStatus('error');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth?action=reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha.');

      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8"><Logo size="lg" /></div>
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-blue-600">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">Nova Senha</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Defina sua nova credencial de acesso com segurança.</p>

        {status === 'success' ? (
          <div className="text-center animate-fade-in-down py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Senha Atualizada!</h3>
            <p className="text-slate-600 text-sm mb-4">Redirecionando para a tela de login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nova Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmar Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                />
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-2 py-3.5 shadow-lg shadow-blue-600/20">
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;