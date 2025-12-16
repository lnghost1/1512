import { createClient } from '@supabase/supabase-js';

// Helper para ler variáveis de ambiente de forma segura
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return String(import.meta.env[key]).trim();
    }
  } catch (e) {}

  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return String(process.env[key]).trim();
    }
  } catch (e) {}
  
  return '';
};

// Usa valores "placeholder" se as chaves não existirem, evitando que o app quebre ao iniciar.
// Os serviços (authService, historyService) verificam se é placeholder antes de tentar usar.
const supabaseUrl = (getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || 'https://placeholder.supabase.co').trim();
const supabaseKey = (getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || 'placeholder-key').trim();

export const supabase = createClient(supabaseUrl, supabaseKey);