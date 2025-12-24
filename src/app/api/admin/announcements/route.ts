import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Get announcements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, priority, target_audience, expires_at } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority: priority || 'normal',
        target_audience: target_audience || 'all',
        created_by: user.id,
        expires_at: expires_at ? new Date(expires_at) : null,
      },
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

