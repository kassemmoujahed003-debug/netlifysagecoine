import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// PATCH update VIP dashboard preview (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Build update object
    const updates: any = {}
    
    if (type !== undefined) {
      if (!['latest_signal', 'expert_insight'].includes(type)) {
        return NextResponse.json(
          { error: 'Invalid type. Must be "latest_signal" or "expert_insight"' },
          { status: 400 }
        )
      }
      updates.type = type
    }
    
    if (symbol !== undefined) updates.symbol = symbol
    if (action !== undefined) {
      if (action !== null && !['BUY', 'SELL'].includes(action)) {
        return NextResponse.json(
          { error: 'Invalid action. Must be "BUY" or "SELL"' },
          { status: 400 }
        )
      }
      updates.action = action
    }
    if (price !== undefined) updates.price = price
    if (text_en !== undefined) updates.text_en = text_en
    if (text_ar !== undefined) updates.text_ar = text_ar
    if (is_active !== undefined) updates.is_active = is_active

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Update preview
    const { data: preview, error } = await (adminCheck.supabase as any)
      .from('vip_dashboard_previews')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!preview) {
      return NextResponse.json(
        { error: 'Preview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ preview })

  } catch (error) {
    console.error('Update VIP dashboard preview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE VIP dashboard preview (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete preview
    const { error } = await (adminCheck.supabase as any)
      .from('vip_dashboard_previews')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete VIP dashboard preview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

