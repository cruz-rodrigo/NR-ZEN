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
  id: number;
  name: string;
  cnpj: string;
  sectorsCount: number;
  sectorsActive: number;
  lastCollection: string;
  status: 'low' | 'moderate' | 'high';
}

export interface ActionPlanItem {
  domain: string;
  risk: string;
  action: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
}