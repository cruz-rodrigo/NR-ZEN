
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

/**
 * CONFIGURAÇÃO DO RUNTIME:
 * Desativa o bodyParser automático do Vercel para permitir a leitura do Raw Body,
 * necessária para a validação da assinatura do Stripe.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Helper para coletar o stream da requisição e transformar em um Buffer.
 */
async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[Webhook Error] Assinatura ou Secret ausentes.");
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook Error] Falha na validação: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log mínimo para produção
  console.log(`[Stripe Webhook] Evento recebido: ${event.type}`);

  try {
    const supabase = checkDbConnection();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        const userId = session.metadata?.userId;
        const planSlug = session.metadata?.planSlug;

        if (!userId || !planSlug) {
          console.error("[Webhook Error] Metadados userId ou planSlug não encontrados na sessão.");
          break;
        }

        // Atualização do usuário no Supabase (Provisionamento)
        const { error } = await supabase
          .from('users')
          .update({ 
            plan_tier: planSlug,
            // Adicionamos campos de controle se existirem no seu schema
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error(`[DB Error] Falha ao provisionar plano para o usuário ${userId}:`, error.message);
          throw error;
        }

        console.log(`[Success] Plano ${planSlug} provisionado para o usuário ${userId}.`);
        break;
      }

      // Outros eventos úteis futuramente:
      // case 'customer.subscription.deleted':
      // case 'invoice.payment_failed':

      default:
        // Eventos não tratados são apenas ignorados com 200
        break;
    }

    return res.status(200).json({ received: true });

  } catch (err: any) {
    console.error(`[Webhook Critical Error] ${err.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
