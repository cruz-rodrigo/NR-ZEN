
export interface Question {
  id: string;
  text: string;
  type: 'positive' | 'negative';
}

export interface Domain {
  id: number;
  title: string;
  questions: Question[];
}

export interface ScoreResult {
  globalScore: number;
  domainScores: { id: number; title: string; score: number }[];
  riskLevel: 'Baixo' | 'Moderado' | 'Alto';
  riskColor: string;
}

export interface Company {
  id: string;
  user_id?: string;
  name: string;
  cnpj: string;
  status: 'active' | 'inactive' | 'low' | 'moderate' | 'high';
  
  // Frontend helpers
  sectorsCount?: number;
  sectorsActive?: number;
  lastCollection?: string;
  created_at?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  plan_tier: 'trial' | 'consultant' | 'business' | 'corporate' | 'enterprise';
}

export interface ActionPlanItem {
  id?: string;
  sector_id?: string;
  domain: string;
  risk: string;
  action: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  created_at?: string;
}
