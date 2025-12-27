
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_stripeClient.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { Buffer } from 'buffer';

export const config = { api: { bodyParser: false } };

async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) return res.status(400).send('Missing signature or secret');

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supabase = checkDbConnection();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planSlug = session.metadata?.planSlug;

        if (userId && planSlug) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await supabase
            .from('users')
            .update({ 
              plan_tier: planSlug,
              plan_status: 'active',
              stripe_subscription_id: session.subscription,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const status = sub.status; // active, past_due, unpaid, canceled
        
        await supabase
          .from('users')
          .update({ 
            plan_status: status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString()
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        await supabase
          .from('users')
          .update({ plan_status: 'canceled' })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await supabase
            .from('users')
            .update({ plan_status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error(`[Webhook Handler Error]`, err.message);
    return res.status(500).send('Internal Server Error');
  }
}
