import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET all courses (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('lang') || 'en'

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Transform courses based on language
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
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

