'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/', label: '首页' },
  { href: '/project-learning', label: '📚 项目学习' },
  { href: '/aicoding', label: '💻 AIcoding实践' },
  { href: '/others-stones', label: '🪨 他山之石' },
  { href: '/skills', label: 'Skills市场' },
  { href: '/solutions', label: '解决方案' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy text-xl">
          <span className="text-2xl">🦞</span>龙大师
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-600 hover:text-brand transition font-medium"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-4 py-2 bg-brand text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition"
          >
            联系我们
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-700 hover:text-brand py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
