'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Note = {
  id: string
  date: string
  content: string
}

function toDateInputValue(date: string) {
  return new Date(date).toISOString().split('T')[0]
}

export default function EditNotePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [date, setDate] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchNote() {
      try {
        setError('')
        const response = await fetch('/api/notes')

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to load note')
        }

        const notes = (await response.json()) as Note[]
        const note = notes.find((item) => item.id === id)
        if (!note) {
          throw new Error('Note not found')
        }

        setDate(toDateInputValue(note.date))
        setContent(note.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchNote()
  }, [id])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, content }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to update note')
      }

      router.push('/notes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/notes"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Notes
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-800">Edit Note ✨</h1>
          <p className="mt-1 text-pink-500">Update your saved note.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading note...
          </div>
        )}

        {!loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 font-medium text-white transition hover:from-pink-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
