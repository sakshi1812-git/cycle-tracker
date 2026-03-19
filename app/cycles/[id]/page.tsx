'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Cycle = {
  id: string
  startDate: string
  endDate: string | null
  flow: 'SPOTTING' | 'LIGHT' | 'MEDIUM' | 'HEAVY'
  cycleLength: number | null
  periodLength: number | null
  createdAt: string
  updatedAt: string
}

function formatDate(date: string | null) {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString()
}

export default function CycleDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [cycle, setCycle] = useState<Cycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchCycle() {
      try {
        setError('')
        const response = await fetch(`/api/cycles/${id}`)

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to fetch cycle')
        }

        const data = (await response.json()) as Cycle
        setCycle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCycle()
  }, [id])

  async function handleDelete() {
    if (!cycle) return

    const shouldDelete = window.confirm(
      'Are you sure you want to delete this cycle?'
    )
    if (!shouldDelete) return

    setError('')
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/cycles/${cycle.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to delete cycle')
      }

      router.push('/cycles')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/cycles"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Cycles
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading cycle details...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && cycle && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-pink-800">Cycle Details 🌸</h1>
                <p className="mt-1 text-sm text-pink-500">Review and manage this cycle log.</p>
              </div>
              <span className="w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                {cycle.flow}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2">
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                <p className="text-xs uppercase tracking-wide text-pink-600">Start date</p>
                <p className="mt-1 font-medium text-gray-800">{formatDate(cycle.startDate)}</p>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                <p className="text-xs uppercase tracking-wide text-pink-600">End date</p>
                <p className="mt-1 font-medium text-gray-800">{formatDate(cycle.endDate)}</p>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                <p className="text-xs uppercase tracking-wide text-pink-600">Cycle length</p>
                <p className="mt-1 font-medium text-gray-800">{cycle.cycleLength ?? 'Not set'}</p>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-4">
                <p className="text-xs uppercase tracking-wide text-pink-600">Period length</p>
                <p className="mt-1 font-medium text-gray-800">{cycle.periodLength ?? 'Not set'}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/cycles/${cycle.id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-purple-600"
              >
                Edit Cycle
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Delete Cycle'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
