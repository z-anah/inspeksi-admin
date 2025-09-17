import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sync is_signed with Supabase session on app start
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    localStorage.setItem('is_signed', 'true')
  } else {
    localStorage.removeItem('is_signed')
  }
})
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    localStorage.setItem('is_signed', 'true')
  } else {
    localStorage.removeItem('is_signed')
  }
})
