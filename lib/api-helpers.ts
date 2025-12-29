/**
 * Helper functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'

// Use 'any' for Database type to avoid strict type checking issues
type AnyDatabase = any

export interface AdminCheckResult {
  isAdmin: boolean
  user: { id: string; email: string | undefined } | null
  supabase: SupabaseClient<AnyDatabase>
  error?: NextResponse
}

/**
 * Check if the authenticated user is an admin
 * Returns the result with user info and supabase client
 * The supabase client includes the JWT token in headers for RLS policies
 */
export async function checkAdminAccess(request: NextRequest): Promise<AdminCheckResult> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
    return {
      isAdmin: false,
      user: null,
      supabase: createClient<AnyDatabase>(supabaseUrl || '', supabaseAnonKey || ''),
        error: NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        )
      }
    }

    return {
      isAdmin: false,
      user: null,
      supabase: createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey),
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      isAdmin: false,
      user: null,
      supabase: createClient<AnyDatabase>('', ''),
      error: NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
  }

  // Create a basic client to verify the token
  const basicSupabase = createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey)

  // Verify the user
  const { data: { user }, error: authError } = await basicSupabase.auth.getUser(token)

  if (authError || !user) {
    return {
      isAdmin: false,
      user: null,
      supabase: basicSupabase,
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  // Create client with JWT token in Authorization header for RLS
  // PostgREST will extract the JWT from the Authorization header for RLS policies
  const userSupabase = createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

  // Check if user is admin using the client with token in headers
  const { data: userProfile, error: profileCheckError } = await userSupabase
    .from('users')
    .select('is_admin, user_type, email')
    .eq('id', user.id)
    .maybeSingle()
  
  if (profileCheckError) {
    return {
      isAdmin: false,
      user: { id: user.id, email: user.email },
      supabase: userSupabase,
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: profileCheckError.message },
        { status: 403 }
      )
    }
  }

  if (!userProfile) {
    return {
      isAdmin: false,
      user: { id: user.id, email: user.email },
      supabase: userSupabase,
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: 'User profile not found. Please ensure RLS policies allow access.' },
        { status: 403 }
      )
    }
  }

  // Check if user is admin
  const userType = (userProfile as any)?.user_type
  const isAdminValue = (userProfile as any)?.is_admin
  const userEmail = (userProfile as any)?.email
  
  const isAdmin = 
    userType === 'admin' || 
    isAdminValue === true || 
    isAdminValue === 'true' || 
    isAdminValue === 1 ||
    isAdminValue === '1' ||
    userEmail === 'admin@sagecoin.com'
  
  if (!isAdmin) {
    return {
      isAdmin: false,
      user: { id: user.id, email: user.email },
      supabase: userSupabase,
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: `User user_type: ${userType}, is_admin: ${isAdminValue}` },
        { status: 403 }
      )
    }
  }

  // RLS is disabled on market_analysis_sections table, so we can use the regular client
  // We've already verified admin status, so this is safe
  return {
    isAdmin: true,
    user: { id: user.id, email: user.email },
    supabase: userSupabase
  }
}

