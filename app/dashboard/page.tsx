import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

function formatDate(date: Date) {
  return date.toLocaleDateString()
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

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-800">
            Welcome back, {user.firstName ?? 'there'} 🌸
          </h1>
          <p className="text-pink-500 mt-1">
            Your cycle tracking dashboard
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
            <div className="text-4xl mb-2">🌙</div>
            <h2 className="font-semibold text-gray-800">Current Cycle</h2>
            <p className="text-gray-500 text-sm mt-1">
              {cycleDay ? `Day ${cycleDay}` : 'No cycle logged yet'}
            </p>
            <Link
              href="/cycles/new"
              className="mt-4 block w-full bg-pink-500 text-white rounded-xl py-2 text-sm font-medium text-center hover:bg-pink-600 transition"
            >
              Log Cycle
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
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
            <div className="space-y-3">
              {recentCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center justify-between rounded-xl border border-pink-100 bg-pink-50/50 px-4 py-3"
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
