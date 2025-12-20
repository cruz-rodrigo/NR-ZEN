import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Logo } from '../components/Layout';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8"><Logo size="lg" /></div>
      <Card className="max-w-md w-full text-center p-8 border-t-4 border-t-emerald-500 shadow-xl">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Confirmado!</h1>
        <p className="text-slate-500 mb-8">
          Sua assinatura foi ativada com sucesso. Você já pode acessar todos os recursos do seu plano.
        </p>
        <Button size="lg" fullWidth onClick={() => navigate('/app')}>
          Acessar Dashboard <ArrowRight className="ml-2 w-5 h-5"/>
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Cancelado</h1>
        <p className="text-slate-500 mb-8">
          O processo de checkout não foi concluído. Nenhuma cobrança foi realizada.
        </p>
        <div className="flex gap-4">
            <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
            <Button variant="primary" fullWidth onClick={() => navigate('/#pricing')}>
              Tentar Novamente
            </Button>
        </div>
      </Card>
    </div>
  );
};