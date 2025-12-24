import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, generateToken, setAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role } = await request.json()

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const validRoles = ['admin', 'teacher', 'student']

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Please select admin, teacher, or student' },
        { status: 400 }
      )
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const profile = await prisma.profile.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        role,
      },
    })

    const token = generateToken(profile.id)
    await setAuthToken(token)

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

