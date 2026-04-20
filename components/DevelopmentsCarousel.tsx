'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { TokkoDevelopment } from '@/lib/tokko/types'

interface Props {
  developments: TokkoDevelopment[]
}

const CONSTRUCTION_STATUS: Record<number, { label: string; color: string }> = {
  0: { label: 'En pozo',        color: 'bg-amber-500/90' },
  1: { label: 'En construcción', color: 'bg-blue-500/90' },
  2: { label: 'Terminado',       color: 'bg-emerald-600/90' },
  3: { label: 'Entrega inmediata', color: 'bg-lx-red/90' },
}

export default function DevelopmentsCarousel({ developments }: Props) {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const dev = developments[active] ?? null
  if (!developments.length || !dev) return null

  const photos = Array.isArray(dev.photos) ? dev.photos : []
  const cover = photos[0]?.image ?? null
  const status = CONSTRUCTION_STATUS[dev.construction_status] ?? null
  const title = dev.publication_title || dev.name

  const prev = useCallback(() => {
    setActive((a) => (a === 0 ? developments.length - 1 : a - 1))
  }, [developments.length])

  const next = useCallback(() => {
    setActive((a) => (a === developments.length - 1 ? 0 : a + 1))
  }, [developments.length])

  return (
    <section className="py-20 sm:py-28 bg-lx-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/40 mb-2">
              Emprendimientos
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-normal text-white">
              Proyectos seleccionados
            </h2>
          </div>
          {/* Nav arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Main card ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          {/* Featured card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative rounded-2xl overflow-hidden bg-lx-stone/10 aspect-[16/9] lg:aspect-auto lg:min-h-[420px] group"
            >
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-lx-stone/20 to-lx-ink flex items-center justify-center">
                  <span className="font-serif text-5xl text-white/10">{title[0]}</span>
                </div>
              )}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-lx-ink/80 via-lx-ink/20 to-transparent" />

              {/* Status badge */}
              {status && (
                <div className="absolute top-5 left-5">
                  <span className={`${status.color} text-white text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm`}>
                    {status.label}
                  </span>
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                {dev.type?.name && (
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1.5">
                    {dev.type.name}
                  </p>
                )}
                <h3 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] font-normal text-white leading-tight mb-1">
                  {title}
                </h3>
                {dev.address && (
                  <p className="text-white/60 text-sm mb-5">{dev.address}</p>
                )}
                <Link
                  href={`/emprendimientos/${dev.id}`}
                  className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-white border border-white/30 rounded-full px-5 py-2.5 hover:bg-white hover:text-lx-ink transition-all duration-300"
                >
                  Ver proyecto
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sidebar list */}
          <div ref={trackRef} className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto max-h-none lg:max-h-[420px] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {developments.map((d, i) => {
              const thumb = Array.isArray(d.photos) && d.photos.length > 0 ? d.photos[0].image : null
              const isActive = i === active
              return (
                <button
                  key={d.id}
                  onClick={() => setActive(i)}
                  className={`shrink-0 lg:shrink relative flex items-center gap-3 rounded-xl overflow-hidden border transition-all duration-200 w-[260px] lg:w-auto ${
                    isActive
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-[72px] h-[56px] lg:w-[80px] lg:h-[60px] relative overflow-hidden bg-lx-stone/20">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-lx-stone/20" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="flex-1 text-left pr-3 py-2 min-w-0">
                    <p className={`text-[11px] font-semibold leading-tight truncate ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {d.publication_title || d.name}
                    </p>
                    {d.location?.name && (
                      <p className="text-[10px] text-white/40 mt-0.5 truncate">{d.location.name}</p>
                    )}
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-lx-red rounded-r-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Dots + mobile arrows ──────────────────────────────── */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {developments.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`Ir a emprendimiento ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden items-center gap-3">
            <button onClick={prev} aria-label="Anterior" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={next} aria-label="Siguiente" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {/* Ver todos */}
          <Link
            href="/emprendimientos"
            className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-white/50 hover:text-white transition-colors"
          >
            Ver todos
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
