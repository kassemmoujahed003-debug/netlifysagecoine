import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// GET all active market analysis sections (public)
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

    // Get all active sections, ordered by display_order
    // Explicitly set a high limit to ensure we get all results
    const { data: sections, error, count } = await supabase
      .from('market_analysis_sections')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(100) // Set explicit limit to get all sections

    if (error) {
      console.error('Public API error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: error.message, details: error.details || error.hint },
        { status: 400 }
      )
    }

    console.log('Public API query result:')
    console.log('- Sections returned:', sections?.length || 0)
    console.log('- Total count:', count)
    console.log('- Error:', error)
    if (sections && sections.length > 0) {
      console.log('- Section IDs:', sections.map((s: any) => s.id))
      console.log('- Section display_orders:', sections.map((s: any) => s.display_order))
    }

    return NextResponse.json({ sections: sections || [] })

  } catch (error) {
    console.error('Get market analysis sections error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

