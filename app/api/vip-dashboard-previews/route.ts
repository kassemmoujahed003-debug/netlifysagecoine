import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// GET active VIP dashboard previews (public)
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create a fresh client for public access
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get all active previews, ordered by type
    const { data: previews, error } = await supabase
      .from('vip_dashboard_previews')
      .select('*')
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(10) // Limit to prevent too many results

    if (error) {
      console.error('Public API error:', error)
      return NextResponse.json(
        { error: error.message, details: error.details || error.hint },
        { status: 400 }
      )
    }

    return NextResponse.json({ previews: previews || [] })

  } catch (error) {
    console.error('Get VIP dashboard previews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

