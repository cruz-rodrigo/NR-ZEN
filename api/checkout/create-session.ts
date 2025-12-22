
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';
import { PLANS } from '../../src/config/plans.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan: planId, billingCycle = 'monthly' } = req.body;
  const user = req.user!; 
  const userId = user.id;

  try {
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ 
        error: 'INVALID_CYCLE',
        message: 'Ciclo de faturamento inválido.'
      });
    }

    const planConfig = PLANS.find(p => p.id === planId);
    if (!planConfig) return res.status(400).json({ error: 'INVALID_PLAN' });

    const priceId = planConfig.stripe[billingCycle as 'monthly' | 'yearly'];
    if (!priceId) return res.status(400).json({ error: 'CYCLE_UNAVAILABLE' });

    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const origin = `${protocol}://${host}`;

    // URLs atualizadas para as novas rotas solicitadas
    const successUrl = `${origin}/#/billing/success?session_id={CHECKOUT_SESSION_ID}&old_tier=${user.plan_tier}`;
    const cancelUrl = `${origin}/#/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, planSlug: planId },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    return res.status(500).json({ error: "CHECKOUT_ERROR", detail: err.message });
  }
});
