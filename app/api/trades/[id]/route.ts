import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET trade by ID (VIP only, protected)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is VIP
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('joined_vip')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (!userProfile.joined_vip) {
      return NextResponse.json(
        { error: 'VIP access required' },
        { status: 403 }
      )
    }

    // Get trade (RLS ensures user can only see their own trades)
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (tradeError || !trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ trade })

  } catch (error) {
    console.error('Get trade error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

