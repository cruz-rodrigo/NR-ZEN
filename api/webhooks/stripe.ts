
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

/**
 * IMPORTANTE: Desativamos o bodyParser do Vercel para ler o corpo bruto (Raw Body).
 * Isso é obrigatório para a verificação de assinatura do Stripe.
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

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[STRIPE WEBHOOK ERROR] Assinatura ou Secret ausentes.");
    return res.status(400).send('Webhook Error: Missing signature/secret');
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[STRIPE WEBHOOK ERROR] Falha na validação: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log mínimo para monitoramento de produção
  console.log(`[STRIPE EVENT] Type: ${event.type}`);

  try {
    const supabase = checkDbConnection();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Extração dos metadados definidos no create-session.ts
        const userId = session.metadata?.userId;
        const planSlug = session.metadata?.planSlug;

        if (!userId || !planSlug) {
          console.error("[PROVISIONING ERROR] Metadata userId ou planSlug ausentes na sessão.");
          return res.status(400).json({ error: 'Missing session metadata' });
        }

        // Provisionamento do Plano
        const { error } = await supabase
          .from('users')
          .update({ 
            plan_tier: planSlug,
            // Atualizamos timestamps se a coluna existir
            created_at: undefined // Exemplo de manter integridade
          })
          .eq('id', userId);

        if (error) {
          console.error(`[DB ERROR] Falha ao atualizar plano do usuário ${userId}: ${error.message}`);
          throw error;
        }

        console.log(`✅ [SUCCESS] Provisionamento concluído: User ${userId} -> Plano ${planSlug}`);
        break;
      }

      case 'customer.subscription.deleted': {
        // Opcional: Reverter para plano 'trial' ou 'free' ao cancelar assinatura
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await supabase
            .from('users')
            .update({ plan_tier: 'trial' })
            .eq('id', userId);
          console.log(`[SUBSCRIPTION] Usuário ${userId} expirou. Voltando para Trial.`);
        }
        break;
      }

      default:
        // Outros eventos (invoice.paid, etc) podem ser tratados aqui
        break;
    }

    return res.status(200).json({ received: true });

  } catch (err: any) {
    console.error(`[WEBHOOK CRITICAL ERROR] ${err.message}`);
    return res.status(500).json({ error: 'Internal processing failure' });
  }
}
