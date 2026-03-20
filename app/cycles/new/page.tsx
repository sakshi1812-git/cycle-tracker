'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type FlowLevel = 'SPOTTING' | 'LIGHT' | 'MEDIUM' | 'HEAVY'

export default function NewCyclePage() {
  const router = useRouter()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flow, setFlow] = useState<FlowLevel>('MEDIUM')
  const [cycleLength, setCycleLength] = useState('')
  const [periodLength, setPeriodLength] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate: endDate || undefined,
          flow,
          cycleLength: cycleLength ? Number(cycleLength) : undefined,
          periodLength: periodLength ? Number(periodLength) : undefined,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to log cycle')
      }

      router.push('/cycles')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
            Log New Cycle 🌸
          </h1>
          <p className="mt-1 text-pink-500">
            Track your cycle details to build better predictions.
          </p>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="startDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Start date <span className="text-rose-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                End date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label
                htmlFor="flow"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Flow level
              </label>
              <select
                id="flow"
                value={flow}
                onChange={(e) => setFlow(e.target.value as FlowLevel)}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              >
                <option value="SPOTTING">SPOTTING</option>
                <option value="LIGHT">LIGHT</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HEAVY">HEAVY</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cycleLength"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Cycle length (days)
                </label>
                <input
                  id="cycleLength"
                  type="number"
                  min={1}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label
                  htmlFor="periodLength"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Period length (days)
                </label>
                <input
                  id="periodLength"
                  type="number"
                  min={1}
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white rounded-xl py-2 font-medium hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
