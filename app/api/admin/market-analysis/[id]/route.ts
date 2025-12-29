import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'

// PATCH update market analysis section (admin only)
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
    const { image_url, title_en, title_ar, description_en, description_ar, display_order, is_active } = body

    // Build update object
    const updates: any = {}
    
    if (image_url !== undefined) updates.image_url = image_url
    if (title_en !== undefined) updates.title_en = title_en
    if (title_ar !== undefined) updates.title_ar = title_ar
    if (description_en !== undefined) updates.description_en = description_en
    if (description_ar !== undefined) updates.description_ar = description_ar
    if (display_order !== undefined) updates.display_order = display_order
    if (is_active !== undefined) updates.is_active = is_active

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Update section
    const { data: section, error } = await (adminCheck.supabase as any)
      .from('market_analysis_sections')
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

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ section })

  } catch (error) {
    console.error('Update market analysis section error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE market analysis section (admin only)
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

    // Delete section
    const { error } = await (adminCheck.supabase as any)
      .from('market_analysis_sections')
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
    console.error('Delete market analysis section error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

