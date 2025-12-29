import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// GET all market intelligence items (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all items (including inactive), ordered by display_order
    const { data: items, error } = await (adminCheck.supabase as any)
      .from('market_intelligence')
      .select('*')
      .order('display_order', { ascending: true })
      .order('date', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ items: items || [] })

  } catch (error) {
    console.error('Get market intelligence items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new market intelligence item (admin only)
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
    const { title, impact, date, description, explanation, display_order, is_active } = body

    // Validate required fields
    if (!title || !impact || !date || !description || !explanation) {
      return NextResponse.json(
        { error: 'Missing required fields: title, impact, date, description, explanation' },
        { status: 400 }
      )
    }

    // Validate impact value
    if (!['High', 'Medium', 'Low'].includes(impact)) {
      return NextResponse.json(
        { error: 'Invalid impact value. Must be High, Medium, or Low' },
        { status: 400 }
      )
    }

    // Get current max display_order to set default
    const { data: maxItem } = await (adminCheck.supabase as any)
      .from('market_intelligence')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const newDisplayOrder = display_order !== undefined 
      ? display_order 
      : ((maxItem?.display_order || 0) + 1)

    // Insert new item
    const { data: item, error } = await (adminCheck.supabase as any)
      .from('market_intelligence')
      .insert({
        title,
        impact,
        date,
        description,
        explanation,
        display_order: newDisplayOrder,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: error.message, details: error.details || error.hint || 'No additional details' },
        { status: 400 }
      )
    }

    return NextResponse.json({ item }, { status: 201 })

  } catch (error) {
    console.error('Create market intelligence item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

