import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET course by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('lang') || 'en'

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Transform course based on language
    const transformedCourse = {
      id: course.id,
      title: language === 'ar' ? course.title_ar : course.title_en,
      description: language === 'ar' ? course.description_ar : course.description_en,
      contentUrl: course.content_url,
      isActive: course.is_active,
      createdAt: course.created_at,
      updatedAt: course.updated_at
    }

    return NextResponse.json({ course: transformedCourse })

  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

