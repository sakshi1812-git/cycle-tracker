'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type RecentUser = {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

type AdminStats = {
  totalUsers: number
  totalCycles: number
  totalSymptomLogs: number
  recentUsers: RecentUser[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        setError('')
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(data?.error ?? 'Failed to fetch admin stats')
        }
        const data = (await response.json()) as AdminStats
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Admin Dashboard 👑</h1>
            <p className="mt-1 text-pink-500">Overview of app usage and users.</p>
          </div>
          <Link
            href="/admin/users"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:from-pink-600 hover:to-purple-600"
          >
            Manage Users
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-gray-500 shadow-sm">
            Loading admin stats...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-pink-600">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-pink-800">{stats.totalUsers}</p>
              </div>
              <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-purple-600">Total Cycles</p>
                <p className="mt-2 text-3xl font-bold text-purple-800">{stats.totalCycles}</p>
              </div>
              <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-rose-600">Total Symptom Logs</p>
                <p className="mt-2 text-3xl font-bold text-rose-800">{stats.totalSymptomLogs}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
              <div className="border-b border-pink-100 px-6 py-4">
                <h2 className="font-semibold text-gray-800">Recent Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-pink-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-pink-700">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user.id} className="border-t border-pink-100 text-sm text-gray-700">
                        <td className="px-6 py-3">{user.name || 'No name'}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">{user.role}</td>
                        <td className="px-6 py-3">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
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
