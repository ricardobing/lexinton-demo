'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'EMPRENDIMIENTOS', href: '/emprendimientos' },
  { label: 'INVERSOR', href: '/quiero-vender' },
  { label: 'CONTACTO', href: '/contacto' },
  { label: 'TASAR INMUEBLE', href: '/tasar', highlight: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isDark = !scrolled && !menuOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || menuOpen
          ? 'bg-white border-b border-lx-border'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-[1.1] shrink-0">
          <span className="text-base font-bold tracking-[0.22em] text-lx-red">
            LEXINTON
          </span>
          <span
            className={cn(
              'text-[8.5px] tracking-[0.32em] font-medium transition-colors duration-300',
              isDark ? 'text-white/75' : 'text-lx-mid',
            )}
          >
            PROPIEDADES
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-[11px] font-medium tracking-[0.12em] transition-colors duration-200 cursor-pointer',
                link.highlight
                  ? 'text-lx-red hover:text-lx-red/80'
                  : isDark
                    ? 'text-white/90 hover:text-white'
                    : 'text-lx-mid hover:text-lx-dark',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone */}
        <a
          href="tel:01147765003"
          className={cn(
            'hidden md:flex items-center gap-2 text-[12px] font-medium transition-colors duration-200 shrink-0',
            isDark ? 'text-white/90 hover:text-white' : 'text-lx-mid hover:text-lx-dark',
          )}
        >
          <PhoneIcon className={isDark ? 'text-white/70' : 'text-lx-red'} />
          011 4776-5003
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            'lg:hidden p-2 -mr-2 transition-colors duration-200',
            isDark ? 'text-white' : 'text-lx-dark',
          )}
          aria-label="Menú"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-lx-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'text-[12px] font-medium tracking-[0.1em] py-3 px-2 border-b border-lx-border last:border-0 transition-colors duration-150',
                  link.highlight
                    ? 'text-lx-red'
                    : 'text-lx-mid hover:text-lx-dark',
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:01147765003"
              className="text-[12px] font-medium text-lx-mid py-3 px-2 flex items-center gap-2"
            >
              <PhoneIcon className="text-lx-red" />
              011 4776-5003
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-3.5 h-3.5', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13 19.79 19.79 0 0 1 1.93 4.36a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
