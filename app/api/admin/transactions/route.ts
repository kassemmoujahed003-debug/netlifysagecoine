import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/api-helpers'

// GET all transactions (admin only)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'password_change', 'withdrawal', 'deposit', or null for all
    const status = searchParams.get('status') // 'pending', 'done', 'rejected', or null for all

    // Build query - select all columns (status will be included if migration was run)
    let query = (adminCheck.supabase as any)
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // Check if error is due to missing status column
      if (error.message?.includes('column') && error.message?.includes('status')) {
        return NextResponse.json(
          { 
            error: 'Status column not found',
            details: 'Please run the SQL migration: supabase/add_transaction_status.sql',
            hint: 'The status column needs to be added to the transactions table'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch transactions',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    // Get user emails separately (more reliable than join)
    const transactionsWithUsers = await Promise.all(
      (transactions || []).map(async (tx: any) => {
        let userEmail = 'Unknown'
        if (tx.user_id) {
          try {
            const { data: userData } = await (adminCheck.supabase as any)
              .from('users')
              .select('email')
              .eq('id', tx.user_id)
              .maybeSingle()
            userEmail = userData?.email || 'Unknown'
          } catch (e) {
            console.error('Error fetching user email:', e)
          }
        }
        return {
          ...tx,
          userEmail,
        }
      })
    )

    // Format transactions with user info
    const formattedTransactions = transactionsWithUsers.map((tx: any) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status || 'pending', // Default to pending if status column doesn't exist
      data: tx.data,
      createdAt: tx.created_at,
      updatedAt: tx.updated_at,
      userId: tx.user_id,
      userEmail: tx.userEmail || 'Unknown',
    }))

    return NextResponse.json({ transactions: formattedTransactions })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

