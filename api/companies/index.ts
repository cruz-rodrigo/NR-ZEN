import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware';
import { supabaseServer } from '../_supabaseServer';

async function handler(req: AuthedRequest, res: VercelResponse) {
  const userId = req.user!.id;

  if (req.method === 'GET') {
    // Listar empresas
    const { data: companies, error } = await supabaseServer
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Adaptar snake_case do banco para camelCase/Interface do front se necessário
    // Por enquanto, o front Company interface aceita propriedades compatíveis
    // Vamos adicionar os campos calculados como mock ou null por enquanto
    const enriched = companies.map(c => ({
      ...c,
      sectorsCount: 0, // TODO: Fazer count real via join
      sectorsActive: 0,
      lastCollection: 'N/A'
    }));

    return res.status(200).json(enriched);
  }

  if (req.method === 'POST') {
    // Criar empresa
    const { name, cnpj } = req.body;
    
    if (!name || !cnpj) {
        return res.status(400).json({ error: "Nome e CNPJ obrigatórios" });
    }

    const { data, error } = await supabaseServer
      .from('companies')
      .insert([{ 
          user_id: userId,
          name, 
          cnpj,
          status: 'active'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);