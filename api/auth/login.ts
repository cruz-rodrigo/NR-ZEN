import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '../_supabaseServer';
import { comparePassword, signJwt } from '../_authUtils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  const { data: user, error } = await supabaseServer
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

  const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_tier: user.plan_tier
    }
  });
}