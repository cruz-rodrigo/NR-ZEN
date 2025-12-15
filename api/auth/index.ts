import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import { hashPassword, comparePassword, signJwt, generateRefreshToken } from '../_authUtils.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  // --- LOGIN ---
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, password } = req.body;

    const { data: user, error } = await supabaseServerClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error: tokenError } = await supabaseServerClient
      .from('refresh_tokens')
      .insert([{ user_id: user.id, token: refreshToken, expires_at: expiresAt.toISOString(), revoked: false }]);

    if (tokenError) {
      console.error('Failed to save refresh token:', tokenError);
      return res.status(500).json({ error: 'Login session failed' });
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
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const { data: existing } = await supabaseServerClient
      .from('users').select('id').eq('email', email).maybeSingle();

    if (existing) return res.status(400).json({ error: 'User already exists' });

    const password_hash = await hashPassword(password);
    const { data, error } = await supabaseServerClient
      .from('users')
      .insert([{ name, email, password_hash, plan_tier: 'free' }])
      .select('id, email, name')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ user: data });
  }

  // --- REFRESH ---
  if (action === 'refresh') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh Token required' });

    const { data: storedToken, error } = await supabaseServerClient
      .from('refresh_tokens')
      .select('id, user_id, revoked, expires_at, users(*)')
      .eq('token', refreshToken)
      .single();

    if (error || !storedToken) return res.status(401).json({ error: 'Invalid Refresh Token' });
    if (storedToken.revoked) return res.status(401).json({ error: 'Token revoked' });
    if (new Date(storedToken.expires_at) < new Date()) return res.status(401).json({ error: 'Token expired' });

    const user = storedToken.users as any;
    await supabaseServerClient.from('refresh_tokens').update({ revoked: true }).eq('id', storedToken.id);

    const newAccessToken = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabaseServerClient.from('refresh_tokens').insert([{
      user_id: user.id, token: newRefreshToken, expires_at: expiresAt.toISOString(), revoked: false
    }]);

    return res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
  }

  // --- FORGOT PASSWORD ---
  if (action === 'forgot-password') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const { data: user } = await supabaseServerClient.from('users').select('id').eq('email', email).single();
    
    // Always return success security pattern
    if (!user) {
        return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await supabaseServerClient.from('password_reset_tokens').insert([{
      user_id: user.id, token: resetToken, expires_at: expiresAt.toISOString(), used: false
    }]);

    const resetLink = `https://${req.headers.host || 'nr-zen.vercel.app'}/#/reset-password?token=${resetToken}`;
    console.log(`[MOCK EMAIL] Password Reset Link: ${resetLink}`);

    return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  }

  // --- RESET PASSWORD ---
  if (action === 'reset-password') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Invalid request' });

    const { data: tokenRecord } = await supabaseServerClient
      .from('password_reset_tokens')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single();

    if (!tokenRecord || tokenRecord.used || new Date(tokenRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const passwordHash = await hashPassword(newPassword);
    await supabaseServerClient.from('users').update({ password_hash: passwordHash }).eq('id', tokenRecord.user_id);
    await supabaseServerClient.from('password_reset_tokens').update({ used: true }).eq('id', tokenRecord.id);

    return res.status(200).json({ message: 'Password reset successfully' });
  }

  return res.status(400).json({ error: 'Invalid action', availableActions: ['login', 'register', 'refresh', 'forgot-password', 'reset-password'] });
}