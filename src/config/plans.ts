
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
    description: 'Para profissionais autônomos que precisam gerar relatórios oficiais.',
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
      'Cadastro ilimitado de CNPJs',
      'Relatório PDF padrão NR-17',
      'Suporte humano por E-mail'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para consultorias com equipe que gerenciam o PGR de vários clientes.',
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
      'Painel de exportação para eSocial',
      'Relatórios com o seu Logotipo',
      'Gestão de equipe (3 usuários)',
      'Suporte prioritário via WhatsApp'
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Para grandes consultorias com alto volume de coleta e análises.',
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
      'Treinamento para seus técnicos',
      'Integração com outros sistemas',
      'Ajuda na primeira configuração',
      'Atendimento por telefone'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solução sob medida para grandes indústrias e departamentos de SESMT.',
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
      'Banco de dados exclusivo',
      'Login com e-mail da empresa',
      'Garantia de disponibilidade',
      'Contrato e faturamento mensal'
    ]
  }
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
