import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import { hashPassword } from '../_authUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Missing token or password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // 1. Find Valid Token
    const { data: tokenRecord, error } = await supabaseServerClient
      .from('password_reset_tokens')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single();

    if (error || !tokenRecord) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (tokenRecord.used) {
      return res.status(400).json({ error: 'Token already used' });
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token expired' });
    }

    // 2. Hash New Password
    const passwordHash = await hashPassword(newPassword);

    // 3. Update User Password
    const { error: updateError } = await supabaseServerClient
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', tokenRecord.user_id);

    if (updateError) {
      console.error('Failed to update user password:', updateError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }

    // 4. Mark Token as Used
    await supabaseServerClient
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenRecord.id);

    return res.status(200).json({ message: 'Password reset successfully' });

  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}