'use client'

import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cycles', label: 'Cycles' },
  { href: '/symptoms', label: 'Symptoms' },
  { href: '/notes', label: 'Notes' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-pink-700 transition hover:text-purple-700"
        >
          🌸 Cycle Tracker
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50 hover:text-purple-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
