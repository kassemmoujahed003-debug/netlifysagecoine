import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/api-helpers'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// POST upload image to Supabase Storage (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(request)
    
    if (!adminCheck.isAdmin) {
      return adminCheck.error || NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Use the admin client from checkAdminAccess which has the user's token
    // This allows RLS policies to work with storage
    const supabase = adminCheck.supabase

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `market-analysis/${timestamp}-${randomString}.${fileExt}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('market-analysis')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      // If bucket doesn't exist, return error with instructions
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          { 
            error: 'Storage bucket not found. Please create a bucket named "market-analysis" in Supabase Storage.',
            details: uploadError.message
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('market-analysis')
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      url: publicUrl,
      path: fileName
    })

  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

