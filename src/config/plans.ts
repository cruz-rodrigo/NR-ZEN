
/**
 * NR ZEN - Configuração Central de Planos e Limites (SSOT)
 */

export type PlanTier = 'trial' | 'consultant' | 'business' | 'corporate' | 'enterprise';

export interface PlanLimits {
  maxCompanies: number;
  maxSectorsTotal: number;
  maxResponsesPerMonth: number;
  whiteLabel: boolean;
  support: 'email' | 'whatsapp' | 'priority';
}

export interface StripeIds {
  monthly: string | null;
  yearly: string | null;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number | null;
  isCustom?: boolean;
  popular?: boolean;
  stripe: StripeIds;
  features: string[];
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  trial: {
    maxCompanies: 1,
    maxSectorsTotal: 1,
    maxResponsesPerMonth: 3,
    whiteLabel: false,
    support: 'email'
  },
  consultant: {
    maxCompanies: 10,
    maxSectorsTotal: 50,
    maxResponsesPerMonth: 300,
    whiteLabel: false,
    support: 'email'
  },
  business: {
    maxCompanies: 50,
    maxSectorsTotal: 9999, // Ilimitado na prática
    maxResponsesPerMonth: 1500,
    whiteLabel: true,
    support: 'whatsapp'
  },
  corporate: {
    maxCompanies: 9999, // Empresas Ilimitadas
    maxSectorsTotal: 9999,
    maxResponsesPerMonth: 5000,
    whiteLabel: true,
    support: 'priority'
  },
  enterprise: {
    maxCompanies: 99999,
    maxSectorsTotal: 99999,
    maxResponsesPerMonth: 999999,
    whiteLabel: true,
    support: 'priority'
  }
};

export const PLANS: PlanConfig[] = [
  {
    id: 'consultant',
    name: 'Consultor',
    description: 'Ideal para profissionais autônomos que precisam de laudos oficiais.',
    priceMonthly: 199,
    priceYearly: 1990, 
    stripe: {
      monthly: 'price_1SguTzGcHKyraESSSiH1iN87',
      yearly: 'price_1SguTzGcHKyraESSSiH1iN87_YEAR'
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
    priceMonthly: 597,
    priceYearly: 5988, 
    popular: true,
    stripe: {
      monthly: 'price_1SgucBGcHKyraESSOCbesRUk',
      yearly: 'price_1SgucBGcHKyraESSOCbesRUk_YEAR'
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
    priceMonthly: 899,
    priceYearly: 8988, 
    stripe: {
      monthly: 'price_corporate_m',
      yearly: 'price_corporate_y'
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
    priceMonthly: 0,
    priceYearly: null,
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

export const formatCurrency = (value: number) => {
  const rounded = Number((Math.round(value * 100) / 100).toFixed(2));
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rounded);
};

export const getPlanLimits = (tier: string = 'trial'): PlanLimits => {
  return PLAN_LIMITS[tier as PlanTier] || PLAN_LIMITS.trial;
};
