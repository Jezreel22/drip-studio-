import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Creates an Administrative Supabase client using the SERVICE ROLE KEY.
 * 
 * CRITICAL SECURITY RULES:
 * 1. MUST ONLY be imported in server-side modules (Route Handlers, Server Actions, trusted server utils).
 * 2. NEVER import or reference this client in Client Components or client-side bundles.
 * 3. SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security (RLS). Use with extreme caution.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables.')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
