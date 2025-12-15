import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    // 1. Find User
    const { data: user, error } = await supabaseServerClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    // Security: Always return success even if user not found to prevent enumeration
    if (error || !user) {
      console.log('Forgot password request for non-existent email:', email);
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // 2. Generate Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 Hour expiry

    // 3. Save to DB
    const { error: tokenError } = await supabaseServerClient
      .from('password_reset_tokens')
      .insert([{
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false
      }]);

    if (tokenError) {
      console.error('Failed to save reset token:', tokenError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // 4. Send Email (Mock)
    const resetLink = `https://${req.headers.host || 'nr-zen.vercel.app'}/#/reset-password?token=${resetToken}`;
    
    console.log('===========================================================');
    console.log(`[MOCK EMAIL] Password Reset for ${email}`);
    console.log(`Link: ${resetLink}`);
    console.log('===========================================================');

    return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });

  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}