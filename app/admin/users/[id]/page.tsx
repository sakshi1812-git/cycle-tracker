'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Cycle = {
  id: string
  startDate: string
  endDate: string | null
  flow: string
  cycleLength: number | null
  periodLength: number | null
}

type Symptom = {
  id: string
}

type Note = {
  id: string
}

type UserDetails = {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  cycles: Cycle[]
  symptoms: Symptom[]
  notes: Note[]
}

function formatDate(date: string | null) {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString()
}

export default function AdminUserDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingRole, setUpdatingRole] = useState(false)
  const [deletingUser, setDeletingUser] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        setError('')
        const response = await fetch(`/api/admin/users/${id}`)
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to fetch user details')
        }
        const data = (await response.json()) as UserDetails
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchUser()
  }, [id])

  async function handleToggleRole() {
    if (!user) return
    setUpdatingRole(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to update role')
      }
      const updatedUser = (await response.json()) as UserDetails
      setUser((prev) => (prev ? { ...prev, role: updatedUser.role } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUpdatingRole(false)
    }
  }

  async function handleDeleteUser() {
    if (!user) return
    const confirmed = window.confirm(
      'Delete this user and all their data? This cannot be undone.'
    )
    if (!confirmed) return

    setDeletingUser(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? 'Failed to delete user')
      }
      router.push('/admin/users')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeletingUser(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Users
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading user details...
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && user && (
          <>
            <div className="mb-6 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-pink-800">User Details</h1>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                <p><span className="font-medium">Name:</span> {user.name || 'No name'}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
                <p><span className="font-medium">Joined:</span> {formatDate(user.createdAt)}</p>
                <p><span className="font-medium">Symptoms:</span> {user.symptoms.length}</p>
                <p><span className="font-medium">Notes:</span> {user.notes.length}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleToggleRole}
                  disabled={updatingRole}
                  className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updatingRole
                    ? 'Updating...'
                    : `Set as ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deletingUser}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingUser ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
              <div className="border-b border-pink-100 px-6 py-4">
                <h2 className="font-semibold text-gray-800">Cycles</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-pink-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-pink-700">
                      <th className="px-6 py-3">Start</th>
                      <th className="px-6 py-3">End</th>
                      <th className="px-6 py-3">Flow</th>
                      <th className="px-6 py-3">Cycle Length</th>
                      <th className="px-6 py-3">Period Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.cycles.map((cycle) => (
                      <tr key={cycle.id} className="border-t border-pink-100 text-sm text-gray-700">
                        <td className="px-6 py-3">{formatDate(cycle.startDate)}</td>
                        <td className="px-6 py-3">{formatDate(cycle.endDate)}</td>
                        <td className="px-6 py-3">{cycle.flow}</td>
                        <td className="px-6 py-3">{cycle.cycleLength ?? 'Not set'}</td>
                        <td className="px-6 py-3">{cycle.periodLength ?? 'Not set'}</td>
                      </tr>
                    ))}
                    {user.cycles.length === 0 && (
                      <tr>
                        <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                          No cycles for this user.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
