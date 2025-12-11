import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from './_supabaseServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Tenta fazer uma query simples. Se a tabela 'users' não existir, vai dar erro.
    // Usamos count para ser leve.
    const { count, error } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Conexão com Supabase falhou ou tabela não existe.',
        details: error.message 
      });
    }

    return res.status(200).json({ 
      status: 'success', 
      message: 'Conexão com Banco de Dados estabelecida com sucesso!',
      userCount: count 
    });

  } catch (err: any) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Erro interno no servidor.',
      details: err.message 
    });
  }
}