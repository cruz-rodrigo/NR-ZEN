
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2, RefreshCcw, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Logo } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  
  const [verifying, setVerifying] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const oldTier = searchParams.get('old_tier');

  useEffect(() => {
    // Se o plano já mudou no contexto global, para o loading
    if (user?.plan_tier !== oldTier && user?.plan_tier !== 'trial') {
      setVerifying(false);
      return;
    }

    const interval = setInterval(async () => {
      setAttempts(prev => prev + 1);
      await refreshUser();
      
      // Se detectarmos a mudança do plano, limpamos o intervalo
      if (user?.plan_tier !== oldTier && user?.plan_tier !== 'trial') {
        setVerifying(false);
        clearInterval(interval);
      }
    }, 2000);

    // Timeout de segurança após 20 segundos (10 tentativas)
    if (attempts >= 10) {
      clearInterval(interval);
      setVerifying(false);
    }

    return () => clearInterval(interval);
  }, [user?.plan_tier, attempts, oldTier, refreshUser]);

  const getPlanName = (tier?: string) => {
    switch(tier) {
      case 'consultant': return 'Consultor';
      case 'business': return 'Business';
      case 'corporate': return 'Corporate';
      default: return tier || 'Ativo';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 hover:opacity-80 transition-opacity">
        <Logo size="lg" />
      </div>

      <Card className="max-w-md w-full text-center p-8 border-t-4 border-t-emerald-500 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldCheck size={100} />
        </div>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          {verifying ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            <CheckCircle2 size={40} className="animate-in zoom-in duration-300" />
          )}
        </div>
        
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
          {verifying ? 'Atualizando seu Plano...' : 'Pagamento Confirmado!'}
        </h1>
        
        <div className="mb-8 min-h-[60px]">
          {verifying ? (
            <div className="space-y-2">
              <p className="text-slate-500 text-sm">Estamos confirmando a transação com o Stripe.</p>
              <div className="flex justify-center gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                Assinatura processada com sucesso! Bem-vindo ao time de alta performance.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                Plano Ativo: {getPlanName(user?.plan_tier)}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            size="lg" 
            fullWidth 
            onClick={() => navigate('/app')} 
            disabled={verifying}
            className="shadow-lg shadow-blue-600/20"
          >
            {verifying ? 'Aguarde um momento...' : 'Ir para o Dashboard'} 
            {!verifying && <ArrowRight className="ml-2 w-5 h-5"/>}
          </Button>

          {verifying && attempts >= 5 && (
            <button 
              onClick={() => refreshUser()} 
              className="text-xs text-blue-600 font-bold hover:underline flex items-center justify-center mx-auto gap-1"
            >
              <RefreshCcw size={12} /> Forçar Atualização
            </button>
          )}
        </div>
      </Card>

      {!verifying && (
        <p className="mt-8 text-slate-400 text-xs text-center max-w-xs leading-relaxed">
          Você receberá a confirmação da fatura no seu e-mail cadastrado em instantes.
        </p>
      )}
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Pagamento Cancelado</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          O processo de checkout não foi concluído. Nenhuma cobrança foi realizada no seu cartão ou boleto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/app/billing')}>
              <RefreshCcw size={18} className="mr-2"/> Tentar Novamente
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/app')}>
              Voltar ao Início
            </Button>
        </div>
      </Card>
    </div>
  );
};
