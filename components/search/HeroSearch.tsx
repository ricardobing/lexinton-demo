'use client'

/**
 * HeroSearch — Buscador premium del hero.
 *
 * Diseño:
 * - Fondo suavizado (no negro puro) con backdrop-blur y tinte cálido
 * - Tabs COMPRAR / ALQUILAR con indicador animado
 * - Selector de tipo custom (popover) — sin HTML <select>
 * - Animaciones Framer Motion: entrada staggered, hover suaves
 * - Mobile-first: columna apilada → fila en sm+
 */

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LocationAutocomplete from './LocationAutocomplete'

const TABS = [
  { value: 'Sale', label: 'Comprar' },
  { value: 'Rent', label: 'Alquilar' },
] as const

const TYPES = [
  { value: '', label: 'Cualquier tipo' },
  { value: '2', label: 'Departamento' },
  { value: '3', label: 'Casa' },
  { value: '13', label: 'PH' },
  { value: '31', label: 'Monoambiente' },
  { value: '1', label: 'Terreno' },
  { value: '10', label: 'Cochera' },
  { value: '7', label: 'Local' },
  { value: '5', label: 'Oficina' },
]

// Variantes de animación del dropdown interno
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
  exit:  { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
}

export default function HeroSearch() {
  const router = useRouter()
  const [tab, setTab] = useState<'Sale' | 'Rent'>('Sale')
  const [locationId, setLocationId] = useState('')
  const [locationName, setLocationName] = useState('')
  const [typeValue, setTypeValue] = useState('')
  const [typeOpen, setTypeOpen] = useState(false)
  const typeRef = useRef<HTMLDivElement>(null!)

  const typeLabel = TYPES.find((t) => t.value === typeValue)?.label ?? 'Cualquier tipo'

  // Click fuera para cerrar
  useEffect(() => {
    if (!typeOpen) return
    const fn = (e: MouseEvent) => {
      if (!typeRef.current?.contains(e.target as Node)) setTypeOpen(false)
    }
    const kfn = (e: KeyboardEvent) => { if (e.key === 'Escape') setTypeOpen(false) }
    document.addEventListener('mousedown', fn)
    document.addEventListener('keydown', kfn)
    return () => { document.removeEventListener('mousedown', fn); document.removeEventListener('keydown', kfn) }
  }, [typeOpen])

  const handleSearch = () => {
    const p = new URLSearchParams()
    p.set('operation', tab)
    if (locationId) { p.set('location', locationId); p.set('location_name', locationName) }
    if (typeValue) p.set('type', typeValue)
    router.push(`/propiedades?${p.toString()}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Tarjeta ─────────────────────────────────────────────────── */}
      <div className="bg-[#1c1a18]/80 backdrop-blur-xl border border-white/[0.10] shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden">

        {/* Tabs */}
        <div className="flex relative border-b border-white/[0.10]">
          {TABS.map((t) => {
            const active = tab === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={[
                  'relative flex-1 py-3.5 z-10',
                  'text-[10px] font-bold tracking-[0.28em] uppercase transition-colors duration-200',
                  active ? 'text-lx-ink' : 'text-white/45 hover:text-white/75',
                ].join(' ')}
              >
                {active && (
                  <motion.div
                    layoutId="hero-tab-bg"
                    className="absolute inset-0 bg-white"
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Inputs */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">

            {/* Barrio */}
            <div className="flex-1 min-w-0">
              <LocationAutocomplete
                value={locationId}
                displayName={locationName}
                onChange={(id: string, name: string) => { setLocationId(id); setLocationName(name) }}
                placeholder="Barrio o zona..."
                theme="dark"
              />
            </div>

            {/* Tipo — custom dropdown */}
            <div ref={typeRef} className="relative sm:w-44 shrink-0">
              <button
                type="button"
                onClick={() => setTypeOpen((v) => !v)}
                className={[
                  'w-full h-[42px] flex items-center justify-between gap-2 px-3.5',
                  'bg-white/[0.09] border text-sm transition-all duration-150 text-left',
                  typeOpen
                    ? 'border-white/40 bg-white/[0.13]'
                    : 'border-white/20 hover:border-white/35 hover:bg-white/[0.12]',
                  typeValue ? 'text-white' : 'text-white/55',
                ].join(' ')}
              >
                <span className="truncate">{typeLabel}</span>
                <motion.svg
                  animate={{ rotate: typeOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3.5 h-3.5 shrink-0 text-white/40"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {typeOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="show" exit="exit"
                    className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-[#1e1c1a] border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden"
                  >
                    {TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => { setTypeValue(t.value); setTypeOpen(false) }}
                        className={[
                          'w-full text-left px-4 py-2.5 text-[12.5px] transition-colors duration-100',
                          typeValue === t.value
                            ? 'text-white bg-white/[0.12]'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.07]',
                        ].join(' ')}
                      >
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón buscar */}
            <motion.button
              type="button"
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="h-[42px] shrink-0 bg-white text-lx-ink text-[10px] font-bold tracking-[0.26em] uppercase px-8 sm:px-7 flex items-center justify-center gap-2 hover:bg-lx-cream transition-colors duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Buscar
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
