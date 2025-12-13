/**
 * NR ZEN Risk Calculation Engine
 * Lógica central para cálculo de riscos psicossociais.
 * Baseado em escalas Likert (1-5) convertidas para índice de risco (0-100).
 * 
 * Convenção de Risco:
 * 0 = Risco Mínimo (Situação Ideal)
 * 100 = Risco Máximo (Situação Crítica)
 */

export interface QuestionMeta {
  id: string; // ID da questão (ex: "D1_Q1")
  domainId: number;
  type: 'positive' | 'negative';
}

export interface DomainMeta {
  id: number;
  name: string;
  weight: number; // Peso para média ponderada (ex: 1.0 para média simples)
}

export interface AnswerPayload {
  questionId: string;
  value: number; // Likert 1 a 5
}

export interface DomainScore {
  domainId: number;
  name: string;
  score: number;
}

export interface RiskResult {
  globalScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  domainScores: DomainScore[];
}

/**
 * Converte valor Likert (1-5) para percentual base (0-100).
 * 1 -> 0%
 * 2 -> 25%
 * 3 -> 50%
 * 4 -> 75%
 * 5 -> 100%
 */
export function likertToPercent(value: number): number {
  if (value < 1) value = 1;
  if (value > 5) value = 5;
  return (value - 1) * 25;
}

/**
 * Calcula o score de risco individual de uma pergunta.
 * 
 * Se type == 'negative' (ex: "Sinto exaustão"):
 *   - Resposta 5 (Concordo Totalmente) -> Base 100% -> Risco 100 (Alto).
 *   - Resposta 1 (Discordo Totalmente) -> Base 0% -> Risco 0 (Baixo).
 * 
 * Se type == 'positive' (ex: "Tenho autonomia"):
 *   - Resposta 5 (Concordo Totalmente) -> Base 100% -> Risco 0 (Baixo, pois é fator de proteção).
 *   - Resposta 1 (Discordo Totalmente) -> Base 0% -> Risco 100 (Alto, falta de proteção).
 */
export function scoreForQuestion(value: number, type: 'positive' | 'negative'): number {
  const basePercent = likertToPercent(value);
  return type === 'positive' ? 100 - basePercent : basePercent;
}

/**
 * Determina o nível qualitativo de risco baseado no score global.
 */
export function riskLevelFromScore(score: number): 'low' | 'moderate' | 'high' {
  if (score <= 39) return 'low';
  if (score <= 69) return 'moderate';
  return 'high';
}

/**
 * Função principal de cálculo.
 * Processa respostas brutas e metadados para gerar o relatório de risco.
 */
export function calculateRisk(
  answers: AnswerPayload[],
  questions: QuestionMeta[],
  domains: DomainMeta[]
): RiskResult {
  
  // 1. Acumuladores por Domínio
  const domainAccumulators: Record<number, { sum: number; count: number }> = {};
  
  // Inicializa
  domains.forEach(d => {
    domainAccumulators[d.id] = { sum: 0, count: 0 };
  });

  // 2. Processa cada resposta
  answers.forEach(ans => {
    const question = questions.find(q => q.id === ans.questionId);
    
    if (!question) {
      // Ignora respostas para perguntas desconhecidas no metadata
      return; 
    }

    const riskScore = scoreForQuestion(ans.value, question.type);
    
    if (domainAccumulators[question.domainId]) {
      domainAccumulators[question.domainId].sum += riskScore;
      domainAccumulators[question.domainId].count += 1;
    }
  });

  // 3. Calcula Score de cada Domínio (Média Simples das perguntas)
  const domainScores: DomainScore[] = domains.map(d => {
    const acc = domainAccumulators[d.id];
    // Evita divisão por zero se o domínio não tiver respostas
    const avg = acc.count > 0 ? acc.sum / acc.count : 0;
    
    return {
      domainId: d.id,
      name: d.name,
      score: Math.round(avg) // Arredonda para inteiro
    };
  });

  // 4. Calcula Score Global (Média Ponderada dos Domínios)
  let weightedSum = 0;
  let totalWeight = 0;

  domainScores.forEach(ds => {
    const domainMeta = domains.find(d => d.id === ds.domainId);
    if (domainMeta) {
      weightedSum += ds.score * domainMeta.weight;
      totalWeight += domainMeta.weight;
    }
  });

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return {
    globalScore,
    riskLevel: riskLevelFromScore(globalScore),
    domainScores
  };
}