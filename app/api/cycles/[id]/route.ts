import { auth, currentUser } from '@clerk/nextjs/server'
import { FlowLevel } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
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
    const cycle = await prisma.cycle.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 })
    }

    return NextResponse.json(cycle, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cycle' }, { status: 500 })
  }
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
    const existingCycle = await prisma.cycle.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!existingCycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 })
    }

    const body = await req.json()
    const { startDate, endDate, cycleLength, periodLength, flow } = body

    if (flow && !Object.values(FlowLevel).includes(flow)) {
      return NextResponse.json(
        { error: 'Invalid flow value' },
        { status: 400 }
      )
    }

    const cycle = await prisma.cycle.update({
      where: { id },
      data: {
        startDate:
          startDate !== undefined ? new Date(startDate) : existingCycle.startDate,
        endDate:
          endDate !== undefined
            ? endDate
              ? new Date(endDate)
              : null
            : existingCycle.endDate,
        cycleLength:
          cycleLength !== undefined ? cycleLength : existingCycle.cycleLength,
        periodLength:
          periodLength !== undefined ? periodLength : existingCycle.periodLength,
        flow: flow ?? existingCycle.flow,
      },
    })

    return NextResponse.json(cycle, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update cycle' },
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
    const existingCycle = await prisma.cycle.findFirst({
      where: { id, userId: dbUser.id },
    })

    if (!existingCycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 })
    }

    await prisma.cycle.delete({ where: { id } })

    return NextResponse.json(
      { message: 'Cycle deleted successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete cycle' },
      { status: 500 }
    )
  }
}
