import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

async function requireAdmin() {
  void currentUser
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser || dbUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

export async function GET() {
  try {
    const adminError = await requireAdmin()
    if (adminError) return adminError

    const [totalUsers, totalCycles, totalSymptomLogs, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.cycle.count(),
      prisma.symptomLog.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json(
      { totalUsers, totalCycles, totalSymptomLogs, recentUsers },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
