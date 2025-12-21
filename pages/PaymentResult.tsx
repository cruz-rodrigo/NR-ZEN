
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Logo } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const sync = async () => {
      // Aguarda um pouco para o webhook processar no backend
      await new Promise(r => setTimeout(r, 2000));
      await refreshUser();
      setVerifying(false);
    };
    sync();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8"><Logo size="lg" /></div>
      <Card className="max-w-md w-full text-center p-8 border-t-4 border-t-emerald-500 shadow-xl">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          {verifying ? <Loader2 size={40} className="animate-spin" /> : <CheckCircle2 size={40} />}
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {verifying ? 'Processando Assinatura...' : 'Pagamento Confirmado!'}
        </h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          {verifying 
            ? 'Estamos confirmando os detalhes com o gateway de pagamento. Isso leva apenas alguns segundos.' 
            : `Sua assinatura ${user?.plan_tier} foi ativada com sucesso! Você já pode acessar todos os recursos liberados.`
          }
        </p>
        
        <Button size="lg" fullWidth onClick={() => navigate('/app')} disabled={verifying}>
          {verifying ? 'Aguarde...' : 'Ir para o Dashboard'} <ArrowRight className="ml-2 w-5 h-5"/>
        </Button>
      </Card>
    </div>
  );
};

export const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8"><Logo size="lg" /></div>
      <Card className="max-w-md w-full text-center p-8 border-t-4 border-t-slate-400 shadow-xl">
        <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout Cancelado</h1>
        <p className="text-slate-500 mb-8">
          O processo de pagamento não foi concluído. Se você teve algum problema técnico, nossa equipe está pronta para ajudar.
        </p>
        <div className="flex flex-col gap-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/app/billing')}>
              <RefreshCcw size={18} className="mr-2"/> Tentar Novamente
            </Button>
            <Button variant="ghost" fullWidth onClick={() => navigate('/app')}>
              Voltar ao Início
            </Button>
        </div>
      </Card>
    </div>
  );
};
