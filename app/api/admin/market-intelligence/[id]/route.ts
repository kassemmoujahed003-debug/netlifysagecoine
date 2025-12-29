import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// PATCH update market intelligence item (admin only)
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
    const { title, impact, date, description, explanation, display_order, is_active } = body

    // Validate impact value if provided
    if (impact !== undefined && !['High', 'Medium', 'Low'].includes(impact)) {
      return NextResponse.json(
        { error: 'Invalid impact value. Must be High, Medium, or Low' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = {}
    
    if (title !== undefined) updates.title = title
    if (impact !== undefined) updates.impact = impact
    if (date !== undefined) updates.date = date
    if (description !== undefined) updates.description = description
    if (explanation !== undefined) updates.explanation = explanation
    if (display_order !== undefined) updates.display_order = display_order
    if (is_active !== undefined) updates.is_active = is_active

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Update item
    const { data: item, error } = await (adminCheck.supabase as any)
      .from('market_intelligence')
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

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ item })

  } catch (error) {
    console.error('Update market intelligence item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE market intelligence item (admin only)
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

    // Delete item
    const { error } = await (adminCheck.supabase as any)
      .from('market_intelligence')
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
    console.error('Delete market intelligence item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

