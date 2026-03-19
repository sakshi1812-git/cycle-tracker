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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-pink-800">
              Cycle Calendar 📅
            </h1>
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
                className="rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
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
                className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
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

          <div className="grid grid-cols-7 gap-2">
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
                'relative min-h-16 rounded-xl border p-2 text-sm transition '

              if (!isCurrentMonth) {
                dayClasses +=
                  'border-transparent bg-gray-50 text-gray-300 '
              } else if (isPeriod) {
                dayClasses += 'border-rose-200 bg-rose-100 text-rose-700 '
              } else if (isPredicted) {
                dayClasses +=
                  'border-purple-200 bg-purple-100 text-purple-700 '
              } else {
                dayClasses += 'border-pink-100 bg-white text-gray-700 '
              }

              return (
                <div key={key} className={dayClasses}>
                  <div className="flex items-start justify-end">
                    <span
                      className={
                        isToday
                          ? 'inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-white text-xs font-semibold text-gray-700'
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

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-pink-100 bg-pink-50/40 p-4 text-sm text-gray-700">
            <span>🔴 Period days</span>
            <span>🟣 Predicted next period</span>
            <span>⚪ Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
