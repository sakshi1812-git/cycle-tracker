'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Cycle = {
  id: string
  startDate: string
  endDate: string | null
  flow: 'SPOTTING' | 'LIGHT' | 'MEDIUM' | 'HEAVY'
  cycleLength: number | null
  periodLength: number | null
}

function formatDate(date: string | null) {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString()
}

export default function CyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCycles() {
      try {
        setError('')
        const response = await fetch('/api/cycles')

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to fetch cycles')
        }

        const data = (await response.json()) as Cycle[]
        setCycles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchCycles()
  }, [])

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Your Cycles 🌸</h1>
            <p className="mt-1 text-pink-500">
              Track and review your cycle history.
            </p>
          </div>

          <Link
            href="/cycles/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-purple-600"
          >
            Log New Cycle
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading cycles...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && cycles.length === 0 && (
          <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-5xl">🌸</div>
            <p className="text-gray-700">No cycles logged yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Log your first cycle to start tracking patterns.
            </p>
          </div>
        )}

        {!loading && !error && cycles.length > 0 && (
          <div className="grid grid-cols-1 gap-5">
            {cycles.map((cycle) => (
              <div
                key={cycle.id}
                className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Cycle Start: {formatDate(cycle.startDate)}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      End Date: {formatDate(cycle.endDate)}
                    </p>
                  </div>

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    {cycle.flow}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-gray-800">Cycle length:</span>{' '}
                    {cycle.cycleLength ?? 'Not set'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Period length:</span>{' '}
                    {cycle.periodLength ?? 'Not set'}
                  </p>
                </div>

                <Link
                  href={`/cycles/${cycle.id}`}
                  className="inline-flex rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
