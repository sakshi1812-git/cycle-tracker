import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

const allowedSymptoms = new Set([
  'cramps',
  'bloating',
  'headache',
  'fatigue',
  'mood swings',
  'tender breasts',
  'backache',
  'nausea',
])

const allowedMoods = new Set([
  'happy',
  'calm',
  'tired',
  'irritable',
  'anxious',
  'sad',
])

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

    const logs = await prisma.symptomLog.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(logs, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch symptom logs' },
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
    const { date, symptoms, mood } = body as {
      date?: string
      symptoms?: string[]
      mood?: string | null
    }

    if (!date) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'At least one symptom is required' },
        { status: 400 }
      )
    }

    const hasInvalidSymptom = symptoms.some(
      (symptom) => !allowedSymptoms.has(symptom)
    )
    if (hasInvalidSymptom) {
      return NextResponse.json(
        { error: 'Invalid symptom value provided' },
        { status: 400 }
      )
    }

    if (mood && !allowedMoods.has(mood)) {
      return NextResponse.json({ error: 'Invalid mood value' }, { status: 400 })
    }

    const log = await prisma.symptomLog.create({
      data: {
        userId: dbUser.id,
        date: new Date(date),
        symptoms,
        mood: mood ?? null,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create symptom log' },
      { status: 500 }
    )
  }
}
