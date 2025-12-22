
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';
// Importação da configuração centralizada
import { PLANS } from '../../src/config/plans.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan: planId, billingCycle = 'monthly' } = req.body;
  const user = req.user!; 
  const userId = user.id;

  try {
    // 1. Validar Ciclo de Faturamento
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ 
        error: 'INVALID_CYCLE',
        message: 'Ciclo de faturamento inválido. Use "monthly" ou "yearly".'
      });
    }

    // 2. Localizar plano na configuração centralizada
    const planConfig = PLANS.find(p => p.id === planId);

    if (!planConfig) {
      return res.status(400).json({ 
        error: 'INVALID_PLAN',
        message: 'O plano selecionado não existe.'
      });
    }

    // 3. Impedir checkout de planos Enterprise/Custom via self-service
    if (planConfig.isCustom) {
      return res.status(400).json({ 
        error: 'CUSTOM_PLAN_RESTRICTION',
        message: 'Planos Enterprise requerem contratação via consultor comercial.'
      });
    }

    // 4. Obter o Price ID do ciclo solicitado
    const priceId = planConfig.stripe[billingCycle as 'monthly' | 'yearly'];

    if (!priceId) {
      return res.status(400).json({ 
        error: 'CYCLE_UNAVAILABLE',
        message: `O ciclo ${billingCycle === 'monthly' ? 'mensal' : 'anual'} não está disponível para o plano ${planConfig.name} no momento.`
      });
    }

    // 5. Determinar Origin e formatar URLs para HashRouter
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const origin = `${protocol}://${host}`;

    // Nota: Usamos /#/ antes da rota para compatibilidade com HashRouter
    const successUrl = `${origin}/#/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/#/payment/cancel`;

    console.log(`[checkout] Iniciando sessão: ${user.email} | Plano: ${planId} | Ciclo: ${billingCycle}`);
    
    // 6. Criar Sessão no Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { 
        userId, 
        planSlug: planId,
        billingCycle 
      },
      subscription_data: { 
        metadata: { 
          userId, 
          planSlug: planId,
          billingCycle 
        } 
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("[checkout] error:", err);
    return res.status(500).json({ 
      error: "CHECKOUT_ERROR",
      message: "Erro ao processar checkout.",
      detail: err.message
    });
  }
});
