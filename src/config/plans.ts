
/**
 * NR ZEN - Configuração Central de Planos (SSOT)
 */

export type PlanCycle = 'monthly' | 'yearly';

export interface PlanLimit {
  evaluations: number;
  admins: number;
  whiteLabel: boolean;
  onboarding: boolean;
  api: boolean;
}

export interface StripeIds {
  monthly: string | null;
  yearly: string | null;
}

export interface PlanConfig {
  id: 'consultant' | 'business' | 'corporate' | 'enterprise';
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number | null;
  isCustom?: boolean;
  popular?: boolean;
  limits: PlanLimit;
  stripe: StripeIds;
  features: string[];
}

export const PLANS: PlanConfig[] = [
  {
    id: 'consultant',
    name: 'Consultor',
    description: 'Para profissionais autônomos iniciando a digitalização.',
    priceMonthly: 199,
    priceYearly: 1990, // R$ 165,83 /mês no anual
    stripe: {
      monthly: 'price_1SguTzGcHKyraESSSiH1iN87',
      yearly: 'price_1SguTzGcHKyraESSSiH1iN87_YEAR'
    },
    limits: {
      evaluations: 300,
      admins: 1,
      whiteLabel: false,
      onboarding: false,
      api: false
    },
    features: [
      'Até 300 avaliações/mês',
      'CNPJs Ilimitados',
      'Relatórios PDF Padrão',
      'Suporte por E-mail'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para consultorias em crescimento com equipe.',
    priceMonthly: 597,
    priceYearly: 5988, // R$ 499 /mês no anual
    popular: true,
    stripe: {
      monthly: 'price_1SgucBGcHKyraESSOCbesRUk',
      yearly: 'price_1SgucBGcHKyraESSOCbesRUk_YEAR'
    },
    limits: {
      evaluations: 1500,
      admins: 3,
      whiteLabel: true,
      onboarding: false,
      api: false
    },
    features: [
      'Até 1.500 avaliações/mês',
      'Relatórios White-Label',
      'Painel eSocial/NR-01',
      'Gestão de Acessos',
      'Suporte Prioritário'
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Para grandes consultorias com alto volume.',
    priceMonthly: 899,
    priceYearly: 8988, // R$ 749 /mês no anual
    stripe: {
      monthly: 'price_corporate_m',
      yearly: 'price_corporate_y'
    },
    limits: {
      evaluations: 5000,
      admins: 10,
      whiteLabel: true,
      onboarding: true,
      api: true
    },
    features: [
      'Até 5.000 avaliações/mês',
      'Onboarding Assistido',
      'API de Integração',
      'Treinamento de Equipe'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solução sob medida para grandes corporações e SESMT.',
    priceMonthly: 0,
    priceYearly: null,
    isCustom: true,
    stripe: {
      monthly: null,
      yearly: null
    },
    limits: {
      evaluations: 100000,
      admins: 100,
      whiteLabel: true,
      onboarding: true,
      api: true
    },
    features: [
      'Volume Ilimitado',
      'Instância Dedicada',
      'Integração SSO & SAML',
      'SLA Garantido',
      'Contrato Personalizado'
    ]
  }
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
};
