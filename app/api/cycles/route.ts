import { auth, currentUser } from '@clerk/nextjs/server'
import { FlowLevel } from '@prisma/client'
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

    const cycles = await prisma.cycle.findMany({
      where: { userId: dbUser.id },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(cycles, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch cycles' },
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
    const { startDate, endDate, cycleLength, periodLength, flow } = body

    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      )
    }

    if (flow && !Object.values(FlowLevel).includes(flow)) {
      return NextResponse.json(
        { error: 'Invalid flow value' },
        { status: 400 }
      )
    }

    const cycle = await prisma.cycle.create({
      data: {
        userId: dbUser.id,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        cycleLength: cycleLength ?? null,
        periodLength: periodLength ?? null,
        flow: flow ?? FlowLevel.MEDIUM,
      },
    })

    return NextResponse.json(cycle, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create cycle' },
      { status: 500 }
    )
  }
}
