import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
