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
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ class: classData })
  } catch (error) {
    console.error('Get class error:', error)
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
    const { name, grade_level, section, academic_year } = await request.json()

    if (!name || !grade_level || !section) {
      return NextResponse.json(
        { error: 'Name, grade level, and section are required' },
        { status: 400 }
      )
    }

    if (grade_level < 1 || grade_level > 12) {
      return NextResponse.json(
        { error: 'Grade level must be between 1 and 12' },
        { status: 400 }
      )
    }

    const classData = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade_level: parseInt(grade_level),
        section,
        academic_year: academic_year || '2024-2025',
      },
    })

    return NextResponse.json({ class: classData })
  } catch (error) {
    console.error('Update class error:', error)
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
    await prisma.class.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Delete class error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

