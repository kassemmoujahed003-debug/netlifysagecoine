import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// GET all VIP dashboard previews (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all previews (including inactive), ordered by type and created_at
    const { data: previews, error } = await (adminCheck.supabase as any)
      .from('vip_dashboard_previews')
      .select('*')
      .order('type', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
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

// POST create new VIP dashboard preview (admin only)
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
    const { type, symbol, action, price, text_en, text_ar, is_active } = body

    // Validate required fields based on type
    if (!type || !['latest_signal', 'expert_insight'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "latest_signal" or "expert_insight"' },
        { status: 400 }
      )
    }

    if (type === 'latest_signal') {
      if (!symbol || !action || !price) {
        return NextResponse.json(
          { error: 'Missing required fields for latest_signal: symbol, action, price' },
          { status: 400 }
        )
      }
      if (!['BUY', 'SELL'].includes(action)) {
        return NextResponse.json(
          { error: 'Invalid action. Must be "BUY" or "SELL"' },
          { status: 400 }
        )
      }
    } else if (type === 'expert_insight') {
      if (!text_en || !text_ar) {
        return NextResponse.json(
          { error: 'Missing required fields for expert_insight: text_en, text_ar' },
          { status: 400 }
        )
      }
    }

    // Insert new preview
    const { data: preview, error } = await (adminCheck.supabase as any)
      .from('vip_dashboard_previews')
      .insert({
        type,
        symbol: type === 'latest_signal' ? symbol : null,
        action: type === 'latest_signal' ? action : null,
        price: type === 'latest_signal' ? price : null,
        text_en: type === 'expert_insight' ? text_en : null,
        text_ar: type === 'expert_insight' ? text_ar : null,
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

    return NextResponse.json({ preview }, { status: 201 })

  } catch (error) {
    console.error('Create VIP dashboard preview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

