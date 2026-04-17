'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Emprendimientos', href: '/emprendimientos' },
  { label: 'Inversores', href: '/inversor' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const dark = !isHome || scrolled || menuOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        dark ? 'bg-lx-cream border-b border-lx-line' : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-[1.0] shrink-0">
          <span className={cn(
            'text-[13px] font-bold tracking-[0.28em] transition-colors duration-300',
            dark ? 'text-lx-ink' : 'text-white',
          )}>
            LEXINTON
          </span>
          <span className={cn(
            'text-[7.5px] tracking-[0.38em] font-semibold transition-colors duration-300',
            dark ? 'text-lx-stone' : 'text-white/70',
          )}>
            PROPIEDADES
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'text-[11.5px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200',
                dark ? 'text-lx-stone hover:text-lx-ink' : 'text-white/95 hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <a
            href="tel:01147765003"
            className={cn(
              'text-[11px] font-semibold tracking-[0.08em] transition-colors duration-200',
              dark ? 'text-lx-stone hover:text-lx-ink' : 'text-white/85 hover:text-white',
            )}
          >
            011 4776-5003
          </a>
          <a
            href="/tasar"
            className={cn(
              'text-[10.5px] font-bold tracking-[0.14em] uppercase px-5 py-2.5 border transition-all duration-200',
              dark
                ? 'border-lx-ink text-lx-ink hover:bg-lx-ink hover:text-lx-cream'
                : 'border-white text-white hover:bg-white hover:text-lx-ink',
            )}
          >
            Tasar inmueble
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            'lg:hidden p-2 -mr-1 transition-colors duration-200',
            dark ? 'text-lx-ink' : 'text-white',
          )}
          aria-label="Menú"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-lx-cream border-t border-lx-line">
          <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[12px] font-semibold tracking-[0.12em] uppercase py-3 border-b border-lx-line last:border-0 text-lx-stone hover:text-lx-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/tasar"
              className="mt-3 text-center text-[11px] font-bold tracking-[0.14em] uppercase px-5 py-3 border border-lx-ink text-lx-ink"
            >
              Tasar inmueble
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

