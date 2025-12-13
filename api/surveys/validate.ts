import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '../_supabaseServer';

/**
 * GET /api/surveys/validate?token=...
 * 
 * Valida se um link de pesquisa é válido e retorna metadados do setor/empresa.
 * Usado na tela de "Consentimento" do questionário.
 * 
 * Dependências SQL (database_setup.md):
 * - Tabela: public.surveys (campo access_code)
 * - Relacionamentos: surveys -> sectors -> companies
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validação de Método e Input
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, reason: 'missing_token' });
  }

  try {
    // 2. Busca no Supabase com Joins (Survey -> Sector -> Company)
    // O Supabase infere os relacionamentos baseados nas Foreign Keys definidas no SQL.
    const { data: survey, error } = await supabaseServer
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

    // 3. Verificação: Não Encontrado
    if (error || !survey) {
      console.warn(`[Validate] Token not found: ${token}`, error?.message);
      return res.status(400).json({ valid: false, reason: 'not_found' });
    }

    // 4. Verificação: Inativo (Desativado manualmente pelo consultor)
    if (survey.active === false) {
      return res.status(400).json({ valid: false, reason: 'inactive' });
    }

    // 5. Verificação: Expirado (Data limite ultrapassada)
    if (survey.expires_at) {
      const expirationDate = new Date(survey.expires_at);
      const now = new Date();
      if (now > expirationDate) {
        return res.status(400).json({ valid: false, reason: 'expired' });
      }
    }

    // 6. Sucesso: Extrair dados aninhados para resposta plana
    // Tratamento de tipos do Supabase (array vs objeto único dependendo da relação)
    const sectorData = Array.isArray(survey.sectors) ? survey.sectors[0] : survey.sectors;
    const companyData = sectorData?.companies; 
    
    // Fallback de segurança caso o join falhe
    const companyName = Array.isArray(companyData) ? companyData[0]?.name : companyData?.name;

    return res.status(200).json({
      valid: true,
      surveyId: survey.id, // ID interno para o POST das respostas
      companyName: companyName || 'Empresa não identificada',
      sectorName: sectorData?.name || 'Setor não identificado',
      populationEstimated: sectorData?.employees_count || 0
    });

  } catch (err: any) {
    console.error('[Validate] Critical error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}