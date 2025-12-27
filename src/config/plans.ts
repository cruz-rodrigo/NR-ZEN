
/**
 * NR ZEN - Configuração Central de Planos e Preços (SSOT)
 */

export type PlanTier = 'trial' | 'consultant' | 'business' | 'corporate' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPriceBRL: number;
  yearlyPriceBRL: number | null;
  stripe: {
    monthly: string | null;
    yearly: string | null;
  };
  features: string[];
  popular?: boolean;
  isCustom?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: 'consultant',
    name: 'Consultor',
    description: 'Ideal para profissionais autônomos que precisam de laudos oficiais.',
    monthlyPriceBRL: 199,
    yearlyPriceBRL: 1990, 
    stripe: {
      monthly: 'price_1SguTzGcHKyraESSSiH1iN87',
      yearly: 'price_1Sj501GcHKyraESSazqtyEG2'
    },
    features: [
      'Até 10 empresas ativas',
      'Até 50 setores/GHEs',
      'Até 300 avaliações/mês',
      'Relatório PDF oficial NR-17',
      'Suporte via E-mail'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para consultorias que gerenciam vários clientes e possuem equipe.',
    monthlyPriceBRL: 597,
    yearlyPriceBRL: 5970, 
    popular: true,
    stripe: {
      monthly: 'price_1Sj4x4GcHKyraESSgdZ6afXt',
      yearly: 'price_1Sj4w3GcHKyraESSo5DdFhhQ'
    },
    features: [
      'Até 50 empresas ativas',
      'Setores ilimitados',
      'Até 1.500 avaliações/mês',
      'Sua marca nos laudos (White-label)',
      'Suporte via WhatsApp'
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Para grandes operações de SST com alto volume de coletas.',
    monthlyPriceBRL: 899,
    yearlyPriceBRL: 8990, 
    stripe: {
      monthly: 'price_1Sj0pPGcHKyraESSbQclcKU3',
      yearly: 'price_1Sj4yiGcHKyraESSDshP06i4'
    },
    features: [
      'Empresas Ilimitadas',
      'Até 5.000 avaliações/mês',
      'Acesso via API dedicada',
      'Suporte Prioritário'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Soluções sob medida para indústrias e grandes departamentos.',
    monthlyPriceBRL: 0,
    yearlyPriceBRL: null,
    isCustom: true,
    stripe: { monthly: null, yearly: null },
    features: [
      'Volume de coletas customizado',
      'Servidor de dados exclusivo',
      'Treinamento in-company',
      'Gestor de conta dedicado'
    ]
  }
];

export const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const getPlanPrice = (planId: PlanTier, cycle: BillingCycle) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return null;

  const chargeAmount = cycle === 'yearly' && plan.yearlyPriceBRL ? plan.yearlyPriceBRL : plan.monthlyPriceBRL;
  const displayMonthlyEquivalent = cycle === 'yearly' && plan.yearlyPriceBRL ? plan.yearlyPriceBRL / 12 : plan.monthlyPriceBRL;
  const stripePriceId = cycle === 'yearly' ? plan.stripe.yearly : plan.stripe.monthly;

  return { chargeAmount, displayMonthlyEquivalent, stripePriceId };
};

export const getPlanLimits = (tier: string = 'trial') => {
  const limits: Record<string, any> = {
    trial: { maxCompanies: 1, maxSectorsTotal: 1, maxResponsesPerMonth: 3 },
    consultant: { maxCompanies: 10, maxSectorsTotal: 50, maxResponsesPerMonth: 300 },
    business: { maxCompanies: 50, maxSectorsTotal: 999, maxResponsesPerMonth: 1500 },
    corporate: { maxCompanies: 999, maxSectorsTotal: 999, maxResponsesPerMonth: 5000 },
    enterprise: { maxCompanies: 9999, maxSectorsTotal: 9999, maxResponsesPerMonth: 99999 }
  };
  return limits[tier] || limits.trial;
};
