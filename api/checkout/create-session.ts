
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';

/**
 * NR ZEN - Configuração de Planos (Stripe Mode: TEST)
 */
const PLANS = {
  consultant: {
    priceId: 'price_1SguTzGcHKyraESSSiH1iN87', // NR ZEN – Plano Consultor
    label: 'Consultor',
  },
  business: {
    priceId: 'price_1SgucBGcHKyraESSOCbesRUk', // NR ZEN – Plano Business
    label: 'Business',
  },
} as const;

type PlanSlug = keyof typeof PLANS;

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan } = req.body;
  const user = req.user!; 
  const userId = user.id;

  try {
    // 1. Validação do Plano
    if (!plan || !PLANS[plan as PlanSlug]) {
      return res.status(400).json({ 
        error: 'INVALID_PLAN',
        message: 'O plano selecionado não é válido.'
      });
    }

    const selectedPlan = PLANS[plan as PlanSlug];

    // 2. Determinar Origin
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const origin = `${protocol}://${host}/#`;

    // 3. Criar Sessão
    console.log(`[checkout] Iniciando sessão para: ${user.email} (Plano: ${plan})`);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      metadata: { userId, planSlug: plan as string },
      subscription_data: { metadata: { userId, planSlug: plan as string } },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    // DIAGNÓSTICO MELHORADO
    console.error("[checkout] error:", err);

    const isDev = process.env.NODE_ENV === "development";
    
    return res.status(500).json({ 
      error: "CHECKOUT_ERROR",
      ...(isDev && { detail: String(err.message || err) })
    });
  }
});
