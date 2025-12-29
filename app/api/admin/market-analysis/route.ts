import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// GET all market analysis sections (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all sections (including inactive), ordered by display_order
    const { data: sections, error } = await (adminCheck.supabase as any)
      .from('market_analysis_sections')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
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

// POST create new market analysis section (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { image_url, title_en, title_ar, description_en, description_ar, display_order, is_active } = body

    // Validate required fields
    if (!image_url || !title_en || !title_ar || !description_en || !description_ar) {
      return NextResponse.json(
        { error: 'Missing required fields: image_url, title_en, title_ar, description_en, description_ar' },
        { status: 400 }
      )
    }

    // Get current max display_order to set default
    const { data: maxSection } = await (adminCheck.supabase as any)
      .from('market_analysis_sections')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const newDisplayOrder = display_order !== undefined 
      ? display_order 
      : ((maxSection?.display_order || 0) + 1)

    // Insert new section
    const { data: section, error } = await (adminCheck.supabase as any)
      .from('market_analysis_sections')
      .insert({
        image_url,
        title_en,
        title_ar,
        description_en,
        description_ar,
        display_order: newDisplayOrder,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: error.message, details: error.details || error.hint || 'No additional details' },
        { status: 400 }
      )
    }

    return NextResponse.json({ section }, { status: 201 })

  } catch (error) {
    console.error('Create market analysis section error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

