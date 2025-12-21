
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';

/**
 * Mapeamento de Planos e Price IDs do Stripe (Placeholders)
 * Em produção, substitua pelos IDs reais (ex: price_123...)
 */
const PLANS_ALLOWLIST: Record<string, Record<string, string>> = {
  'consultant': {
    'monthly': 'price_placeholder_consultant_monthly',
    'yearly': 'price_placeholder_consultant_yearly',
  },
  'business': {
    'monthly': 'price_placeholder_business_monthly',
    'yearly': 'price_placeholder_business_yearly',
  },
  'corporate': {
    'monthly': 'price_placeholder_corporate_monthly',
    'yearly': 'price_placeholder_corporate_yearly',
  }
};

/**
 * Request: POST /api/checkout/create-session
 * Body: { "plan": "consultant" | "business" | "corporate", "billingCycle": "monthly" | "yearly" }
 * Header: Authorization: Bearer <JWT>
 * 
 * Response: { "url": "https://checkout.stripe.com/..." }
 */
export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validação de Configuração em Produção
  if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY não encontrada no ambiente de produção.");
    return res.status(500).json({ error: "Erro de configuração: Serviço de pagamento indisponível." });
  }

  const { plan, billingCycle = 'monthly' } = req.body;
  const user = req.user!; // Injetado pelo middleware requireAuth

  // 1. Validar Plano e Ciclo contra Allowlist
  const planConfig = PLANS_ALLOWLIST[plan as string];
  const priceId = planConfig ? planConfig[billingCycle as string] : null;

  if (!priceId) {
    return res.status(400).json({ 
      error: 'Plano ou ciclo de faturamento inválido.',
      received: { plan, billingCycle }
    });
  }

  // 2. Determinar URL de retorno (Origin)
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = req.headers.host || 'localhost:5173';
  const origin = `${protocol}://${host}/#`;

  try {
    // 3. Criar Sessão de Checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planSlug: plan as string,
        billingCycle: billingCycle as string
      },
    });

    // 4. Retornar apenas a URL da sessão
    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    
    // Retorna detalhes apenas em desenvolvimento
    return res.status(500).json({ 
      error: "Não foi possível iniciar o processo de checkout.",
      message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno no gateway de pagamento.'
    });
  }
});
