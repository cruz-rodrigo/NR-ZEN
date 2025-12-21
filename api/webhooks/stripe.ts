
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

/**
 * IMPORTANTE: Desativamos o bodyParser do Vercel para poder ler o corpo bruto (Raw Body).
 * Isso é obrigatório para que a verificação de assinatura do Stripe funcione.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Helper para converter o stream da requisição em um Buffer completo.
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
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[WEBHOOK ERROR] stripe-signature ou STRIPE_WEBHOOK_SECRET ausentes.");
    return res.status(400).send('Webhook Error: Missing signature/secret');
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[WEBHOOK ERROR] Falha na validação da assinatura: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[STRIPE WEBHOOK] Evento recebido: ${event.type}`);

  try {
    const supabase = checkDbConnection();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Extraímos os metadados injetados no endpoint de checkout
        const userId = session.metadata?.userId;
        const planSlug = session.metadata?.planSlug;

        if (!userId || !planSlug) {
          console.error("[WEBHOOK ERROR] Metadados userId ou planSlug ausentes na sessão.");
          return res.status(400).json({ error: 'Missing metadata' });
        }

        console.log(`[PROVISIONING] Atualizando plano para usuário: ${userId} -> ${planSlug}`);

        // Atualização no Supabase
        const { error } = await supabase
          .from('users')
          .update({ 
            plan_tier: planSlug,
            // updated_at: new Date().toISOString() // Descomente se sua tabela tiver esta coluna
          })
          .eq('id', userId);

        if (error) {
          console.error(`[DB ERROR] Falha ao atualizar plano: ${error.message}`);
          throw error;
        }

        console.log(`✅ [SUCCESS] Usuário ${userId} agora é ${planSlug}`);
        break;
      }

      // Você pode adicionar outros eventos aqui no futuro (ex: invoice.payment_failed)
      default:
        console.log(`[STRIPE WEBHOOK] Evento ignorado: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (err: any) {
    console.error(`[WEBHOOK CRITICAL ERROR] ${err.message}`);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
