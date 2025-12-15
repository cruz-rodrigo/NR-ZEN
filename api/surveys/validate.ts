import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, reason: 'missing_token' });
  }

  try {
    const { data: survey, error } = await supabaseServerClient
      .from('surveys')
      .select(`
        id,
        active,
        expires_at,
        sector_id,
        sectors (
          name,
          employees_count,
          companies (
            name
          )
        )
      `)
      .eq('access_code', token)
      .single();

    if (error || !survey) {
      console.warn(`[Validate] Token not found: ${token}`, error?.message);
      return res.status(400).json({ valid: false, reason: 'not_found' });
    }

    if (survey.active === false) {
      return res.status(400).json({ valid: false, reason: 'inactive' });
    }

    if (survey.expires_at) {
      const expirationDate = new Date(survey.expires_at);
      const now = new Date();
      if (now > expirationDate) {
        return res.status(400).json({ valid: false, reason: 'expired' });
      }
    }

    const sectorData = (Array.isArray(survey.sectors) ? survey.sectors[0] : survey.sectors) as any;
    const companyData = sectorData?.companies as any; 
    const companyName = Array.isArray(companyData) ? companyData[0]?.name : companyData?.name;

    return res.status(200).json({
      valid: true,
      surveyId: survey.id,
      companyName: companyName || 'Empresa não identificada',
      sectorName: sectorData?.name || 'Setor não identificado',
      populationEstimated: sectorData?.employees_count || 0
    });

  } catch (err: any) {
    console.error('[Validate] Critical error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}