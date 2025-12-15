import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { supabaseServerClient } from '../_supabaseServer.js';
import { calculateRisk, QuestionMeta, DomainMeta } from '../../lib/riskEngine.js';

const submitSchema = z.object({
  token: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.number().min(1).max(5)
  })).min(1, "Pelo menos uma resposta é necessária")
});

const FALLBACK_QUESTIONS: QuestionMeta[] = [
  { id: "D1_Q1", domainId: 1, type: "positive" }, { id: "D1_Q2", domainId: 1, type: "negative" },
  { id: "D1_Q3", domainId: 1, type: "positive" }, { id: "D1_Q4", domainId: 1, type: "negative" },
  { id: "D1_Q5", domainId: 1, type: "positive" },
  { id: "D2_Q1", domainId: 2, type: "positive" }, { id: "D2_Q2", domainId: 2, type: "negative" },
  { id: "D2_Q3", domainId: 2, type: "positive" }, { id: "D2_Q4", domainId: 2, type: "negative" },
  { id: "D2_Q5", domainId: 2, type: "positive" },
  { id: "D3_Q1", domainId: 3, type: "positive" }, { id: "D3_Q2", domainId: 3, type: "negative" },
  { id: "D3_Q3", domainId: 3, type: "positive" }, { id: "D3_Q4", domainId: 3, type: "positive" },
  { id: "D3_Q5", domainId: 3, type: "negative" },
  { id: "D4_Q1", domainId: 4, type: "positive" }, { id: "D4_Q2", domainId: 4, type: "negative" },
  { id: "D4_Q3", domainId: 4, type: "positive" }, { id: "D4_Q4", domainId: 4, type: "negative" },
  { id: "D4_Q5", domainId: 4, type: "positive" },
  { id: "D5_Q1", domainId: 5, type: "positive" }, { id: "D5_Q2", domainId: 5, type: "negative" },
  { id: "D5_Q3", domainId: 5, type: "positive" }, { id: "D5_Q4", domainId: 5, type: "positive" },
  { id: "D5_Q5", domainId: 5, type: "negative" },
  { id: "D6_Q1", domainId: 6, type: "positive" }, { id: "D6_Q2", domainId: 6, type: "negative" },
  { id: "D6_Q3", domainId: 6, type: "positive" }, { id: "D6_Q4", domainId: 6, type: "negative" },
  { id: "D6_Q5", domainId: 6, type: "positive" }
];

const FALLBACK_DOMAINS: DomainMeta[] = [
  { id: 1, name: "Demandas e ritmo", weight: 1.0 },
  { id: 2, name: "Autonomia e controle", weight: 1.0 },
  { id: 3, name: "Apoio social", weight: 1.0 },
  { id: 4, name: "Relações interpessoais", weight: 1.0 },
  { id: 5, name: "Reconhecimento", weight: 1.0 },
  { id: 6, name: "Equilíbrio vida-trabalho", weight: 1.0 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parseResult = submitSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const { token, answers } = parseResult.data;

  try {
    const { data: survey, error: surveyError } = await supabaseServerClient
      .from('surveys')
      .select('id, sector_id, active, expires_at')
      .eq('access_code', token)
      .single();

    if (surveyError || !survey) {
      return res.status(404).json({ error: 'Survey not found or invalid token' });
    }

    if (!survey.active) {
      return res.status(400).json({ error: 'Survey is inactive' });
    }

    if (survey.expires_at && new Date(survey.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Survey expired' });
    }

    let questionsMeta = FALLBACK_QUESTIONS;
    let domainsMeta = FALLBACK_DOMAINS;

    try {
      const [questionsRes, domainsRes] = await Promise.all([
        supabaseServerClient.from('questions').select('id, domain_id, type'),
        supabaseServerClient.from('domains').select('id, name, weight')
      ]);

      if (questionsRes.data && questionsRes.data.length > 0 && domainsRes.data && domainsRes.data.length > 0) {
        questionsMeta = questionsRes.data.map(q => ({
          id: q.id,
          domainId: q.domain_id,
          type: q.type as 'positive' | 'negative'
        }));
        
        domainsMeta = domainsRes.data.map(d => ({
          id: d.id,
          name: d.name,
          weight: d.weight
        }));
      }
    } catch (metaErr) {
      console.warn("Could not fetch metadata from DB, using fallback.", metaErr);
    }

    const result = calculateRisk(answers, questionsMeta, domainsMeta);

    const { error: insertError } = await supabaseServerClient
      .from('survey_responses')
      .insert([{
        survey_id: survey.id,
        answers: answers,
        risk_score: result.globalScore,
      }]);

    if (insertError) {
      console.error("Error inserting response:", insertError);
      return res.status(500).json({ error: 'Failed to save response' });
    }

    const { data: surveysInSector } = await supabaseServerClient
      .from('surveys')
      .select('id')
      .eq('sector_id', survey.sector_id);

    if (surveysInSector && surveysInSector.length > 0) {
      const surveyIds = surveysInSector.map(s => s.id);

      const { data: aggregatedData, error: aggError } = await supabaseServerClient
        .from('survey_responses')
        .select('risk_score')
        .in('survey_id', surveyIds);

      if (!aggError && aggregatedData) {
        const totalResponses = aggregatedData.length;
        const sumScores = aggregatedData.reduce((acc, curr) => acc + (curr.risk_score || 0), 0);
        const averageScore = totalResponses > 0 ? Math.round(sumScores / totalResponses) : 0;
        
        let riskLevel = 'low';
        if (averageScore >= 40) riskLevel = 'moderate';
        if (averageScore >= 70) riskLevel = 'high';

        const { data: existingAnalytics } = await supabaseServerClient
          .from('sector_analytics')
          .select('id')
          .eq('sector_id', survey.sector_id)
          .single();

        const analyticsData = {
          sector_id: survey.sector_id,
          risk_level: riskLevel,
          score: averageScore,
          last_updated: new Date().toISOString()
        };

        if (existingAnalytics) {
          await supabaseServerClient
            .from('sector_analytics')
            .update(analyticsData)
            .eq('id', existingAnalytics.id);
        } else {
          await supabaseServerClient
            .from('sector_analytics')
            .insert([analyticsData]);
        }
      }
    }

    return res.status(200).json({ 
      ok: true, 
      message: 'Response submitted successfully' 
    });

  } catch (err: any) {
    console.error("Critical error in submit handler:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}