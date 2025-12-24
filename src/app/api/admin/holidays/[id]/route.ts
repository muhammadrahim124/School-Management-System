import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const holiday = await prisma.holiday.findUnique({
      where: { id },
    })

    if (!holiday) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ holiday })
  } catch (error) {
    console.error('Get holiday error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, start_date, end_date, color, description } = await request.json()

    if (!title || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    const holiday = await prisma.holiday.update({
      where: { id },
      data: {
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        color: color || '#3B82F6',
        description: description || null,
      },
    })

    return NextResponse.json({ holiday })
  } catch (error) {
    console.error('Update holiday error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await prisma.holiday.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Holiday deleted successfully' })
  } catch (error) {
    console.error('Delete holiday error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

