'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type UserRow = {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN'
  _count: {
    cycles: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        setError('')
        const response = await fetch('/api/admin/users')
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to fetch users')
        }
        const data = (await response.json()) as UserRow[]
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-800">All Users 👩‍💻</h1>
          <p className="mt-1 text-pink-500">Manage all registered users.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-pink-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-pink-700">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Cycle Count</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-pink-100 text-sm text-gray-700">
                      <td className="px-6 py-3">{user.name || 'No name'}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.role}</td>
                      <td className="px-6 py-3">{user._count.cycles}</td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-600"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
