import type { VercelResponse } from '@vercel/node';
import { AuthedRequest, requireAuth } from '../_authMiddleware.js';
import { checkDbConnection } from '../_supabaseServer.js';

async function handler(req: AuthedRequest, res: VercelResponse) {
  const userId = req.user!.id;

  try {
    const supabase = checkDbConnection();

    // GET: List plans for a specific sector
    if (req.method === 'GET') {
      const { sector_id } = req.query;

      if (!sector_id || typeof sector_id !== 'string') {
        return res.status(400).json({ error: 'sector_id is required' });
      }

      // Security Check: Ensure sector belongs to a company owned by user
      const { data: sector, error: secError } = await supabase
        .from('sectors')
        .select('company_id, companies(user_id)')
        .eq('id', sector_id)
        .single();

      // Check strict ownership
      const company = sector?.companies as any;
      if (secError || !company || company.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to this sector' });
      }

      const { data: plans, error } = await supabase
        .from('action_plans')
        .select('*')
        .eq('sector_id', sector_id)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(plans);
    }

    // POST: Create a new action plan item
    if (req.method === 'POST') {
      const { sector_id, domain, risk, action, responsible, deadline, status } = req.body;

      if (!sector_id || !domain || !action) {
        return res.status(400).json({ error: "Missing required fields (sector_id, domain, action)" });
      }

      // Security Check
      const { data: sector, error: secError } = await supabase
        .from('sectors')
        .select('company_id, companies(user_id)')
        .eq('id', sector_id)
        .single();

      const company = sector?.companies as any;
      if (secError || !company || company.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to this sector' });
      }

      const { data: plan, error } = await supabase
        .from('action_plans')
        .insert([{
          sector_id,
          domain,
          risk,
          action,
          responsible,
          deadline,
          status: status || 'Pendente'
        }])
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(201).json(plan);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}

export default requireAuth(handler);