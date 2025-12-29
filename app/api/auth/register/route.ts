import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Import and check Supabase client
    const { supabase, createAdminClient } = await import('@/lib/supabase')
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Server configuration error: Supabase is not properly configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, password, language } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          language: language || 'en'
        } as Record<string, any>
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      
      // Provide more helpful error messages
      let errorMessage = authError.message
      if (authError.message?.includes('Invalid API key') || authError.message?.includes('JWT')) {
        errorMessage = 'Invalid API key. Please check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. Make sure you\'re using the "anon public" key from Supabase dashboard.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Auto-confirm the user's email so they can log in immediately
    // This bypasses email confirmation requirement
    let emailConfirmed = false
    try {
      const adminClient = createAdminClient()
      const { error: confirmError } = await adminClient.auth.admin.updateUserById(
        authData.user.id,
        { 
          email_confirm: true,
          // Also ensure the user is active
          ban_duration: 'none'
        }
      )
      
      if (confirmError) {
        console.error('Failed to auto-confirm user email:', confirmError.message)
        // If confirmation fails, we should still try to proceed, but log the error
        // The user might still be able to log in if email confirmation is disabled in Supabase settings
      } else {
        console.log('User email auto-confirmed successfully for:', email)
        emailConfirmed = true
        // Small delay to ensure the confirmation is processed
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (adminError) {
      // If service role key is not set, log error but continue
      const errorMessage = adminError instanceof Error ? adminError.message : 'Unknown error'
      console.error('Could not auto-confirm user (service role key may not be set):', errorMessage)
      console.error('Please set SUPABASE_SERVICE_ROLE_KEY in your .env file to enable automatic email confirmation.')
      // Continue - user registration still succeeds, but they may need to confirm email manually
      // or email confirmation might be disabled in Supabase settings
    }

    // Get a fresh session after confirmation
    let session = authData.session
    if (!session) {
      // If no session was returned, try to sign in to get one
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (!signInError && signInData.session) {
          session = signInData.session
        }
      } catch (signInErr) {
        console.warn('Could not get session after signup:', signInErr)
      }
    }

    // Update user profile with language preference and user_type (if provided)
    // Note: The database trigger handle_new_user() will automatically create the profile
    // Set default user_type to 'user' for new registrations
    try {
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ 
          user_type: 'user', // Default to 'user' for new registrations
          language: language || 'en' 
        })
        .eq('id', authData.user.id)
      
      if (updateError) {
        console.warn('Could not update user_type:', updateError.message)
      }
    } catch (updateErr) {
      console.warn('Error updating user profile:', updateErr)
    }

    // Get updated user profile
    const { data: userProfile } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    // Return user data (without sensitive info)
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        user_type: userProfile?.user_type || 'user',
        ...(userProfile as object || {})
      },
      session: session,
      message: 'User registered successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

