import type { VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';

export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, billingCycle } = req.body;
  const user = req.user!; // AuthedRequest garante que user existe

  // Configuração
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/#` : 'http://localhost:5173/#';

  // --- MODO SIMULAÇÃO (Se não tiver chaves do Stripe configuradas) ---
  if (!STRIPE_SECRET_KEY) {
    console.warn("Stripe key missing. Returning simulation URL.");
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    return res.status(200).json({ 
      url: `${SITE_URL}/payment/success?session_id=mock_session_${Date.now()}&plan=${plan}` 
    });
  }

  // --- MODO REAL (Stripe) ---
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any });

    // Mapeamento de Price IDs reais (Configurados no .env ou hardcoded aqui)
    const priceMap: Record<string, Record<string, string | undefined>> = {
      consultant: {
        monthly: process.env.STRIPE_PRICE_CONSULTANT_MONTHLY,
        yearly: process.env.STRIPE_PRICE_CONSULTANT_YEARLY,
      },
      business: {
        monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
        yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
      },
      corporate: {
        monthly: process.env.STRIPE_PRICE_CORPORATE_MONTHLY,
        yearly: process.env.STRIPE_PRICE_CORPORATE_YEARLY,
      }
    };

    const selectedPriceId = priceMap[plan]?.[billingCycle];
    let lineItem;

    // Prioriza o uso do Price ID se configurado corretamente
    if (selectedPriceId && selectedPriceId.startsWith('price_')) {
      lineItem = {
        price: selectedPriceId,
        quantity: 1,
      };
    } else {
      // Fallback: Criação dinâmica de produto (para desenvolvimento ou se ID faltar)
      const pricesMock: any = {
        'consultant': { monthly: 19900, yearly: 199000 },
        'business': { monthly: 59700, yearly: 597000 },
        'corporate': { monthly: 89900, yearly: 899000 },
      };
      const amount = pricesMock[plan]?.[billingCycle] || 19900;

      lineItem = {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `NR ZEN - Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)} (${billingCycle === 'monthly' ? 'Mensal' : 'Anual'})`,
            description: 'Assinatura da plataforma de gestão de riscos psicossociais.',
          },
          unit_amount: amount,
          recurring: {
            interval: billingCycle === 'monthly' ? 'month' : 'year',
          },
        },
        quantity: 1,
      };
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [lineItem],
      mode: 'subscription',
      success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/payment/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        plan: plan,
        billingCycle: billingCycle
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: "Erro ao processar pagamento. Tente novamente." });
  }
});