import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Diagnóstico das Variáveis de Ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

  const debug = {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    hasUrl: !!supabaseUrl,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'VAZIO',
    hasKey: !!supabaseKey,
    keyLength: supabaseKey ? supabaseKey.length : 0
  };

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      status: 'config_error',
      message: 'Variáveis de Ambiente ausentes no Vercel.',
      details: 'Vá em Settings > Environment Variables. Adicione NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.',
      debug
    });
  }

  // Inicializa cliente isolado para o teste
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // --- MODO TESTE DE ESCRITA (POST) ---
  if (req.method === 'POST') {
    const testEmail = `test_write_${Date.now()}@nrzen.dev`;
    try {
      // Tenta Inserir
      const { data, error: insertError } = await supabase.from('users').insert([{
        name: 'Teste de Gravação Automático',
        email: testEmail,
        password_hash: 'hash_teste_temporario',
        plan_tier: 'free'
      }]).select();

      if (insertError) throw insertError;

      // Tenta Deletar (Limpeza)
      const { error: deleteError } = await supabase.from('users').delete().eq('email', testEmail);
      if (deleteError) console.warn("Falha ao limpar usuário de teste:", deleteError);

      return res.status(200).json({
        status: 'success',
        message: 'GRAVAÇÃO BEM SUCEDIDA!',
        details: 'O sistema criou e removeu um usuário de teste na tabela "users". O banco está 100% operacional.',
        debug
      });

    } catch (err: any) {
      const isTableMissing = err.message?.includes('relation') && err.message?.includes('does not exist');
      
      return res.status(200).json({
        status: isTableMissing ? 'missing_table' : 'write_error',
        message: isTableMissing ? 'Tabela não encontrada' : 'Erro ao gravar dados',
        details: err.message || JSON.stringify(err),
        debug
      });
    }
  }

  // --- MODO DIAGNÓSTICO DE LEITURA (GET) ---
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return res.status(200).json({
          status: 'missing_table',
          message: 'As tabelas não existem no Supabase.',
          details: 'Você conectou corretamente, mas o banco está vazio. Copie o SQL da tela e rode no SQL Editor do Supabase.',
          debug
        });
      }

      return res.status(200).json({
        status: 'connection_error',
        message: 'Conectou, mas houve erro ao ler dados.',
        details: error.message,
        debug
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'LEITURA BEM SUCEDIDA!',
      details: `Conexão estabelecida. Tabela 'users' encontrada com ${count} registros.`,
      debug
    });

  } catch (err: any) {
    return res.status(200).json({
      status: 'crash_error',
      message: 'Erro crítico no teste.',
      details: err.message,
      debug
    });
  }
}