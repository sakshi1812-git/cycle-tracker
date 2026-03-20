'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type CycleData = {
  id: string
  startDate: string
  endDate: string | null
  cycleLength: number | null
  periodLength: number | null
}

type CalendarClientProps = {
  cycles: CycleData[]
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export default function CalendarClient({ cycles }: CalendarClientProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const { periodDays, predictedDays } = useMemo(() => {
    const periodSet = new Set<string>()
    const predictedSet = new Set<string>()

    for (const cycle of cycles) {
      const start = new Date(cycle.startDate)
      const periodLength = cycle.periodLength ?? 5
      const end = cycle.endDate ? new Date(cycle.endDate) : addDays(start, periodLength - 1)

      let cursor = new Date(start)
      while (cursor <= end) {
        periodSet.add(toKey(cursor))
        cursor = addDays(cursor, 1)
      }
    }

    if (cycles.length > 0) {
      const latest = [...cycles].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )[0]

      const latestStart = new Date(latest.startDate)
      const predictedStart = addDays(latestStart, latest.cycleLength ?? 28)
      const predictedPeriodLength = latest.periodLength ?? 5

      for (let i = 0; i < predictedPeriodLength; i += 1) {
        predictedSet.add(toKey(addDays(predictedStart, i)))
      }
    }

    return { periodDays: periodSet, predictedDays: predictedSet }
  }, [cycles])

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    const leading = monthStart.getDay()
    const trailing = 6 - monthEnd.getDay()

    const gridStart = addDays(monthStart, -leading)
    const gridEnd = addDays(monthEnd, trailing)

    const days: Date[] = []
    let cursor = new Date(gridStart)
    while (cursor <= gridEnd) {
      days.push(new Date(cursor))
      cursor = addDays(cursor, 1)
    }

    return { monthStart, days }
  }, [currentMonth])

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-white">
            <h1 className="text-3xl font-bold">Cycle Calendar 📅</h1>
            <p className="mt-1 text-sm text-white/90">
              Track your period and predictions beautifully.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="border-2 border-pink-300 text-pink-500 hover:bg-pink-50 rounded-xl px-4 py-2 text-sm font-medium transition"
              >
                Previous Month
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="border-2 border-pink-300 text-pink-500 hover:bg-pink-50 rounded-xl px-4 py-2 text-sm font-medium transition"
              >
                Next Month
              </button>
            </div>
          </div>

          <p className="mb-4 text-center text-lg font-semibold text-gray-800">
            {monthData.monthStart.toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div
            key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
            className="grid grid-cols-7 gap-2 animate-[bounce_0.45s_ease]"
          >
            {dayLabels.map((label) => (
              <div
                key={label}
                className="rounded-lg bg-pink-100 py-2 text-center text-xs font-semibold uppercase tracking-wide text-pink-700"
              >
                {label}
              </div>
            ))}

            {monthData.days.map((day) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const key = toKey(day)
              const isPeriod = periodDays.has(key)
              const isPredicted = predictedDays.has(key)
              const isToday = sameDay(day, today)

              let dayClasses =
                'relative min-h-16 rounded-xl border p-2 text-sm transition hover:bg-pink-50 '

              if (!isCurrentMonth) {
                dayClasses +=
                  'border-transparent bg-gray-50 text-gray-300 hover:bg-gray-50 '
              } else if (isPeriod) {
                dayClasses +=
                  'border-rose-300 bg-gradient-to-br from-rose-400 to-pink-400 text-white '
              } else if (isPredicted) {
                dayClasses +=
                  'border-purple-200 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700 '
              } else {
                dayClasses += 'border-pink-100 bg-white text-gray-700 '
              }

              return (
                <div key={key} className={dayClasses}>
                  <div className="flex items-start justify-end">
                    <span
                      className={
                        isToday
                          ? 'inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white'
                          : 'text-xs font-medium'
                      }
                    >
                      {day.getDate()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-pink-100 bg-pink-50/40 p-4">
            <span className="rounded-full bg-gradient-to-r from-rose-400 to-pink-400 px-3 py-1 text-xs font-semibold text-white">
              Period days
            </span>
            <span className="rounded-full bg-gradient-to-r from-purple-200 to-fuchsia-200 px-3 py-1 text-xs font-semibold text-purple-800">
              Predicted next period
            </span>
            <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
              Today
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
