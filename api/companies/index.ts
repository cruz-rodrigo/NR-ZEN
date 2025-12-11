import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware';
import { supabaseServer } from '../_supabaseServer';

async function handler(req: AuthedRequest, res: VercelResponse) {
  const userId = req.user!.id;

  if (req.method === 'GET') {
    // Listar empresas
    const { data: companies, error } = await supabaseServer
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
    const { data: company, error: companyError } = await supabaseServer
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
      const { data: sector, error: sectorError } = await supabaseServer
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
         // Não retornamos erro 500 para não travar o fluxo, mas o setor falhou
       } else {
         // 3. (Opcional) Cria analytics vazio para não quebrar o dashboard
         await supabaseServer
           .from('sector_analytics')
           .insert([{
             sector_id: sector.id,
             risk_level: 'low', // Começa baixo até ter resposta
             score: 0
           }]);
       }
    }

    return res.status(201).json(company);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);