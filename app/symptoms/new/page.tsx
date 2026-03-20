'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

const symptomOptions = [
  'cramps',
  'bloating',
  'headache',
  'fatigue',
  'mood swings',
  'tender breasts',
  'backache',
  'nausea',
] as const

const moodOptions = ['happy', 'calm', 'tired', 'irritable', 'anxious', 'sad'] as const
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

export default function NewSymptomPage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [mood, setMood] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          symptoms: selectedSymptoms,
          mood: mood || undefined,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to save symptom log')
      }

      router.push('/symptoms')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/symptoms"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Symptom Logs
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-800">Log Symptoms 🌸</h1>
          <p className="mt-1 text-pink-500">
            Keep track of symptoms and mood for better cycle insights.
          </p>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-pink-200 px-3 py-2 text-gray-800 outline-none transition-all duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-700">
                Symptoms <span className="text-rose-500">*</span>
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {symptomOptions.map((symptom) => (
                  <label
                    key={symptom}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition-all duration-200 ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-pink-100 border-pink-400 scale-105 text-pink-800'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="sr-only"
                    />
                    <span className="font-medium">
                      {(symptomEmoji[symptom] ?? '🌸') + ' ' + symptom}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="mood"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Mood
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-pink-200 px-3 py-2 text-gray-800 outline-none transition-all duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Select mood</option>
                {moodOptions.map((moodValue) => (
                  <option key={moodValue} value={moodValue}>
                    {moodValue}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl py-2 font-medium transition hover:from-pink-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
