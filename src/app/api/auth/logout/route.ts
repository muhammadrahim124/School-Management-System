import { NextResponse } from 'next/server'
import { clearAuthToken } from '@/lib/auth'

export async function POST() {
  await clearAuthToken()
  return NextResponse.json({ message: 'Logged out successfully' })
}

