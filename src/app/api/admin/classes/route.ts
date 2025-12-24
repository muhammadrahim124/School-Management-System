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

    const classes = await prisma.class.findMany({
      orderBy: [
        { grade_level: 'asc' },
        { section: 'asc' },
      ],
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    return NextResponse.json({ classes })
  } catch (error) {
    console.error('Get classes error:', error)
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

    const classData = await prisma.class.create({
      data: {
        name,
        grade_level: parseInt(grade_level),
        section,
        academic_year: academic_year || '2024-2025',
      },
    })

    return NextResponse.json({ class: classData }, { status: 201 })
  } catch (error) {
    console.error('Create class error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

