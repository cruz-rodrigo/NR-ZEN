
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDbConnection } from '../_supabaseServer.js';
import { hashPassword, comparePassword, signJwt, generateRefreshToken } from '../_authUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  try {
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
        .insert([{ 
          user_id: user.id, 
          token: refreshToken, 
          expires_at: expiresAt.toISOString(), 
          revoked: false 
        }]);

      if (tokenError) {
        console.error("Erro ao salvar refresh token:", tokenError);
        return res.status(500).json({ error: 'Falha ao criar sessão de acesso.' });
      }

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
        .insert([{ name, email, password_hash, plan_tier: 'trial' }])
        .select('id, email, name')
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao salvar no banco: ' + error.message });
      return res.status(201).json({ user: data });
    }

    // --- REFRESH TOKEN ---
    if (action === 'refresh') {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Token necessário.' });

      const { data: storedToken, error } = await supabase
        .from('refresh_tokens')
        .select('*, users(*)')
        .eq('token', refreshToken)
        .eq('revoked', false)
        .single();

      if (error || !storedToken || new Date(storedToken.expires_at) < new Date()) {
        return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
      }

      const user = storedToken.users as any;
      const newToken = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });

      return res.status(200).json({ token: newToken, refreshToken });
    }

    return res.status(400).json({ error: 'Ação inválida.' });

  } catch (err: any) {
    console.error('API Error:', err.message);
    return res.status(500).json({ 
      error: 'Erro Interno', 
      message: err.message || 'Erro inesperado no servidor.' 
    });
  }
}
