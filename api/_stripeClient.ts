import Stripe from 'stripe';

/**
 * NR ZEN - Stripe Backend Client
 * Centraliza a inicialização com a Secret Key.
 * Versão da API: 2024-06-20
 */

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.error("ERRO CRÍTICO: STRIPE_SECRET_KEY não configurada no ambiente.");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
  appInfo: {
    name: 'NR-ZEN-SaaS',
    version: '1.0.1',
  },
});

export default stripe;