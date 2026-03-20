'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cycles', label: 'Cycles' },
  { href: '/symptoms', label: 'Symptoms' },
  { href: '/notes', label: 'Notes' },
  { href: '/resources', label: 'Find Help' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="backdrop-blur-md bg-white/70 border-b border-pink-100 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold text-xl"
        >
          🌸 Cycle Tracker
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm transition ${
                pathname === link.href
                  ? 'font-bold text-pink-600'
                  : "font-medium text-pink-700 hover:text-purple-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-400 hover:after:w-full after:transition-all after:duration-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
