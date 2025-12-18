
import { createClient } from "@supabase/supabase-js";

// Aceita tanto SUPABASE_SECRET_KEY quanto SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Inicializa o cliente apenas se as chaves existirem. 
export const supabaseServerClient = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Helper para validar a conexão antes de usar o cliente
 */
export function checkDbConnection() {
  if (!supabaseServerClient) {
    console.error("ERRO CRÍTICO: Variáveis do Supabase não encontradas.");
    console.log("URL:", !!supabaseUrl, "KEY:", !!supabaseServiceKey);
    throw new Error("Erro de Configuração: As chaves do Supabase não foram configuradas no ambiente do servidor.");
  }
  return supabaseServerClient;
}
