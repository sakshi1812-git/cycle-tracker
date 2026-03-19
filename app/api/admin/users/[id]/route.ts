import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

type Params = {
  params: Promise<{ id: string }>
}

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

export async function GET(_: Request, { params }: Params) {
  try {
    const adminError = await requireAdmin()
    if (adminError) return adminError

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        cycles: { orderBy: { startDate: 'desc' } },
        symptoms: { orderBy: { date: 'desc' } },
        notes: { orderBy: { date: 'desc' } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}

export async function PATCH(_: Request, { params }: Params) {
  try {
    const adminError = await requireAdmin()
    if (adminError) return adminError

    const { id } = await params
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const adminError = await requireAdmin()
    if (adminError) return adminError

    const { id } = await params
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json(
      { message: 'User and related data deleted successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
