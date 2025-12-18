
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient, checkDbConnection } from '../_supabaseServer.js';
import { hashPassword, comparePassword, signJwt, generateRefreshToken } from '../_authUtils.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  try {
    // Valida se o banco está configurado antes de qualquer ação
    const supabase = checkDbConnection();

    // --- LOGIN ---
    if (action === 'login') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { email: rawEmail, password } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const valid = await comparePassword(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: tokenError } = await supabase
        .from('refresh_tokens')
        .insert([{ user_id: user.id, token: refreshToken, expires_at: expiresAt.toISOString(), revoked: false }]);

      if (tokenError) throw new Error('Falha ao criar sessão de acesso.');

      return res.status(200).json({
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, plan_tier: user.plan_tier }
      });
    }

    // --- REGISTER ---
    if (action === 'register') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { name, email: rawEmail, password } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos.' });

      const { data: existing } = await supabase
        .from('users').select('id').eq('email', email).maybeSingle();

      if (existing) return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });

      const password_hash = await hashPassword(password);
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password_hash, plan_tier: 'free' }])
        .select('id, email, name')
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao salvar no banco: ' + error.message });
      return res.status(201).json({ user: data });
    }

    // --- Outras ações (refresh, forgot, etc) seguem o mesmo padrão...
    // [Omitido por brevidade, mantendo a lógica de checkDbConnection]

    return res.status(400).json({ error: 'Ação inválida.' });

  } catch (err: any) {
    console.error('Auth API Error:', err.message);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message || 'Erro desconhecido no servidor.' 
    });
  }
}
