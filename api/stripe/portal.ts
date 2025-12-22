
import type { VercelResponse } from '@vercel/node';
import { requireAuth, AuthedRequest } from '../_authMiddleware.js';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';

async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = req.user!;
  const userId = user.id;

  try {
    const supabase = checkDbConnection();

    // 1. Buscar stripe_customer_id no banco
    const { data: dbUser, error: fetchError } = await supabase
      .from('users')
      .select('stripe_customer_id, email, name')
      .eq('id', userId)
      .single();

    if (fetchError || !dbUser) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    let customerId = dbUser.stripe_customer_id;

    // 2. Se não tiver, criar no Stripe e salvar no banco
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name,
        metadata: { userId },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // 3. Criar sessão do portal
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:5173';
    const returnUrl = `${protocol}://${host}/#/app/billing`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: portalSession.url });

  } catch (err: any) {
    console.error('[Stripe Portal Error]', err);
    return res.status(500).json({ error: "PORTAL_ERROR", detail: err.message });
  }
}

export default requireAuth(handler);
