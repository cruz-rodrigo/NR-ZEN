
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Logo } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'ready'>('verifying');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Polling do plano status por 20s
    const poll = async () => {
      await refreshUser();
      if ((user as any)?.plan_status === 'active') {
        setStatus('ready');
      } else if (attempts < 10) {
        setAttempts(prev => prev + 1);
      } else {
        setStatus('ready'); // Timeout: deixa ele entrar, o sistema lida com o resto
      }
    };

    const timer = setTimeout(poll, 2000);
    return () => clearTimeout(timer);
  }, [attempts, user, refreshUser]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="mb-10"><Logo size="lg" /></div>
      <Card className="max-w-md w-full p-10 border-t-4 border-t-emerald-500 shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          {status === 'verifying' ? <Loader2 size={40} className="animate-spin" /> : <CheckCircle2 size={40} />}
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          {status === 'verifying' ? 'Validando Pagamento...' : 'Assinatura Ativada!'}
        </h1>
        <p className="text-slate-500 mb-10 font-medium">
          {status === 'verifying' 
            ? 'Estamos processando os dados com o Stripe. Só um momento.' 
            : 'Sua conta premium já está habilitada. Bem-vindo ao NR ZEN.'}
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/app')} disabled={status === 'verifying'} className="h-16">
          IR PARA O DASHBOARD <ArrowRight className="ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <Card className="max-w-md w-full p-10 border-t-4 border-t-slate-400 shadow-xl">
        <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-8"><XCircle size={40} /></div>
        <h1 className="text-2xl font-black text-slate-900 mb-4">Pagamento Cancelado</h1>
        <p className="text-slate-500 mb-10 font-medium">Nenhuma cobrança foi realizada. Se precisar de ajuda com o checkout, entre em contato.</p>
        <div className="flex flex-col gap-3">
           <Button variant="primary" onClick={() => navigate('/app/billing')} className="h-14">TENTAR NOVAMENTE</Button>
           <Button variant="secondary" onClick={() => navigate('/app')} className="h-14">VOLTAR AO INÍCIO</Button>
        </div>
      </Card>
    </div>
  );
};
