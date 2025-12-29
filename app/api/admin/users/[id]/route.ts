import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Helper function to check admin access and get userSupabase client
async function checkAdminAndGetClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      userSupabase: null,
      user: null
    }
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createServerClient()

  // Verify the user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    console.error('[Admin Check] Auth error:', authError)
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', details: authError?.message },
        { status: 401 }
      ),
      userSupabase: null,
      user: null
    }
  }

  console.log('[Admin Check] Authenticated user ID:', user.id, 'Email:', user.email)

  // Create client with JWT token in Authorization header for RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      ),
      userSupabase: null,
      user: null
    }
  }
  
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

  // Check if user is admin using the client with token in headers
  const { data: userProfile, error: profileCheckError } = await (userSupabase as any)
    .from('users')
    .select('is_admin, user_type, email')
    .eq('id', user.id)
    .maybeSingle()
  
  const currentUserType = (userProfile as any)?.user_type
  const isAdminValue = (userProfile as any)?.is_admin
  const userEmail = (userProfile as any)?.email
  
  const isAdmin = 
    currentUserType === 'admin' || 
    isAdminValue === true || 
    isAdminValue === 'true' || 
    isAdminValue === 1 ||
    userEmail === 'admin@sagecoin.com'
  
  console.log('[Admin Check] user_type:', currentUserType, 'is_admin:', isAdminValue, 'email:', userEmail, 'isAdmin result:', isAdmin)
  
  if (profileCheckError) {
    console.error('[Admin Check] Profile check error:', profileCheckError)
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: profileCheckError.message },
        { status: 403 }
      ),
      userSupabase: null,
      user: null
    }
  }
  
  if (!userProfile) {
    console.error('[Admin Check] User profile not found')
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: 'User profile not found. Please ensure RLS policies allow access.' },
        { status: 403 }
      ),
      userSupabase: null,
      user: null
    }
  }
  
  if (!isAdmin) {
    console.error('[Admin Check] User is not admin. user_type:', currentUserType, 'is_admin:', isAdminValue)
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required', details: `User user_type: ${currentUserType}, is_admin: ${isAdminValue}` },
        { status: 403 }
      ),
      userSupabase: null,
      user: null
    }
  }

  console.log('[Admin Check] Admin access granted')
  return { error: null, userSupabase, user }
}

