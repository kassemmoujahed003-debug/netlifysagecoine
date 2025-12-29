import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { leverage } = body

    if (typeof leverage !== 'number' || leverage < 1 || leverage > 1000) {
      return NextResponse.json(
        { error: 'Leverage must be a number between 1 and 1000' },
        { status: 400 }
      )
    }

    const { data: profile, error: updateError } = await supabase
      .from('users')
      .update({ current_leverage: leverage })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      leverage: profile.current_leverage,
      profile 
    })

  } catch (error) {
    console.error('Update leverage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

