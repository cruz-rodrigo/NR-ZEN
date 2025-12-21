import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_stripeClient.js';
import { supabaseServerClient } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'] as string;

  let event;

  try {
    const buf = await buffer(req);
    
    if (STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(buf, signature, STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback para desenvolvimento local sem webhook secret configurado
      event = JSON.parse(buf.toString());
      console.warn("⚠️ Webhook executado sem verificação de assinatura (Secret ausente).");
    }
  } catch (err: any) {
    console.error(`⚠️ Webhook signature failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan && supabaseServerClient) {
          await supabaseServerClient
            .from('users')
            .update({ plan_tier: plan })
            .eq('id', userId);
          console.log(`✅ Usuário ${userId} atualizado para o plano ${plan}`);
        }
        break;

      default:
        console.log(`ℹ️ Evento Stripe não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error(`❌ Erro no processamento do webhook: ${err.message}`);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}