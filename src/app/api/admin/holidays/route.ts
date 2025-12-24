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

    const holidays = await prisma.holiday.findMany({
      orderBy: { start_date: 'asc' },
    })

    return NextResponse.json({ holidays })
  } catch (error) {
    console.error('Get holidays error:', error)
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

    const { title, start_date, end_date, color, description } = await request.json()

    if (!title || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    const holiday = await prisma.holiday.create({
      data: {
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        color: color || '#3B82F6',
        description: description || null,
      },
    })

    return NextResponse.json({ holiday }, { status: 201 })
  } catch (error) {
    console.error('Create holiday error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

