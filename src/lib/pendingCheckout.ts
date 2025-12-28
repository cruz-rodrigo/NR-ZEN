
/**
 * NR ZEN - Persistent Pending Checkout
 * Usa localStorage para garantir que o plano escolhido não se perca 
 * em nenhuma hipótese durante o fluxo de autenticação.
 */

const STORAGE_KEY = 'nrzen_pending_plan';

export interface PendingCheckout {
  plan: string;
  cycle: string;
}

export const setPendingCheckout = (data: PendingCheckout) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getPendingCheckout = (): PendingCheckout | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const clearPendingCheckout = () => {
  localStorage.removeItem(STORAGE_KEY);
};
