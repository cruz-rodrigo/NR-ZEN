
/**
 * NR ZEN - Pending Checkout Manager
 * Gerencia a intenção de compra no sessionStorage para não perder o plano
 * escolhido durante o fluxo de Login/Cadastro.
 */

const STORAGE_KEY = 'nrzen_pending_checkout';

export interface PendingCheckout {
  plan: string;
  cycle: string;
}

export const setPendingCheckout = (data: PendingCheckout) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getPendingCheckout = (): PendingCheckout | null => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const clearPendingCheckout = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};
