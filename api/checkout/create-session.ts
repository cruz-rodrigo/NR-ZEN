
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { PLANS, BillingCycle } from '../../src/config/plans.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan: planId, billingCycle } = req.body;
  const user = req.user!; 

  try {
    const supabase = checkDbConnection();
    const cycle: BillingCycle = (billingCycle === 'yearly') ? 'yearly' : 'monthly';
    const planConfig = PLANS.find(p => p.id === planId);
    
    if (!planConfig || planConfig.isCustom) {
      return res.status(400).json({ error: 'INVALID_PLAN' });
    }

    const selectedPriceId = planConfig.stripe[cycle];
    if (!selectedPriceId) return res.status(400).json({ error: 'PRICE_NOT_FOUND' });

    // 1. Garantir que o usuário tem um Customer ID no Stripe
    const { data: dbUser } = await supabase
      .from('users')
      .select('stripe_customer_id, name, email')
      .eq('id', user.id)
      .single();

    let customerId = dbUser?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: dbUser?.name || user.email,
        metadata: { userId: user.id }
      });
      customerId = customer.id;
      
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const origin = `${protocol}://${host}`;

    // 2. Criar Sessão de Checkout vinculada ao Customer
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${origin}/#/billing/success?session_id={CHECKOUT_SESSION_ID}&old_tier=${user.plan_tier}`,
      cancel_url: `${origin}/#/billing/cancel`,
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      metadata: { 
        userId: user.id, 
        planSlug: planId,
        billingCycle: cycle
      },
      subscription_data: {
        metadata: { userId: user.id, planSlug: planId }
      }
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error('[Stripe Session Error]', err);
    return res.status(500).json({ error: "CHECKOUT_ERROR", detail: err.message });
  }
});
