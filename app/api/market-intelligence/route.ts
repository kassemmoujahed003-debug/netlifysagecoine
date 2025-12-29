import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// GET all active market intelligence items (public)
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

    // Get all active items, ordered by display_order and date
    const { data: items, error } = await supabase
      .from('market_intelligence')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('date', { ascending: false })
      .limit(100) // Set explicit limit

    if (error) {
      console.error('Public API error:', error)
      return NextResponse.json(
        { error: error.message, details: error.details || error.hint },
        { status: 400 }
      )
    }

    return NextResponse.json({ items: items || [] })

  } catch (error) {
    console.error('Get market intelligence error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

