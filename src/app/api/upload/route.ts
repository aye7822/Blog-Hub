import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('image') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Check if Vercel Blob token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not set, using local fallback')
      
      // Fallback to local storage for development
      const fs = await import('fs')
      const path = await import('path')
      const { writeFile, mkdir } = fs.promises
      
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadsDir, { recursive: true })
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `bloghub-${timestamp}-${file.name}`
        const filepath = path.join(uploadsDir, filename)
        
        // Save file locally
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filepath, buffer)
        
        // Return local URL
        const localUrl = `/uploads/${filename}`
        return NextResponse.json({ 
          url: localUrl,
          filename: filename,
          size: file.size,
          type: file.type
        })
      } catch (localError) {
        console.error('Local upload failed:', localError)
        return NextResponse.json({ 
          error: 'Image upload not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.' 
        }, { status: 500 })
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `bloghub-${timestamp}-${file.name}`
    
    // Upload to Vercel Blob storage
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({ 
      url: blob.url,
      filename: blob.pathname,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        return NextResponse.json({ 
          error: 'Image upload not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.' 
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Upload failed. Please try again.' 
    }, { status: 500 })
  }
}

