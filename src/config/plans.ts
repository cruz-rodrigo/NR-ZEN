
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
    priceYearly: 1990, // ~165/mês
    stripe: {
      monthly: 'price_1SguTzGcHKyraESSSiH1iN87',
      yearly: null // Adicionar quando disponível no Stripe
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
    priceYearly: 5988, // ~499/mês
    popular: true,
    stripe: {
      monthly: 'price_1SgucBGcHKyraESSOCbesRUk',
      yearly: null
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
    priceYearly: 8988, // ~749/mês
    stripe: {
      monthly: 'price_1SguTzGcHKyraESSSiH1iN87_CORP', // Substituir por ID real do Stripe
      yearly: null
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
    maximumFractionDigits: 0
  }).format(value);
};
