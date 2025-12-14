import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Em ambiente serverless, lançar erro aqui previne execução com config quebrada
  throw new Error("Supabase URL ou SECRET KEY não configurados nas variáveis de ambiente.");
}

// Exporta como supabaseAdmin conforme solicitado
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);