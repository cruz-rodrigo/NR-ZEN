import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_supabaseServer.js';
import { hashPassword } from '../_authUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas método POST é permitido
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // 1. Verificar se usuário já existe usando supabaseServerClient
    // Usamos maybeSingle() para não estourar erro se não encontrar (retorna null)
    const { data: existing } = await supabaseServerClient
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Hash da senha
    const password_hash = await hashPassword(password);

    // 3. Inserir novo usuário usando supabaseServerClient
    const { data, error } = await supabaseServerClient
      .from('users')
      .insert([{ name, email, password_hash, plan_tier: 'free' }])
      .select('id, email, name')
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Sucesso
    return res.status(201).json({ user: data });

  } catch (err: any) {
    console.error('Register API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}