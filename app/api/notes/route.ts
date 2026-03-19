import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        },
      })
    }

    const notes = await prisma.note.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(notes, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        },
      })
    }

    const body = await req.json()
    const { date, content } = body as { date?: string; content?: string }

    if (!date) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        userId: dbUser.id,
        date: new Date(date),
        content: content.trim(),
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
