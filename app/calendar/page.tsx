import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import CalendarClient from './CalendarClient'

export default async function CalendarPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    redirect('/sign-in')
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
    select: {
      id: true,
      startDate: true,
      endDate: true,
      cycleLength: true,
      periodLength: true,
    },
  })

  return (
    <CalendarClient
      cycles={cycles.map((cycle) => ({
        id: cycle.id,
        startDate: cycle.startDate.toISOString(),
        endDate: cycle.endDate ? cycle.endDate.toISOString() : null,
        cycleLength: cycle.cycleLength,
        periodLength: cycle.periodLength,
      }))}
    />
  )
}
