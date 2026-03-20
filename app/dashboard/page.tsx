import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

function formatDate(date: Date) {
  return date.toLocaleDateString()
}

function getFlowBorderClass(flow: 'SPOTTING' | 'LIGHT' | 'MEDIUM' | 'HEAVY') {
  if (flow === 'HEAVY') return 'border-l-red-400'
  if (flow === 'MEDIUM') return 'border-l-pink-400'
  if (flow === 'LIGHT') return 'border-l-purple-300'
  return 'border-l-rose-200'
}

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })

  const recentCycles = dbUser
    ? await prisma.cycle.findMany({
        where: { userId: dbUser.id },
        orderBy: { startDate: 'desc' },
        take: 3,
      })
    : []

  const latestCycle = recentCycles[0] ?? null

  const cycleDay = latestCycle
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(latestCycle.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    : null

  const predictedNextPeriod = latestCycle
    ? new Date(
        new Date(latestCycle.startDate).getTime() +
          (latestCycle.cycleLength ?? 28) * 24 * 60 * 60 * 1000
      )
    : null

  const cycleLength = latestCycle?.cycleLength ?? 28
  const progress = cycleDay ? Math.min(100, Math.round((cycleDay / cycleLength) * 100)) : 0
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (progress / 100) * circumference

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-100 via-purple-50 to-rose-100 p-8 shadow-sm">
          <div className="pointer-events-none absolute -top-2 left-10 text-3xl opacity-20">🌸</div>
          <div className="pointer-events-none absolute top-6 right-16 text-4xl opacity-20">🌺</div>
          <div className="pointer-events-none absolute bottom-3 left-1/3 text-2xl opacity-20">🌷</div>
          <div className="pointer-events-none absolute bottom-4 right-8 text-3xl opacity-20">🌼</div>

          <h1 className="animate-pulse text-4xl font-bold tracking-tight text-pink-800 md:text-5xl">
            Welcome back, {user.firstName ?? 'there'} 🌸
          </h1>
          <p className="mt-2 text-pink-600">
            Your cycle tracking dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-4xl">🌙</div>
              {cycleDay && (
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#fbcfe8"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#ec4899"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-pink-700">{cycleDay}</span>
                    <span className="text-[10px] text-pink-500">Day</span>
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-semibold text-gray-800">Current Cycle</h2>
            <p className="text-gray-500 text-sm mt-1">
              {cycleDay
                ? `Day ${cycleDay} of ${cycleLength} (${progress}%)`
                : 'No cycle logged yet'}
            </p>
            <Link
              href="/cycles/new"
              className="mt-4 block w-full bg-pink-500 text-white rounded-xl py-2 text-sm font-medium text-center hover:bg-pink-600 transition animate-pulse"
            >
              Log Cycle
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-2">📅</div>
            <h2 className="font-semibold text-gray-800">Next Period</h2>
            <p className="text-gray-500 text-sm mt-1">
              {predictedNextPeriod
                ? formatDate(predictedNextPeriod)
                : 'Log a cycle to predict'}
            </p>
            <Link
              href="/calendar"
              className="mt-4 block w-full bg-purple-500 text-white rounded-xl py-2 text-sm font-medium text-center hover:bg-purple-600 transition"
            >
              View Calendar
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-2">💊</div>
            <h2 className="font-semibold text-gray-800">Today's Symptoms</h2>
            <p className="text-gray-500 text-sm mt-1">Nothing logged today</p>
            <Link
              href="/symptoms/new"
              className="mt-4 block w-full bg-rose-500 text-white rounded-xl py-2 text-sm font-medium text-center hover:bg-rose-600 transition"
            >
              Log Symptoms
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Cycles</h2>
          {recentCycles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-5xl mb-3">🌸</div>
              <p>No cycles logged yet</p>
              <p className="text-sm mt-1">Start tracking to see your history here</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {recentCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className={`flex items-center justify-between rounded-xl border border-pink-100 border-l-4 ${getFlowBorderClass(cycle.flow)} bg-pink-50/50 px-4 py-3`}
                >
                  <p className="text-sm text-gray-700">
                    Start: <span className="font-medium">{formatDate(cycle.startDate)}</span>
                  </p>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    {cycle.flow}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
