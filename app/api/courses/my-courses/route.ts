import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET user's accessible courses (protected)
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

    // Check if user is subscribed to courses
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('subscribed_to_courses, language')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (!userProfile.subscribed_to_courses) {
      return NextResponse.json({
        courses: [],
        message: 'User is not subscribed to courses'
      })
    }

    // Get all active courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (coursesError) {
      return NextResponse.json(
        { error: coursesError.message },
        { status: 400 }
      )
    }

    // Transform courses based on user's language preference
    const language = userProfile.language || 'en'
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: language === 'ar' ? course.title_ar : course.title_en,
      description: language === 'ar' ? course.description_ar : course.description_en,
      contentUrl: course.content_url,
      isActive: course.is_active,
      createdAt: course.created_at,
      updatedAt: course.updated_at
    }))

    return NextResponse.json({ courses: transformedCourses })

  } catch (error) {
    console.error('Get my courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

