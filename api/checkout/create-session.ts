
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

/**
 * Handler: Criar Sessão de Checkout
 * Requer autenticação via Bearer Token
 */
export default requireAuth(async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Validação de Segurança para Produção
  if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
    console.error("[CRITICAL] STRIPE_SECRET_KEY is missing in production environment.");
    return res.status(500).json({ 
      error: "Erro de configuração.", 
      message: "Serviço de pagamento indisponível (Secret Key ausente)." 
    });
  }

  const { plan } = req.body;
  const user = req.user!; // Injetado pelo middleware requireAuth
  const userId = user.id;

  // 2. Validação do Plano contra Allowlist
  if (!plan || !PLANS[plan as PlanSlug]) {
    return res.status(400).json({ 
      error: 'Plano inválido.',
      message: 'O plano selecionado não existe em nossa base de produtos ativos.'
    });
  }

  const selectedPlan = PLANS[plan as PlanSlug];

  // 3. Determinar Origin para Callbacks (Compatível com HashRouter)
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = req.headers.host || 'localhost:5173';
  const origin = `${protocol}://${host}/#`;

  try {
    // 4. Criar Sessão de Checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
      
      // Callbacks
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      
      // Itens da Assinatura
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],

      // Metadados para processamento posterior via Webhook
      metadata: {
        userId,
        planSlug: plan as string,
      },
      
      // Metadados na subscription para redundância
      subscription_data: {
        metadata: {
          userId,
          planSlug: plan as string,
        },
      },
    });

    // 5. Retornar apenas a URL para o frontend redirecionar
    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    
    return res.status(500).json({ 
      error: "Não foi possível iniciar o processo de checkout.",
      message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno no gateway de pagamento.'
    });
  }
});
