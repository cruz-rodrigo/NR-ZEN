import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabaseServerClient } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

// Desabilita o body parser padrão da Vercel para ler o stream bruto
// Necessário para verificar a assinatura do Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper para ler o stream da requisição como Buffer
const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Erro: Variáveis de ambiente do Stripe não configuradas.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any });
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    // Lê o corpo bruto da requisição
    const buf = await buffer(req);
    
    // Verifica se a requisição veio realmente do Stripe
    event = stripe.webhooks.constructEvent(buf, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Trata os eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log(`💰 Pagamento recebido: Sessão ${session.id}`);

        // Extrai dados salvos no metadata durante a criação da sessão
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          console.log(`🔄 Atualizando usuário ${userId} para o plano ${plan}...`);

          // Atualiza o plano no Supabase usando a chave de serviço (admin)
          const { error } = await supabaseServerClient
            .from('users')
            .update({ plan_tier: plan })
            .eq('id', userId);

          if (error) {
            console.error('❌ Erro ao atualizar Supabase:', error);
            return res.status(500).json({ error: 'Database update failed' });
          }
          
          console.log('✅ Plano atualizado com sucesso!');
        } else {
          console.warn('⚠️  Metadata incompleto na sessão do Stripe:', session.metadata);
        }
        break;

      default:
        console.log(`ℹ️  Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (err: any) {
    console.error(`❌ Erro no processamento do webhook: ${err.message}`);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}