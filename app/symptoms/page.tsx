'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type SymptomLog = {
  id: string
  date: string
  symptoms: string[]
  mood: string | null
}

const symptomEmoji: Record<string, string> = {
  cramps: '😣',
  bloating: '🫃',
  headache: '🤕',
  fatigue: '😴',
  'mood swings': '😤',
  'tender breasts': '💗',
  backache: '😖',
  nausea: '🤢',
}

const moodEmoji: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  tired: '😴',
  irritable: '😤',
  anxious: '😰',
  sad: '😢',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

export default function SymptomsPage() {
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function fetchLogs() {
    try {
      setError('')
      const response = await fetch('/api/symptoms')
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to fetch symptom logs')
      }

      const data = (await response.json()) as SymptomLog[]
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this symptom log?')
    if (!confirmed) return

    setDeletingId(id)
    setError('')
    try {
      const response = await fetch(`/api/symptoms/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to delete symptom log')
      }

      setLogs((prev) => prev.filter((log) => log.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Symptom Logs 💖</h1>
            <p className="mt-1 text-pink-500">
              Track how you feel throughout your cycle.
            </p>
          </div>
          <Link
            href="/symptoms/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-purple-600"
          >
            Log Symptoms
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading symptom logs...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-5xl">🌸</div>
            <p className="text-gray-700">No symptom logs yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Start logging symptoms to understand your patterns.
            </p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="grid grid-cols-1 gap-5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {formatDate(log.date)}
                  </h2>
                  <span className="w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    Mood:{' '}
                    {log.mood
                      ? `${moodEmoji[log.mood] ?? '🙂'} ${log.mood}`
                      : 'Not set'}
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {log.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="rounded-full border border-pink-200 bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-1 text-xs font-medium capitalize text-pink-700"
                    >
                      {(symptomEmoji[symptom] ?? '🌸') + ' ' + symptom}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(log.id)}
                  disabled={deletingId === log.id}
                  className="inline-flex rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingId === log.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
