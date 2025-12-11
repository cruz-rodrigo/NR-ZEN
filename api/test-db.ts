import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Define tipos para o debug
interface EnvDebug {
  nodeEnv: string;
  hasUrl: boolean;
  urlPreview: string;
  hasKey: boolean;
  keyLength: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Diagnóstico das Variáveis de Ambiente (Vercel Environment Variables)
  // Nota: No Vercel, usamos process.env. 
  // O prefixo VITE_ serve para o frontend, mas aqui no backend (Node) funciona se você definiu assim no painel.
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const debug: EnvDebug = {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    hasUrl: !!supabaseUrl,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'VAZIO',
    hasKey: !!supabaseKey,
    keyLength: supabaseKey ? supabaseKey.length : 0
  };

  // 2. Se faltar variável, retorna erro amigável (JSON) em vez de quebrar (HTML 500)
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ // Retorna 200 para o front conseguir ler o JSON de erro
      status: 'config_error',
      message: 'Configuração Incompleta no Vercel',
      details: 'As variáveis de ambiente não foram encontradas.',
      instruction: 'Vá em Settings > Environment Variables no Vercel e adicione VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
      debug
    });
  }

  // 3. Tenta conectar ao Supabase de forma isolada
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // 4. Teste real: Conta quantos usuários existem na tabela 'users' (do seu diagrama)
    // Usamos count: 'exact', head: true para ser rápido e não trazer dados sensíveis
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(200).json({
        status: 'connection_error',
        message: 'Variáveis existem, mas o Supabase recusou a conexão.',
        details: error.message,
        hint: 'Verifique se a SUPABASE_SERVICE_ROLE_KEY está correta (não use a anon key) e se a tabela "users" existe.',
        debug
      });
    }

    // 5. Sucesso Total
    return res.status(200).json({
      status: 'success',
      message: 'CONEXÃO BEM SUCEDIDA!',
      details: `O backend acessou o banco e encontrou ${count} registros na tabela 'users'.`,
      debug
    });

  } catch (err: any) {
    // 6. Captura erros de execução (ex: URL mal formada)
    return res.status(200).json({
      status: 'crash_error',
      message: 'Ocorreu um erro crítico ao tentar inicializar o cliente Supabase.',
      details: err.message,
      debug
    });
  }
}