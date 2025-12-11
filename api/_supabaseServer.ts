import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validação básica para evitar crash na chamada do createClient
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(supabaseUrl) && serviceRoleKey.length > 0;

if (!isConfigured) {
  // Apenas loga no console do servidor (Vercel Logs), não quebra a execução do arquivo
  console.error('CRITICAL: Supabase environment variables missing or invalid in _supabaseServer.ts');
}

// Exporta um cliente funcional ou um cliente "dummy" que não quebra a importação
// Se cair no dummy, as chamadas de API falharão graciosamente dentro dos handlers, não no boot.
export const supabaseServer = isConfigured
  ? createClient(supabaseUrl, serviceRoleKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');
