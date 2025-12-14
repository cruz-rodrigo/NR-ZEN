import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware';
import { supabaseAdmin } from '../_supabaseServer';

async function handler(req: AuthedRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const userId = req.user!.id;

  // 1. Total Companies
  const { count: companiesCount } = await supabaseAdmin
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 2. Active Sectors (Need to join companies)
  const { data: companies } = await supabaseAdmin
    .from('companies')
    .select('id')
    .eq('user_id', userId);

  let activeSectors = 0;
  let riskHighCount = 0;
  let totalSectorsAnalyzed = 0;

  if (companies && companies.length > 0) {
    const companyIds = companies.map(c => c.id);
    
    // Count sectors
    const { count: sectorsCount } = await supabaseAdmin
      .from('sectors')
      .select('*', { count: 'exact', head: true })
      .in('company_id', companyIds);
    
    activeSectors = sectorsCount || 0;

    // Get Analytics for risk
    const { data: analytics } = await supabaseAdmin
      .from('sector_analytics')
      .select('risk_level')
      .in('sector_id', 
        // Subquery workaround using JS array logic if needed, but here simple IN clause
        (await supabaseAdmin.from('sectors').select('id').in('company_id', companyIds)).data?.map(s => s.id) || []
      ); 

    if (analytics) {
      totalSectorsAnalyzed = analytics.length;
      riskHighCount = analytics.filter(a => a.risk_level === 'high').length;
    }
  }

  const riskHighPercent = totalSectorsAnalyzed > 0 
    ? Math.round((riskHighCount / totalSectorsAnalyzed) * 100) 
    : 0;

  return res.status(200).json({
    total: companiesCount || 0,
    activeSectors,
    responses: 142, // Mocked for now
    riskHighPercent
  });
}

export default requireAuth(handler);