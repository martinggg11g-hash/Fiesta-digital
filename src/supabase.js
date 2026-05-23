import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// BUG-CRITICO-01: Proteger la creación del cliente de Supabase
if (!supabaseUrl || !supabaseKey) {
  throw new Error('[Fiesta] Faltan variables de entorno de Supabase. Revisá tu archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey)
