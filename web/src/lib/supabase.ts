import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key'

if (!isConfigured) {
  console.warn(
    'Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
  )
}

// Use a dummy URL when credentials are missing so the client module can still
// be imported and the React tree can mount for local UI verification.
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'http://localhost',
  isConfigured ? supabaseAnonKey : 'dummy-anon-key',
)

export type Profile = {
  id: string
  email: string
  microbiology_level: string | null
  focus_area: string | null
  default_mode: string | null
  created_at: string
  updated_at: string
}

export type ExperimentAttempt = {
  id: string
  user_id: string
  experiment_name: string
  score: number
  procedural_accuracy: number
  decision_accuracy: number
  interpretation_accuracy: number
  mode: 'learn' | 'test'
  completed_at: string
  created_at: string
}
