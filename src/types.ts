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

// Interface que reflete a tabela 'companies' do Supabase
export interface Company {
  id: string; // UUID no banco
  user_id?: string;
  name: string;
  cnpj: string;
  status: 'active' | 'inactive' | 'low' | 'moderate' | 'high'; // 'low'...'high' são usados visualmente no front, 'active' no banco
  
  // Propriedades calculadas/agregadas (frontend helper props)
  sectorsCount?: number;
  sectorsActive?: number;
  lastCollection?: string;
  
  created_at?: string;
}

// Interface para o Usuário (Sessão)
export interface UserSession {
  id: string;
  name: string;
  email: string;
  plan_tier: 'free' | 'consultant' | 'business' | 'enterprise';
}

export interface ActionPlanItem {
  domain: string;
  risk: string;
  action: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
}