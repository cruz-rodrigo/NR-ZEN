
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
    description: 'Ideal para profissionais autônomos que precisam de laudos técnicos rápidos.',
    priceMonthly: 199,
    priceYearly: 1990, 
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
      'Até 300 avaliações por mês',
      'Cadastro de CNPJs ilimitado',
      'Relatório PDF oficial NR-17',
      'Atendimento via E-mail'
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
    limits: {
      evaluations: 1500,
      admins: 3,
      whiteLabel: true,
      onboarding: false,
      api: false
    },
    features: [
      'Até 1.500 avaliações por mês',
      'Logotipo da sua marca nos laudos',
      'Envio de dados para o eSocial',
      'Gestão de equipe (3 usuários)',
      'Suporte prioritário via WhatsApp'
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
    limits: {
      evaluations: 5000,
      admins: 10,
      whiteLabel: true,
      onboarding: true,
      api: true
    },
    features: [
      'Até 5.000 avaliações por mês',
      'Ajudamos na primeira configuração',
      'Conexão com outros softwares (API)',
      'Acesso Seguro (Login via Empresa)',
      'Treinamento para seus técnicos'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Soluções personalizadas para indústrias e departamentos de SESMT.',
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
      'Avaliações e usuários ilimitados',
      'Contrato e faturamento mensal',
      'Servidor de dados exclusivo',
      'Segurança de dados avançada',
      'Gestor de conta dedicado'
    ]
  }
];

export const formatCurrency = (value: number) => {
  // Garantia de arredondamento correto para 2 casas antes de formatar
  const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(roundedValue);
};
