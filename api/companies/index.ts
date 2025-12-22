
import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware.js';
import { checkDbConnection } from '../_supabaseServer.js';
import { getPlanLimits } from '../../src/config/plans.js';

async function handler(req: AuthedRequest, res: VercelResponse) {
  const userId = req.user!.id;
  const planTier = req.user!.plan_tier || 'trial';
  const limits = getPlanLimits(planTier);
  const { mode } = req.query;

  try {
    const supabase = checkDbConnection();

    if (req.method === 'GET' && mode === 'stats') {
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { data: companies } = await supabase.from('companies').select('id').eq('user_id', userId);

      let activeSectors = 0;
      let totalResponses = 0;
      let riskHighCount = 0;

      if (companies && companies.length > 0) {
        const companyIds = companies.map(c => c.id);
        const { count: sectorsCount } = await supabase.from('sectors').select('*', { count: 'exact', head: true }).in('company_id', companyIds);
        activeSectors = sectorsCount || 0;

        const { data: sectors } = await supabase.from('sectors').select('id').in('company_id', companyIds);
        const sectorIds = sectors?.map(s => s.id) || [];
        const { data: surveys } = await supabase.from('surveys').select('id').in('sector_id', sectorIds);
        const surveyIds = surveys?.map(s => s.id) || [];

        const { count: resCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true }).in('survey_id', surveyIds);
        totalResponses = resCount || 0;

        const { data: analytics } = await supabase.from('sector_analytics').select('risk_level').in('sector_id', sectorIds);
        if (analytics) {
          riskHighCount = analytics.filter(a => a.risk_level === 'high').length;
        }
      }

      return res.status(200).json({
        total: companiesCount || 0,
        activeSectors,
        responses: totalResponses,
        riskHighPercent: activeSectors > 0 ? Math.round((riskHighCount / activeSectors) * 100) : 0,
        limits: {
            maxCompanies: limits.maxCompanies,
            maxSectors: limits.maxSectorsTotal,
            maxResponses: limits.maxResponsesPerMonth
        }
      });
    }

    if (req.method === 'POST') {
      const { name, cnpj, firstSectorName, employeesCount } = req.body;

      // 1. Validar Limite de Empresas do Plano
      const { count: currentCompanies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if ((currentCompanies || 0) >= limits.maxCompanies) {
        return res.status(403).json({ 
          error: 'LIMIT_REACHED', 
          message: `Seu plano atingiu o limite de ${limits.maxCompanies} empresa(s).` 
        });
      }

      // 2. Validar Limite de Setores Totais (GHEs)
      const { data: userCompanies } = await supabase.from('companies').select('id').eq('user_id', userId);
      const companyIds = userCompanies?.map(c => c.id) || [];
      const { count: currentSectors } = await supabase.from('sectors').select('*', { count: 'exact', head: true }).in('company_id', companyIds);
      
      if ((currentSectors || 0) >= limits.maxSectorsTotal) {
         return res.status(403).json({ 
           error: 'LIMIT_REACHED', 
           message: `Limite de setores do plano atingido (${limits.maxSectorsTotal}).` 
         });
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ user_id: userId, name, cnpj, status: 'active' }])
        .select().single();

      if (companyError) return res.status(500).json({ error: companyError.message });

      if (firstSectorName) {
        await supabase.from('sectors').insert([{
          company_id: company.id,
          name: firstSectorName,
          employees_count: employeesCount ? parseInt(employeesCount) : 0
        }]);
      }

      return res.status(201).json(company);
    }

    if (req.method === 'GET') {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*, sectors(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(companies.map(c => ({
        ...c,
        sectorsCount: c.sectors?.length || 0,
        sectorsActive: c.sectors?.length || 0,
        status: 'active'
      })));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default requireAuth(handler);
