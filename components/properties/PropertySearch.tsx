'use client'

/**
 * PropertySearch — Barra de filtros premium para /propiedades
 *
 * Principios de diseño:
 * - Filtros como pill-buttons con estado activo claro (fondo ink)
 * - Popovers custom animados con Framer Motion (scale + fade)
 * - Desktop: barra sticky con todos los filtros en una fila limpia
 * - Mobile: barra compacta + drawer desde abajo con spring animation
 * - Sin HTML <select> en ningún lado — 100% custom
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  useCallback, useState, useTransition, useEffect, useRef, type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationAutocomplete from '@/components/search/LocationAutocomplete'

// ─── Constantes ───────────────────────────────────────────────────────────────

const OPS = [
  { value: '', label: 'Todas' },
  { value: 'Sale', label: 'Venta' },
  { value: 'Rent', label: 'Alquiler' },
]

const TYPES = [
  { value: '2', label: 'Departamento' },
  { value: '3', label: 'Casa' },
  { value: '13', label: 'PH' },
  { value: '31', label: 'Monoambiente' },
  { value: '1', label: 'Terreno' },
  { value: '10', label: 'Cochera' },
  { value: '7', label: 'Local' },
  { value: '5', label: 'Oficina' },
]

const ROOMS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
]

const ORDERS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

const OP_LABEL: Record<string, string> = {
  Sale: 'Venta', Rent: 'Alquiler',
}

const TYPE_LABEL: Record<string, string> = {
  '2': 'Departamento', '3': 'Casa', '13': 'PH', '31': 'Monoambiente',
  '1': 'Terreno', '10': 'Cochera', '7': 'Local', '5': 'Oficina',
}

function fmtPrice(min: string, max: string, cur: string) {
  const f = (v: string) => {
    const n = parseInt(v, 10)
    if (isNaN(n)) return ''
    return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`
      : n >= 1_000 ? `${Math.round(n / 1_000)}k` : String(n)
  }
  const a = f(min), b = f(max), c = cur || 'USD'
  if (a && b) return `${c} ${a}–${b}`
  if (a) return `desde ${c} ${a}`
  if (b) return `hasta ${c} ${b}`
  return ''
}

function activeCount(p: {
  operation: string; type: string; location: string
  minRooms: string; minPrice: string; maxPrice: string
}) {
  return [p.operation, p.type, p.location, p.minRooms, p.minPrice || p.maxPrice].filter(Boolean).length
}

// ─── Animaciones ──────────────────────────────────────────────────────────────

const popoverAnim = {
  initial: { opacity: 0, y: -6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as number[] } },
  exit:    { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
}

const drawerAnim = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring' as const, damping: 32, stiffness: 380 } },
  exit:    { y: '100%', transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] as number[] } },
}

// ─── PillButton ───────────────────────────────────────────────────────────────

function PillButton({
  label, active = false, onClick, open = false, className = '',
}: {
  label: string; active?: boolean; onClick: () => void; open?: boolean; className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative flex items-center gap-1.5 h-9 px-4 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap',
        'transition-all duration-150 select-none outline-none rounded-full',
        'focus-visible:ring-2 focus-visible:ring-[#C41230] focus-visible:ring-offset-1',
        active
          ? 'bg-[#C41230] text-white shadow-sm border border-[#C41230]'
          : open
          ? 'bg-lx-parchment text-lx-ink border border-lx-ink/30'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900',
        className,
      ].join(' ')}
    >
      {label}
      <motion.svg
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="w-3 h-3 opacity-60 shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
      </motion.svg>
    </button>
  )
}

// ─── Popover wrapper ──────────────────────────────────────────────────────────

function Popover({
  open, anchorRef, onClose, children, align = 'left', width = 'min-w-[210px]',
}: {
  open: boolean; anchorRef: React.RefObject<HTMLDivElement>
  onClose: () => void; children: ReactNode
  align?: 'left' | 'right'; width?: string
}) {
  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) onClose()
    }
    const kfn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', fn)
    document.addEventListener('keydown', kfn)
    return () => {
      document.removeEventListener('mousedown', fn)
      document.removeEventListener('keydown', kfn)
    }
  }, [open, anchorRef, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...popoverAnim}
          className={[
            'absolute top-[calc(100%+6px)] z-50 origin-top',
            'bg-white border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden rounded-2xl',
            align === 'right' ? 'right-0' : 'left-0',
            width,
          ].join(' ')}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Items de popover ─────────────────────────────────────────────────────────

function CheckItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-left transition-colors duration-100 ${
        checked ? 'text-lx-ink bg-lx-parchment/50' : 'text-lx-stone hover:text-lx-ink hover:bg-lx-cream/50'
      }`}
    >
      <span className={`w-4 h-4 flex items-center justify-center border shrink-0 transition-all duration-100 rounded-[3px] ${
        checked ? 'border-[#C41230] bg-[#C41230]' : 'border-gray-200'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

function RadioItem({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-left transition-colors duration-100 ${
        selected ? 'text-lx-ink bg-lx-parchment/50' : 'text-lx-stone hover:text-lx-ink hover:bg-lx-cream/50'
      }`}
    >
      <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
        selected ? 'border-[#C41230]' : 'border-gray-200'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-[#C41230] block" />}
      </span>
      {label}
    </button>
  )
}

function PopLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-4 pt-3.5 pb-2 text-[9px] font-bold tracking-[0.20em] uppercase text-lx-stone/50 border-b border-lx-line/40">
      {children}
    </p>
  )
}

// ─── Badge activo ─────────────────────────────────────────────────────────────

function Badge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.12 }}
      className="inline-flex items-center gap-1.5 h-6 px-2.5 bg-[#C41230] text-white text-[9.5px] font-semibold tracking-[0.04em] rounded-full"
    >
      {label}
      <button type="button" onClick={onRemove}
        className="opacity-60 hover:opacity-100 transition-opacity -mr-0.5"
        aria-label={`Quitar ${label}`}
      >
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.span>
  )
}

function DrawerLabel({ children }: { children: ReactNode }) {
  return <p className="text-[9.5px] font-bold tracking-[0.20em] uppercase text-lx-stone mb-3">{children}</p>
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PropertySearchProps { totalCount?: number }

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PropertySearch({ totalCount }: PropertySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openPop, setOpenPop] = useState<'type' | 'rooms' | 'price' | 'order' | null>(null)

  const typeRef  = useRef<HTMLDivElement>(null!)
  const roomsRef = useRef<HTMLDivElement>(null!)
  const priceRef = useRef<HTMLDivElement>(null!)
  const orderRef = useRef<HTMLDivElement>(null!)

  const cur = {
    operation:    sp.get('operation')     ?? '',
    type:         sp.get('type')          ?? '',
    location:     sp.get('location')      ?? '',
    locationName: sp.get('location_name') ?? '',
    minRooms:     sp.get('minRooms')      ?? '',
    minPrice:     sp.get('minPrice')      ?? '',
    maxPrice:     sp.get('maxPrice')      ?? '',
    currency:     sp.get('currency')      ?? 'USD',
    orderBy:      sp.get('orderBy')       ?? 'newest',
  }

  const [dMin, setDMin] = useState(cur.minPrice)
  const [dMax, setDMax] = useState(cur.maxPrice)
  const [dCur, setDCur] = useState(cur.currency)

  useEffect(() => {
    setDMin(sp.get('minPrice') ?? '')
    setDMax(sp.get('maxPrice') ?? '')
    setDCur(sp.get('currency') ?? 'USD')
  }, [sp])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const n = activeCount(cur)
  const hasPrice = !!(cur.minPrice || cur.maxPrice)
  const priceLabel = fmtPrice(cur.minPrice, cur.maxPrice, cur.currency)

  const push = useCallback((updates: Record<string, string>) => {
    const p = new URLSearchParams(sp.toString())
    for (const [k, v] of Object.entries(updates)) v ? p.set(k, v) : p.delete(k)
    p.delete('offset')
    startTransition(() => { router.push(`${pathname}?${p.toString()}`, { scroll: false }) })
  }, [router, pathname, sp])

  const clearAll = useCallback(() => {
    startTransition(() => { router.push(pathname, { scroll: false }) })
    setDrawerOpen(false)
    setOpenPop(null)
  }, [router, pathname])

  const toggle = (name: typeof openPop) => setOpenPop((p) => p === name ? null : name)
  const orderLabel = ORDERS.find((o) => o.value === cur.orderBy)?.label ?? 'Ordenar'

  const applyPrice = () => {
    push({ minPrice: dMin, maxPrice: dMax, currency: dCur })
    setOpenPop(null)
  }

  return (
    <>
      {/* ================================================================
          DESKTOP BAR (md+)
          ================================================================ */}
      <div className="hidden md:block bg-white border-b border-gray-100 sticky top-[68px] z-30 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-1.5 h-14">

            {/* Operación */}
            <div className="flex items-center gap-0.5 shrink-0">
              {OPS.map((op) => (
                <button key={op.value} type="button"
                  onClick={() => push({ operation: op.value })}
                  className={[
                    'h-9 px-4 text-[10.5px] font-bold tracking-[0.12em] uppercase transition-all duration-150 rounded-full',
                    cur.operation === op.value
                      ? 'bg-[#C41230] text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {op.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-lx-line/70 mx-1.5 shrink-0" />

            {/* Tipo */}
            <div ref={typeRef} className="relative shrink-0">
              <PillButton
                label={cur.type ? (TYPE_LABEL[cur.type] ?? 'Tipo') : 'Tipo'}
                active={!!cur.type} open={openPop === 'type'}
                onClick={() => toggle('type')}
              />
              <Popover open={openPop === 'type'} anchorRef={typeRef} onClose={() => setOpenPop(null)} width="min-w-[196px]">
                <PopLabel>Tipo de propiedad</PopLabel>
                <div className="py-1">
                  {TYPES.map((t) => (
                    <CheckItem key={t.value} label={t.label} checked={cur.type === t.value}
                      onToggle={() => { push({ type: cur.type === t.value ? '' : t.value }); setOpenPop(null) }}
                    />
                  ))}
                </div>
              </Popover>
            </div>

            {/* Barrio */}
            <div className="w-44 lg:w-52 shrink-0">
              <LocationAutocomplete
                value={cur.location} displayName={cur.locationName}
                onChange={(id, name) => { push({ location: id, location_name: name }); setOpenPop(null) }}
                placeholder="Barrio o zona..." theme="light"
              />
            </div>

            {/* Ambientes */}
            <div ref={roomsRef} className="relative shrink-0">
              <PillButton
                label={cur.minRooms ? `${cur.minRooms}+ amb.` : 'Ambientes'}
                active={!!cur.minRooms} open={openPop === 'rooms'}
                onClick={() => toggle('rooms')}
              />
              <Popover open={openPop === 'rooms'} anchorRef={roomsRef} onClose={() => setOpenPop(null)} width="w-52">
                <PopLabel>Mínimo de ambientes</PopLabel>
                <div className="px-3 py-3 grid grid-cols-4 gap-1.5">
                  {ROOMS.map((r) => (
                    <button key={r.value} type="button"
                      onClick={() => { push({ minRooms: cur.minRooms === r.value ? '' : r.value }); setOpenPop(null) }}
                      className={[
                          'py-2.5 text-[12px] font-bold border transition-colors duration-100 rounded-full',
                          cur.minRooms === r.value
                            ? 'bg-[#C41230] text-white border-[#C41230]'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900',
                      ].join(' ')}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {cur.minRooms && (
                  <div className="border-t border-lx-line/40 px-4 py-2.5">
                    <button type="button" onClick={() => { push({ minRooms: '' }); setOpenPop(null) }}
                      className="text-[10px] text-lx-stone/60 hover:text-lx-ink underline underline-offset-2 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                )}
              </Popover>
            </div>

            {/* Precio */}
            <div ref={priceRef} className="relative shrink-0">
              <PillButton
                label={hasPrice ? priceLabel : 'Precio'}
                active={hasPrice} open={openPop === 'price'}
                onClick={() => toggle('price')}
              />
              <Popover open={openPop === 'price'} anchorRef={priceRef} onClose={() => setOpenPop(null)} width="w-72">
                <div className="p-5">
                  <p className="text-[9px] font-bold tracking-[0.20em] uppercase text-lx-stone/50 mb-3">Rango de precio</p>
                  <div className="flex gap-2 mb-4">
                    {['USD', 'ARS'].map((c) => (
                      <button key={c} type="button" onClick={() => setDCur(c)}
                        className={[
                          'flex-1 py-2.5 text-[10.5px] font-bold tracking-[0.10em] uppercase border transition-colors rounded-full',
                          dCur === c ? 'bg-[#C41230] text-white border-[#C41230]' : 'border-gray-200 text-gray-500 hover:border-gray-400',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {/* Presets rápidos */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(dCur === 'USD'
                      ? [['', '100000', '<100k'], ['100000', '200000', '100–200k'], ['200000', '350000', '200–350k'], ['350000', '', '+350k']]
                      : [['', '30000000', '<30M'], ['30000000', '70000000', '30–70M'], ['70000000', '', '+70M']]
                    ).map(([min, max, label]) => (
                      <button key={label} type="button"
                        onClick={() => { setDMin(min); setDMax(max) }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          dMin === min && dMax === max
                            ? 'bg-[#C41230] text-white border-[#C41230]'
                            : 'border-gray-200 text-gray-600 hover:border-[#C41230] hover:text-[#C41230]'
                        }`}
                      >
                        {dCur} {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
                      <input type="number" placeholder="Sin mínimo" value={dMin}
                        onChange={(e) => setDMin(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                        className="w-full border border-gray-200 px-3 py-2 text-[13px] rounded-lg outline-none focus:border-[#C41230] placeholder:text-gray-300 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
                      <input type="number" placeholder="Sin máximo" value={dMax}
                        onChange={(e) => setDMax(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                        className="w-full border border-gray-200 px-3 py-2 text-[13px] rounded-lg outline-none focus:border-[#C41230] placeholder:text-gray-300 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => { setDMin(''); setDMax(''); setDCur('USD'); push({ minPrice: '', maxPrice: '', currency: '' }); setOpenPop(null) }}
                      className="flex-1 py-2.5 text-[10.5px] font-bold tracking-[0.08em] uppercase border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors rounded-full"
                    >
                      Limpiar
                    </button>
                    <button type="button" onClick={applyPrice}
                      className="flex-1 py-2.5 text-[10.5px] font-bold tracking-[0.08em] uppercase bg-[#C41230] text-white hover:bg-[#a00f27] transition-colors rounded-full"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </Popover>
            </div>

            <div className="w-px h-5 bg-lx-line/70 mx-1.5 shrink-0" />

            {/* Ordenar */}
            <div ref={orderRef} className="relative shrink-0">
              <PillButton
                label={orderLabel}
                open={openPop === 'order'}
                onClick={() => toggle('order')}
              />
              <Popover open={openPop === 'order'} anchorRef={orderRef} onClose={() => setOpenPop(null)} align="right" width="w-56">
                <PopLabel>Ordenar por</PopLabel>
                <div className="py-1">
                  {ORDERS.map((o) => (
                    <RadioItem key={o.value} label={o.label} selected={cur.orderBy === o.value}
                      onSelect={() => { push({ orderBy: o.value }); setOpenPop(null) }}
                    />
                  ))}
                </div>
              </Popover>
            </div>

            <div className="flex-1 min-w-0" />

            <AnimatePresence>
              {isPending && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[9px] font-bold tracking-[0.18em] uppercase text-lx-accent shrink-0"
                >
                  Buscando…
                </motion.span>
              )}
            </AnimatePresence>

            {totalCount !== undefined && (
              <span className={`text-[11px] font-medium text-lx-stone shrink-0 tabular-nums transition-opacity ${isPending ? 'opacity-30' : ''}`}>
                <span className="font-bold text-lx-ink">{totalCount.toLocaleString('es-AR')}</span>{' '}
                {totalCount === 1 ? 'propiedad' : 'propiedades'}
              </span>
            )}

            <AnimatePresence>
              {n > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                  type="button" onClick={clearAll}
                  className="h-9 px-3 text-[10px] font-medium text-lx-stone/70 hover:text-lx-ink underline underline-offset-2 transition-colors shrink-0 whitespace-nowrap"
                >
                  Limpiar
                </motion.button>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ================================================================
          MOBILE BAR (< md)
          ================================================================ */}
      <div className="md:hidden bg-white border-b border-gray-100 sticky top-[68px] z-30 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 px-4 h-12">
          <div className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
            {OPS.map((op) => (
              <button key={op.value} type="button"
                onClick={() => push({ operation: op.value })}
                className={[
                  'shrink-0 h-8 px-3 text-[9.5px] font-bold tracking-[0.12em] uppercase transition-colors rounded-full',
                  cur.operation === op.value ? 'bg-[#C41230] text-white' : 'text-gray-500',
                ].join(' ')}
              >
                {op.label}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => setDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 h-8 px-3 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors bg-white rounded-full"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span className="text-[9.5px] font-bold tracking-[0.10em] uppercase">
              Filtros
              {n > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-lx-accent text-white text-[8px] font-bold rounded-full">
                  {n}
                </span>
              )}
            </span>
          </button>

          {totalCount !== undefined && (
            <span className={`shrink-0 text-[9px] text-lx-stone tabular-nums transition-opacity ${isPending ? 'opacity-30' : ''}`}>
              {isPending ? '…' : totalCount.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        <AnimatePresence>
          {n > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5 flex-wrap px-4 pb-2.5">
                <AnimatePresence>
                  {cur.operation && <Badge label={OP_LABEL[cur.operation]} onRemove={() => push({ operation: '' })} />}
                  {cur.type && <Badge label={TYPE_LABEL[cur.type] ?? cur.type} onRemove={() => push({ type: '' })} />}
                  {cur.locationName && <Badge label={cur.locationName} onRemove={() => push({ location: '', location_name: '' })} />}
                  {cur.minRooms && <Badge label={`${cur.minRooms}+ amb.`} onRemove={() => push({ minRooms: '' })} />}
                  {hasPrice && <Badge label={priceLabel} onRemove={() => push({ minPrice: '', maxPrice: '', currency: '' })} />}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================================================================
          MOBILE DRAWER
          ================================================================ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              {...drawerAnim}
              className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white flex flex-col max-h-[92svh] rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
              role="dialog" aria-modal="true" aria-label="Filtros"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-lx-line" />
              </div>

              <div className="flex items-center justify-between px-5 py-3.5 border-b border-lx-line shrink-0">
                <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink">
                  Filtros
                  {n > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-[#C41230] text-white text-[9px] font-bold rounded-full">
                      {n}
                    </span>
                  )}
                </h2>
                <button type="button" onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-lx-stone hover:text-lx-ink transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

                <div>
                  <DrawerLabel>Tipo de propiedad</DrawerLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map((t) => (
                      <button key={t.value} type="button"
                        onClick={() => push({ type: cur.type === t.value ? '' : t.value })}
                        className={[
                          'py-3 px-3 text-[12px] font-medium border text-left transition-colors rounded-xl',
                          cur.type === t.value ? 'bg-[#C41230] text-white border-[#C41230]' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900',
                        ].join(' ')}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <DrawerLabel>Barrio o zona</DrawerLabel>
                  <LocationAutocomplete
                    value={cur.location} displayName={cur.locationName}
                    onChange={(id, name) => push({ location: id, location_name: name })}
                    placeholder="Buscar barrio..." theme="light"
                  />
                </div>

                <div>
                  <DrawerLabel>Ambientes mínimos</DrawerLabel>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => push({ minRooms: '' })}
                      className={`flex-1 py-3 text-[11px] font-bold border transition-colors rounded-sm ${
                        !cur.minRooms ? 'bg-[#C41230] text-white border-[#C41230]' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      Todos
                    </button>
                    {ROOMS.map((r) => (
                      <button key={r.value} type="button" onClick={() => push({ minRooms: r.value })}
                        className={[
                          'flex-1 py-3 text-[11px] font-bold border transition-colors rounded-sm',
                          cur.minRooms === r.value ? 'bg-[#C41230] text-white border-[#C41230]' : 'border-gray-200 text-gray-500 hover:border-gray-400',
                        ].join(' ')}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <DrawerLabel>Precio</DrawerLabel>
                  <div className="flex gap-2 mb-3">
                    {['USD', 'ARS'].map((c) => (
                      <button key={c} type="button" onClick={() => setDCur(c)}
                        className={[
                          'flex-1 py-2.5 text-[11px] font-bold tracking-[0.08em] uppercase border transition-colors rounded-sm',
                          dCur === c ? 'bg-[#C41230] text-white border-[#C41230]' : 'border-gray-200 text-gray-500',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
                      <input type="number" placeholder="Sin mínimo" value={dMin}
                        onChange={(e) => setDMin(e.target.value)}
                        className="w-full border border-lx-line px-3 py-3 text-sm rounded-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/30 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
                      <input type="number" placeholder="Sin máximo" value={dMax}
                        onChange={(e) => setDMax(e.target.value)}
                        className="w-full border border-lx-line px-3 py-3 text-sm rounded-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/30 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <DrawerLabel>Ordenar por</DrawerLabel>
                  <div className="space-y-1.5">
                    {ORDERS.map((o) => (
                      <button key={o.value} type="button" onClick={() => push({ orderBy: o.value })}
                        className={[
                          'w-full text-left py-3 px-4 text-[12.5px] border transition-colors rounded-sm',
                          cur.orderBy === o.value ? 'border-[#C41230] text-[#C41230] bg-red-50' : 'border-gray-200 text-gray-500 hover:border-gray-400',
                        ].join(' ')}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="shrink-0 px-5 py-4 border-t border-lx-line bg-white">
                <div className="flex items-center gap-3">
                  {n > 0 && (
                    <button type="button" onClick={clearAll}
                      className="text-[10.5px] text-lx-stone hover:text-lx-ink underline underline-offset-2 transition-colors whitespace-nowrap"
                    >
                      Limpiar filtros
                    </button>
                  )}
                  <button type="button"
                    onClick={() => {
                      if (dMin !== cur.minPrice || dMax !== cur.maxPrice || dCur !== cur.currency) {
                        push({ minPrice: dMin, maxPrice: dMax, currency: dCur })
                      }
                      setDrawerOpen(false)
                    }}
                    className="flex-1 bg-[#C41230] text-white text-[11px] font-bold tracking-[0.14em] uppercase py-4 rounded-full hover:bg-[#a00f27] transition-colors duration-200"
                  >
                    {totalCount !== undefined && !isPending
                      ? `Ver ${totalCount.toLocaleString('es-AR')} ${totalCount === 1 ? 'propiedad' : 'propiedades'}`
                      : 'Ver resultados'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
