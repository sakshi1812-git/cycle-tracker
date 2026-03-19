import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

type Params = {
  params: Promise<{ id: string }>
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
    const existingLog = await prisma.symptomLog.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!existingLog) {
      return NextResponse.json(
        { error: 'Symptom log not found' },
        { status: 404 }
      )
    }

    await prisma.symptomLog.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Symptom log deleted successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete symptom log' },
      { status: 500 }
    )
  }
}
