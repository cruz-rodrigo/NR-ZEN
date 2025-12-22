
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDbConnection } from '../_supabaseServer.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, profile, source = 'teste-gratis' } = req.body;

  try {
    const supabase = checkDbConnection();

    const { error } = await supabase
      .from('leads')
      .insert([{ 
        name, 
        email, 
        profile, 
        source,
        metadata: { 
          ua: req.headers['user-agent'],
          ref: req.headers['referer']
        }
      }]);

    if (error) throw error;

    return res.status(201).json({ ok: true });
  } catch (err: any) {
    console.error('[Leads API Error]', err.message);
    // Retornamos 200/201 mesmo em erro para não quebrar o fluxo da demo no front
    return res.status(200).json({ ok: false, message: 'Lead not saved but proceeding' });
  }
}
