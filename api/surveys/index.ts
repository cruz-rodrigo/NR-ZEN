
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { checkDbConnection } from '../_supabaseServer.js';
import { calculateRisk } from '../../lib/riskEngine.js';
import { getPlanLimits } from '../../src/config/plans.js';

const submitSchema = z.object({
  token: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.number().min(1).max(5)
  })).min(1)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = checkDbConnection();

    if (req.method === 'GET') {
      const { token } = req.query;
      if (!token) return res.status(400).json({ valid: false, reason: 'missing_token' });

      const { data: survey, error } = await supabase
        .from('surveys')
        .select('id, active, expires_at, sector_id, sectors(name, employees_count, companies(name))')
        .eq('access_code', token).single();

      if (error || !survey) return res.status(400).json({ valid: false, reason: 'not_found' });

      return res.status(200).json({
        valid: true,
        surveyId: survey.id,
        companyName: (survey.sectors as any)?.companies?.name || 'Empresa',
        sectorName: (survey.sectors as any)?.name || 'Setor'
      });
    }

    if (req.method === 'POST') {
      const { token, answers } = submitSchema.parse(req.body);

      // 1. Identificar Usuário Dono do Link para checar plano e limites
      const { data: survey, error: sErr } = await supabase
        .from('surveys')
        .select('id, sector_id, sectors(companies(user_id))')
        .eq('access_code', token).single();

      if (sErr || !survey) return res.status(404).json({ error: 'Link inválido' });

      const ownerId = (survey.sectors as any)?.companies?.user_id;
      const { data: owner } = await supabase.from('users').select('plan_tier').eq('id', ownerId).single();
      const limits = getPlanLimits(owner?.plan_tier || 'trial');

      // 2. Contar respostas recebidas no mês corrente para este usuário
      const firstDay = new Date();
      firstDay.setDate(1);
      firstDay.setHours(0,0,0,0);

      const { data: userCompanies } = await supabase.from('companies').select('id').eq('user_id', ownerId);
      const companyIds = userCompanies?.map(c => c.id) || [];
      const { data: userSectors } = await supabase.from('sectors').select('id').in('company_id', companyIds);
      const sectorIds = userSectors?.map(s => s.id) || [];
      const { data: userSurveys } = await supabase.from('surveys').select('id').in('sector_id', sectorIds);
      const surveyIds = userSurveys?.map(s => s.id) || [];

      const { count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .in('survey_id', surveyIds)
        .gte('created_at', firstDay.toISOString());

      if ((count || 0) >= limits.maxResponsesPerMonth) {
        return res.status(402).json({ 
          error: 'QUOTA_EXCEEDED', 
          message: `Este ambiente atingiu o limite de coletas mensais do plano (${limits.maxResponsesPerMonth}).` 
        });
      }

      // 3. Processar Envio
      const result = calculateRisk(answers, [], []); 

      await supabase.from('survey_responses').insert([{
        survey_id: survey.id,
        answers,
        risk_score: result.globalScore
      }]);

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
