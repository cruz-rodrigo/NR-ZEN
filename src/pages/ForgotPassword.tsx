import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/auth?action=forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error('Erro ao solicitar recuperação.');
      
      setSuccess(true);
    } catch (err: any) {
      setError('Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link to="/"><Logo size="lg" /></Link>
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-xl">
        <Link to="/login" className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Voltar para Login
        </Link>

        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Recuperar Senha</h1>
        <p className="text-slate-500 mb-6 text-sm">Digite seu e-mail para receber o link de redefinição.</p>

        {success ? (
          <div className="text-center animate-fade-in-down py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">E-mail Enviado!</h3>
            <p className="text-slate-600 text-sm mb-6">
              Verifique sua caixa de entrada (e spam) para redefinir sua senha.
            </p>
            <p className="text-xs text-slate-400 bg-slate-100 p-3 rounded border border-slate-200">
              Nota: Em ambiente de desenvolvimento, o link foi enviado para o console do servidor (logs).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail cadastrado</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value.toLowerCase().trim())}
                  placeholder="seu@email.com"
                />
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-2">
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;