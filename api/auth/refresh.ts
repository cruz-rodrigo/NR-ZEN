import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import { signJwt, generateRefreshToken } from '../_authUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh Token required' });
  }

  try {
    // 1. Find token in DB
    const { data: storedToken, error } = await supabaseServerClient
      .from('refresh_tokens')
      .select('id, user_id, revoked, expires_at, users(*)')
      .eq('token', refreshToken)
      .single();

    if (error || !storedToken) {
      return res.status(401).json({ error: 'Invalid Refresh Token' });
    }

    // 2. Check Validity
    if (storedToken.revoked) {
      // Security: Reuse detection could trigger revoking all tokens for this user here.
      return res.status(401).json({ error: 'Token revoked' });
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    const user = storedToken.users as any; // Cast for TS

    // 3. Rotate Token: Revoke the old one
    await supabaseServerClient
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('id', storedToken.id);

    // 4. Generate New Tokens
    const newAccessToken = signJwt({ 
      sub: user.id, 
      email: user.email, 
      plan_tier: user.plan_tier 
    });

    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 5. Save New Refresh Token
    await supabaseServerClient
      .from('refresh_tokens')
      .insert([{
        user_id: user.id,
        token: newRefreshToken,
        expires_at: expiresAt.toISOString(),
        revoked: false
      }]);

    return res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (err: any) {
    console.error('Refresh error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}