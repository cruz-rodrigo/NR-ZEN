import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, billingCycle } = req.body;
  
  // Configuração
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/#` : 'http://localhost:5173/#';

  // --- MODO SIMULAÇÃO (Se não tiver chaves do Stripe configuradas) ---
  if (!STRIPE_SECRET_KEY) {
    console.warn("Stripe key missing. Returning simulation URL.");
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    return res.status(200).json({ 
      url: `${SITE_URL}/payment/success?session_id=mock_session_123&plan=${plan}` 
    });
  }

  // --- MODO REAL (Stripe) ---
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    // Mapeie seus Price IDs do Dashboard do Stripe aqui
    // Ex: const prices = { consultant: { monthly: 'price_123', yearly: 'price_456' } ... }
    // Para MVP, vamos usar dados dinâmicos ou IDs fixos se existirem
    
    // Fallback: Cria um produto dinâmico na hora (apenas para teste, em prod use Price IDs)
    const pricesMock: any = {
      'consultant': { monthly: 19900, yearly: 199000 },
      'business': { monthly: 59700, yearly: 597000 },
      'corporate': { monthly: 89900, yearly: 899000 },
    };

    const amount = pricesMock[plan]?.[billingCycle] || 19900;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
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
        },
      ],
      mode: 'subscription',
      success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/payment/cancel`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Error:", err);
    return res.status(500).json({ error: err.message });
  }
}