// GET single user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await checkAdminAndGetClient(request)
    
    if (adminCheck.error) {
      return adminCheck.error
    }

    const { userSupabase } = adminCheck

    // Get user by ID
    const { data: user, error: userError } = await (userSupabase as any)
      .from('users')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (userError) {
      console.error('[Get User] Error:', userError)
      return NextResponse.json(
        { error: userError.message || 'Failed to fetch user' },
        { status: userError.code === 'PGRST116' ? 404 : 400 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Determine user type
    let userType: 'admin' | 'user' | 'member' = 'user'
    if (user.user_type && ['admin', 'user', 'member'].includes(user.user_type)) {
      userType = user.user_type
    } else if (user.email === 'admin@sagecoin.com' || user.is_admin === true) {
      userType = 'admin'
    } else if (user.joined_vip === true || user.subscribed_to_courses === true) {
      userType = 'member'
    }
    
    // Transform to match frontend interface
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.email.split('@')[0],
      user_type: userType,
      type: userType === 'admin' ? 'admin' : (userType === 'member' ? 'member' : 'user'),
      joinedDate: user.created_at.split('T')[0],
      status: 'active' as 'active' | 'inactive',
      language: user.language,
      subscribed_to_courses: user.subscribed_to_courses,
      joined_vip: user.joined_vip,
      current_leverage: user.current_leverage,
      current_lot_size: user.current_lot_size,
      is_admin: user.is_admin || userType === 'admin',
    }

    return NextResponse.json({ user: transformedUser })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH update user (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await checkAdminAndGetClient(request)
    
    if (adminCheck.error) {
      return adminCheck.error
    }

    const { userSupabase } = adminCheck

    const body = await request.json()
    const { user_type, subscribed_to_courses, joined_vip, email } = body

    // Build update object
    const updates: any = {}
    
    // Update user_type (new system)
    if (body.user_type && ['admin', 'user', 'member'].includes(body.user_type)) {
      updates.user_type = body.user_type
      
      // When setting user_type, also update legacy fields for backward compatibility
      if (body.user_type === 'member') {
        updates.subscribed_to_courses = true
        updates.joined_vip = true
      } else if (body.user_type === 'user') {
        updates.subscribed_to_courses = false
        updates.joined_vip = false
      }
      // admin keeps existing subscribed_to_courses and joined_vip
    }
    
    // Legacy type mapping (for backward compatibility)
    if (body.type && !body.user_type) {
      if (body.type === 'vip' || body.type === 'member') {
        updates.user_type = 'member'
        updates.joined_vip = true
        updates.subscribed_to_courses = true
      } else if (body.type === 'subscriber') {
        updates.user_type = 'member'
        updates.subscribed_to_courses = true
        updates.joined_vip = false
      } else {
        updates.user_type = 'user'
        updates.subscribed_to_courses = false
        updates.joined_vip = false
      }
    }
    
    // Direct field updates
    if (typeof subscribed_to_courses === 'boolean') {
      updates.subscribed_to_courses = subscribed_to_courses
    }
    if (typeof joined_vip === 'boolean') {
      updates.joined_vip = joined_vip
    }
    if (email && typeof email === 'string') {
      // Note: Email update in auth.users would require Supabase admin API
      // For now, we only update the users table
      updates.email = email
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // First, check if the user exists before updating
    console.log('[Update User] Checking if user exists:', params.id)
    const { data: existingUser, error: checkError } = await (userSupabase as any)
      .from('users')
      .select('id, email, user_type, is_admin')
      .eq('id', params.id)
      .maybeSingle()

    if (checkError) {
      console.error('[Update User] Error checking user:', checkError)
      return NextResponse.json(
        { error: 'Failed to check user', details: checkError.message },
        { status: 400 }
      )
    }

    if (!existingUser) {
      console.error('[Update User] User not found:', params.id)
      return NextResponse.json(
        { error: 'User not found', details: `User with ID ${params.id} does not exist or you do not have permission to access it` },
        { status: 404 }
      )
    }

    console.log('[Update User] User found:', existingUser.email, 'Updating with:', updates)

    // Update user in database using the client with token in headers
    const { data: updatedUser, error: updateError } = await (userSupabase as any)
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select()
      .maybeSingle()

    if (updateError) {
      console.error('[Update User] Update error:', updateError)
      return NextResponse.json(
        { error: updateError.message || 'Failed to update user', details: updateError },
        { status: updateError.code === 'PGRST116' ? 404 : 400 }
      )
    }

    if (!updatedUser) {
      console.error('[Update User] Updated user not found after update:', params.id)
      return NextResponse.json(
        { error: 'User not found after update', details: 'Update may have succeeded but user could not be retrieved. Check RLS policies.' },
        { status: 404 }
      )
    }

    // Determine user type
    let userType: 'admin' | 'user' | 'member' = 'user'
    if (updatedUser.user_type && ['admin', 'user', 'member'].includes(updatedUser.user_type)) {
      userType = updatedUser.user_type
    } else if (updatedUser.email === 'admin@sagecoin.com' || updatedUser.is_admin === true) {
      userType = 'admin'
    } else if (updatedUser.joined_vip === true || updatedUser.subscribed_to_courses === true) {
      userType = 'member'
    }
    
    // Transform to match frontend interface
    const transformedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.email.split('@')[0],
      user_type: userType,
      type: userType === 'admin' ? 'admin' : (userType === 'member' ? 'member' : 'user'), // For backward compatibility
      joinedDate: updatedUser.created_at.split('T')[0],
      status: 'active' as 'active' | 'inactive',
    }

    return NextResponse.json({ user: transformedUser })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

