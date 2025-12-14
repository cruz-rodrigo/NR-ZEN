import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_supabaseServer';
import { hashPassword } from '../_authUtils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Check if user exists
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const password_hash = await hashPassword(password);

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{ name, email, password_hash, plan_tier: 'free' }])
    .select('id, email, name')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ user: data });
}