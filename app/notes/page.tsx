'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Note = {
  id: string
  date: string
  content: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function previewContent(content: string) {
  if (content.length <= 140) return content
  return `${content.slice(0, 140)}...`
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function fetchNotes() {
    try {
      setError('')
      const response = await fetch('/api/notes')
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to fetch notes')
      }

      const data = (await response.json()) as Note[]
      setNotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this note?')
    if (!confirmed) return

    setDeletingId(id)
    setError('')
    try {
      const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to delete note')
      }
      setNotes((prev) => prev.filter((note) => note.id !== id))
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
            <h1 className="text-3xl font-bold text-pink-800">Cycle Notes 📝</h1>
            <p className="mt-1 text-pink-500">
              Capture daily observations and reminders.
            </p>
          </div>
          <Link
            href="/notes/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-purple-600"
          >
            New Note
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading notes...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-5xl">🌸</div>
            <p className="text-gray-700">No notes yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first note to start tracking insights.
            </p>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <div className="grid grid-cols-1 gap-5">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={`rotate-1 rounded-2xl border p-6 shadow-sm ${
                  index % 2 === 0
                    ? 'border-yellow-200 bg-yellow-100/80'
                    : 'border-pink-200 bg-pink-100/80'
                }`}
              >
                <p className="mb-2 text-sm font-medium text-purple-700">
                  ✏️ {formatDate(note.date)}
                </p>
                <p className="mb-4 text-gray-700">{previewContent(note.content)}</p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/notes/${note.id}/edit`}
                    className="inline-flex items-center justify-center rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {deletingId === note.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
