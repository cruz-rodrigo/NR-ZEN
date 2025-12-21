import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, billingCycle } = req.body;
  const user = req.user!; 

  // URL base para redirecionamento após o pagamento
  const SITE_URL = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/#` 
    : 'http://localhost:5173/#';

  try {
    // Mapeamento de preços (Valores em centavos)
    const pricesMock: any = {
      'consultant': { monthly: 19900, yearly: 199000 },
      'business': { monthly: 59700, yearly: 597000 },
      'corporate': { monthly: 89900, yearly: 899000 },
    };
    
    const safePlan = String(plan || 'consultant');
    const safeCycle = String(billingCycle || 'monthly');
    const amount = pricesMock[safePlan]?.[safeCycle] || 19900;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `NR ZEN - Plano ${safePlan.charAt(0).toUpperCase() + safePlan.slice(1)}`,
              description: `Assinatura ${safeCycle === 'monthly' ? 'Mensal' : 'Anual'} da plataforma.`,
            },
            unit_amount: amount,
            recurring: {
              interval: (safeCycle === 'monthly' ? 'month' : 'year') as 'month' | 'year',
            },
          },
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/payment/cancel`,
      customer_email: user.email,
      metadata: {
        userId: String(user.id),
        plan: safePlan,
        billingCycle: safeCycle
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: "Erro ao processar checkout. Tente novamente." });
  }
});