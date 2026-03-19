import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
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

    const { id } = await params
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
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

    const note = await prisma.note.update({
      where: { id },
      data: {
        date: new Date(date),
        content: content.trim(),
      },
    })

    return NextResponse.json(note, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: Request, { params }: Params) {
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

    const { id } = await params
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    await prisma.note.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Note deleted successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
