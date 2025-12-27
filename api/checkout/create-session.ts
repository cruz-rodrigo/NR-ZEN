
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';
import { PLANS, BillingCycle } from '../../src/config/plans.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan: planId, billingCycle } = req.body;
  const user = req.user!; 

  try {
    // Correção da tipagem: Garantir que cycle seja estritamente 'monthly' | 'yearly'
    const cycle: BillingCycle = (billingCycle === 'yearly') ? 'yearly' : 'monthly';
    
    const planConfig = PLANS.find(p => p.id === planId);
    
    if (!planConfig || planConfig.isCustom) {
      return res.status(400).json({ error: 'INVALID_PLAN', message: 'Este plano requer contato comercial.' });
    }

    // Agora o compilador aceita o índice pois cycle é do tipo BillingCycle
    const selectedPriceId = planConfig.stripe[cycle];
    
    if (!selectedPriceId) {
      return res.status(400).json({ 
        error: 'BILLING_CYCLE_UNAVAILABLE', 
        message: 'Ciclo de faturamento não disponível para este plano.' 
      });
    }

    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const origin = `${protocol}://${host}`;

    // HashRouter compatibility URLs
    const successUrl = `${origin}/#/billing/success?session_id={CHECKOUT_SESSION_ID}&old_tier=${user.plan_tier}`;
    const cancelUrl = `${origin}/#/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      metadata: { 
        userId: user.id, 
        planSlug: planId,
        billingCycle: cycle
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error('[Stripe Session Error]', err);
    return res.status(500).json({ error: "CHECKOUT_ERROR", detail: err.message });
  }
});
