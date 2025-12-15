import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware.js';
import { supabaseServerClient } from '../_supabaseServer.js';

async function handler(req: AuthedRequest, res: VercelResponse) {
  const userId = req.user!.id;
  const { mode } = req.query;

  // --- DASHBOARD STATS (Consolidated) ---
  if (req.method === 'GET' && mode === 'stats') {
    // 1. Total Companies
    const { count: companiesCount } = await supabaseServerClient
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 2. Active Sectors (Need to join companies)
    const { data: companies } = await supabaseServerClient
      .from('companies')
      .select('id')
      .eq('user_id', userId);

    let activeSectors = 0;
    let riskHighCount = 0;
    let totalSectorsAnalyzed = 0;

    if (companies && companies.length > 0) {
      const companyIds = companies.map(c => c.id);
      
      // Count sectors
      const { count: sectorsCount } = await supabaseServerClient
        .from('sectors')
        .select('*', { count: 'exact', head: true })
        .in('company_id', companyIds);
      
      activeSectors = sectorsCount || 0;

      // Get Analytics for risk
      const { data: analytics } = await supabaseServerClient
        .from('sector_analytics')
        .select('risk_level')
        .in('sector_id', 
          (await supabaseServerClient.from('sectors').select('id').in('company_id', companyIds)).data?.map(s => s.id) || []
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

  // --- STANDARD COMPANIES CRUD ---

  if (req.method === 'GET') {
    // Listar empresas
    const { data: companies, error } = await supabaseServerClient
      .from('companies')
      .select('*, sectors(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const enriched = companies.map(c => ({
      ...c,
      sectorsCount: c.sectors ? c.sectors.length : 0,
      sectorsActive: c.sectors ? c.sectors.length : 0, // Por enquanto 100% ativo
      lastCollection: 'Aguardando Coleta',
      status: 'active' // Default visual
    }));

    return res.status(200).json(enriched);
  }

  if (req.method === 'POST') {
    const { name, cnpj, firstSectorName, employeesCount } = req.body;
    
    if (!name || !cnpj) {
        return res.status(400).json({ error: "Nome e CNPJ obrigatórios" });
    }

    // 1. Criar Empresa
    const { data: company, error: companyError } = await supabaseServerClient
      .from('companies')
      .insert([{ 
          user_id: userId,
          name, 
          cnpj,
          status: 'active'
      }])
      .select()
      .single();

    if (companyError) return res.status(500).json({ error: companyError.message });

    // 2. Se tiver setor inicial (vindo do Onboarding), cria o setor
    if (firstSectorName) {
      const { data: sector, error: sectorError } = await supabaseServerClient
        .from('sectors')
        .insert([{
          company_id: company.id,
          name: firstSectorName,
          employees_count: employeesCount ? parseInt(employeesCount) : 0
        }])
        .select()
        .single();

       if (sectorError) {
         console.error("Erro ao criar setor:", sectorError);
       } else {
         // 3. (Opcional) Cria analytics vazio
         await supabaseServerClient
           .from('sector_analytics')
           .insert([{
             sector_id: sector.id,
             risk_level: 'low',
             score: 0
           }]);
       }
    }

    return res.status(201).json(company);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);