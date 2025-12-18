
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || "";

// Inicializa o cliente apenas se as chaves existirem. 
// Caso contrário, exportamos null e tratamos no handler.
export const supabaseServerClient = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Helper para validar a conexão antes de usar o cliente
 */
export function checkDbConnection() {
  if (!supabaseServerClient) {
    throw new Error("Erro de Configuração: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SECRET_KEY não encontradas.");
  }
  return supabaseServerClient;
}
