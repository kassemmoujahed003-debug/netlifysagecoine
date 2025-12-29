import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use 'any' for Database type to avoid strict type checking issues
// The strict Database type causes 'never' type errors with certain Supabase operations
type AnyDatabase = any

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Accept both NEXT_PUBLIC_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  // Don't throw during module load, handle in API routes instead
}

// Client-side Supabase client (use in components)
// Will be null if env vars are missing - check before using
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client (use in API routes)
// Creates a client with the anon key for RLS-enabled operations
export function createServerClient(): SupabaseClient<AnyDatabase> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  return createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Create a Supabase client with a user's access token
// Use this when you need to perform operations as a specific user (for RLS)
export async function createClientWithToken(accessToken: string): Promise<SupabaseClient<AnyDatabase>> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  
  // Create client with the access token in the Authorization header
  // This allows RLS policies to access auth.uid() via the JWT
  const client = createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
  
  // Verify the token is valid
  const { data: { user }, error } = await client.auth.getUser(accessToken)
  if (error || !user) {
    throw new Error(`Failed to authenticate token: ${error?.message || 'Unknown error'}`)
  }
  
  return client
}

// Create an admin Supabase client with service role key (server-side only)
// Use this for admin operations like auto-confirming users
// WARNING: Never expose the service role key to the client!
export function createAdminClient(): SupabaseClient<AnyDatabase> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }
  
  return createClient<AnyDatabase>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

