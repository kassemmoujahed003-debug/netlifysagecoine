import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET active trades (VIP only, protected)
export async function GET(request: NextRequest) {
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

    // Get user's active trades
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'OPEN')
      .order('timestamp', { ascending: false })

    if (tradesError) {
      return NextResponse.json(
        { error: tradesError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ trades })

  } catch (error) {
    console.error('Get trades error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

