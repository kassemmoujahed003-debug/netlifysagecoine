import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/api-helpers'

// PATCH - Update transaction status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (adminCheck.error) {
      return adminCheck.error
    }

    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, adminNotes } = body

    // Validate status
    if (!status || !['pending', 'done', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, done, or rejected' },
        { status: 400 }
      )
    }

    // Update transaction
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    // Add admin notes to data if provided
    if (adminNotes) {
      const { data: existingTx } = await (adminCheck.supabase as any)
        .from('transactions')
        .select('data')
        .eq('id', params.id)
        .single()

      if (existingTx) {
        updateData.data = {
          ...existingTx.data,
          adminNotes,
          statusUpdatedAt: new Date().toISOString(),
          statusUpdatedBy: adminCheck.user?.id,
        }
      }
    }

    const { data: transaction, error } = await (adminCheck.supabase as any)
      .from('transactions')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ transaction })

  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

