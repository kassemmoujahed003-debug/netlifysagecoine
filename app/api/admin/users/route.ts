import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { Database } from '@/types/database'

// GET all users (admin only)
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

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('[Admin Check] Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message },
        { status: 401 }
      )
    }

    console.log('[Admin Check] Authenticated user ID:', user.id, 'Email:', user.email)

    // Check if user is admin
    // For RLS to work, we need to pass the JWT token in the Authorization header
    // Create a new client instance with the token in headers
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Create client with JWT token in Authorization header for RLS
    // PostgREST will extract the JWT from the Authorization header for RLS policies
    const userSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
    
    console.log('[Admin Check] Created Supabase client with token in headers')
    
    // Now try to get the profile - RLS should use the JWT from the Authorization header
    console.log('[Admin Check] Querying user profile for ID:', user.id)
    const { data: userProfile, error: profileCheckError } = await (userSupabase as any)
      .from('users')
      .select('id, email, is_admin, user_type')
      .eq('id', user.id)
      .maybeSingle()
    
    console.log('[Admin Check] Query result - Profile:', JSON.stringify(userProfile, null, 2))
    console.log('[Admin Check] Query error:', profileCheckError)
    
    // Debug logging
    console.log('[Admin Check] User ID:', user.id)
    console.log('[Admin Check] User Email:', user.email)
    console.log('[Admin Check] User Profile:', JSON.stringify(userProfile, null, 2))
    console.log('[Admin Check] Profile Error:', profileCheckError)
    
    if (profileCheckError) {
      console.error('[Admin Check] Error fetching profile:', profileCheckError)
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', details: profileCheckError.message },
        { status: 403 }
      )
    }
    
    if (!userProfile) {
      console.error('[Admin Check] User profile not found for user ID:', user.id)
      // If profile not found, try using service role or direct query
      // For now, reject the request
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', details: 'User profile not found. Please ensure RLS policies allow access.' },
        { status: 403 }
      )
    }
    
    // Check if user is admin (check user_type first, then fallback to is_admin)
    const userType = (userProfile as any)?.user_type
    const isAdminValue = (userProfile as any)?.is_admin
    const userEmail = (userProfile as any)?.email
    
    // Check admin status: user_type === 'admin' OR is_admin === true OR email === 'admin@sagecoin.com'
    const isAdmin = 
      userType === 'admin' || 
      isAdminValue === true || 
      isAdminValue === 'true' || 
      isAdminValue === 1 || 
      isAdminValue === '1' ||
      userEmail === 'admin@sagecoin.com'
    
    console.log('[Admin Check] user_type:', userType, 'is_admin:', isAdminValue, 'email:', userEmail, 'isAdmin result:', isAdmin)
    
    if (!isAdmin) {
      console.error('[Admin Check] User is not admin. user_type:', userType, 'is_admin:', isAdminValue)
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', details: `User user_type: ${userType}, is_admin: ${isAdminValue}` },
        { status: 403 }
      )
    }
    
    console.log('[Admin Check] Admin access granted')

    // Get all users with their profiles
    // Use the same userSupabase client that has the user's session
    const { data: users, error: usersError } = await (userSupabase as any)
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      return NextResponse.json(
        { error: usersError.message },
        { status: 400 }
      )
    }

    // Transform users to match frontend interface
    const transformedUsers = (users || []).map((user: any) => {
      // Determine user type: use user_type if available, otherwise derive from legacy fields
      let userType: 'admin' | 'user' | 'member' = 'user'
      if (user.user_type && ['admin', 'user', 'member'].includes(user.user_type)) {
        userType = user.user_type
      } else if (user.email === 'admin@sagecoin.com' || user.is_admin === true) {
        userType = 'admin'
      } else if (user.joined_vip === true || user.subscribed_to_courses === true) {
        userType = 'member'
      }
      
      return {
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0], // Use email prefix as name for now
        user_type: userType,
        type: userType === 'admin' ? 'admin' : (userType === 'member' ? 'member' : 'user'), // For backward compatibility
        joinedDate: user.created_at.split('T')[0], // Extract date part
        status: 'active' as 'active' | 'inactive',
        // Include additional fields
        language: user.language,
        subscribed_to_courses: user.subscribed_to_courses,
        joined_vip: user.joined_vip,
        current_leverage: user.current_leverage,
        current_lot_size: user.current_lot_size,
        is_admin: user.is_admin || userType === 'admin',
      }
    })

    return NextResponse.json({ users: transformedUsers })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

