import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import { comparePassword, signJwt, generateRefreshToken } from '../_authUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  const { data: user, error } = await supabaseServerClient
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 1. Generate Access Token (Short-lived)
  const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });

  // 2. Generate Refresh Token (Long-lived: 7 days)
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // 3. Save Refresh Token to DB
  const { error: tokenError } = await supabaseServerClient
    .from('refresh_tokens')
    .insert([{
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt.toISOString(),
      revoked: false
    }]);

  if (tokenError) {
    console.error('Failed to save refresh token:', tokenError);
    return res.status(500).json({ error: 'Login session failed' });
  }

  return res.status(200).json({
    token,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_tier: user.plan_tier
    }
  });
}