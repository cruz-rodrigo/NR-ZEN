
/**
 * NR ZEN - Checkout Intent Utility
 * Gerencia a intenção de compra via sessionStorage para garantir que o 
 * usuário chegue ao Stripe mesmo após redirecionamentos de login/registro.
 */

export type BillingCycle = 'monthly' | 'yearly';
export type PlanSlug = 'consultant' | 'business' | 'corporate';

const KEY = 'nrzen_pending_checkout';
const ALLOWED_PLANS: PlanSlug[] = ['consultant', 'business', 'corporate'];
const ALLOWED_CYCLES: BillingCycle[] = ['monthly', 'yearly'];

interface CheckoutIntent {
  plan: PlanSlug;
  cycle: BillingCycle;
}

export const setCheckoutIntent = (intent: CheckoutIntent) => {
  sessionStorage.setItem(KEY, JSON.stringify(intent));
};

export const getCheckoutIntent = (): CheckoutIntent | null => {
  const saved = sessionStorage.getItem(KEY);
  if (!saved) return null;
  
  try {
    const parsed = JSON.parse(saved);
    // Validação de segurança/integridade
    if (ALLOWED_PLANS.includes(parsed.plan) && ALLOWED_CYCLES.includes(parsed.cycle)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearCheckoutIntent = () => {
  sessionStorage.removeItem(KEY);
};
