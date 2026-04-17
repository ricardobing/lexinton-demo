'use client'

/**
 * PropertySearch — Barra de filtros avanzada para /propiedades
 *
 * Design system:
 * - Filtros como botones con chevron → abren paneles popover flotantes
 * - Popovers custom: sin HTML <select>, sin bibliotecas externas
 * - Desktop: sticky top bar, todos los filtros en una fila
 * - Mobile: barra compacta (operación) + botón "Filtros" → bottom drawer
 * - Feedback visual: botón activo resaltado, badge con cantidad
 *
 * URL params: operation, type, location, location_name,
 *             minRooms, minPrice, maxPrice, currency, orderBy, offset
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  useCallback, useState, useTransition, useEffect, useRef, type ReactNode,
} from 'react'
import LocationAutocomplete from '@/components/search/LocationAutocomplete'

// ─── Datos ────────────────────────────────────────────────────────────────────

const OPERATION_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'Sale', label: 'Venta' },
  { value: 'Rent', label: 'Alquiler' },
  { value: 'Temporary Rent', label: 'Temporal' },
]

const PROPERTY_TYPES = [
  { value: '2', label: 'Departamento' },
  { value: '3', label: 'Casa' },
  { value: '13', label: 'PH' },
  { value: '31', label: 'Monoambiente' },
  { value: '1', label: 'Terreno' },
  { value: '10', label: 'Cochera' },
  { value: '7', label: 'Local' },
  { value: '5', label: 'Oficina' },
]

const ROOMS_OPTIONS = [
  { value: '1', label: '1 amb.' },
  { value: '2', label: '2 amb.' },
  { value: '3', label: '3 amb.' },
  { value: '4', label: '4+ amb.' },
]

const ORDER_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

const OP_LABEL: Record<string, string> = {
  Sale: 'Venta',
  Rent: 'Alquiler',
  'Temporary Rent': 'Temporal',
}

const TYPE_LABEL: Record<string, string> = {
  '2': 'Depto',
  '3': 'Casa',
  '13': 'PH',
  '31': 'Monoamb.',
  '1': 'Terreno',
  '10': 'Cochera',
  '7': 'Local',
  '5': 'Oficina',
}

function formatPriceLabel(min: string, max: string, currency: string): string {
  const fmt = (v: string) => {
    const n = parseInt(v, 10)
    if (isNaN(n)) return ''
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
    if (n >= 1_000) return `${Math.round(n / 1_000)}k`
    return String(n)
  }
  const cur = currency || 'USD'
  const a = fmt(min)
  const b = fmt(max)
  if (a && b) return `${cur} ${a}–${b}`
  if (a) return `${cur} desde ${a}`
  if (b) return `${cur} hasta ${b}`
  return ''
}

function countActive(p: {
  operation: string; type: string; location: string
  minRooms: string; minPrice: string; maxPrice: string
}) {
  return [p.operation, p.type, p.location, p.minRooms, p.minPrice || p.maxPrice].filter(Boolean).length
}

// ─── FilterButton ─────────────────────────────────────────────────────────────
// Botón estándar para los dropdowns de la barra

interface FilterButtonProps {
  label: string
  active?: boolean
  onClick: () => void
  open?: boolean
  className?: string
}

function FilterButton({ label, active, onClick, open, className = '' }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap border transition-all duration-150 ${
        active
          ? 'border-lx-ink bg-lx-ink text-white'
          : open
          ? 'border-lx-ink text-lx-ink bg-lx-parchment'
          : 'border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink bg-white'
      } ${className}`}
    >
      {label}
      <svg
        className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
      </svg>
    </button>
  )
}

// ─── Popover container ────────────────────────────────────────────────────────

function Popover({
  open, anchorRef, onClose, children, align = 'left',
}: {
  open: boolean
  anchorRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  children: ReactNode
  align?: 'left' | 'right'
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, anchorRef, onClose])

  if (!open) return null
  return (
    <div
      className={`absolute top-full mt-1.5 z-50 bg-white border border-lx-line shadow-xl min-w-[220px] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {children}
    </div>
  )
}

// ─── PopoverCheckItem ─────────────────────────────────────────────────────────

function PopoverCheckItem({
  label, checked, onToggle,
}: {
  label: string; checked: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-left transition-colors duration-100 ${
        checked ? 'text-lx-ink bg-lx-parchment/60' : 'text-lx-stone hover:text-lx-ink hover:bg-lx-cream/60'
      }`}
    >
      <span className={`w-4 h-4 flex items-center justify-center border shrink-0 transition-colors ${
        checked ? 'border-lx-ink bg-lx-ink' : 'border-lx-line'
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

// ─── PopoverRadioItem ─────────────────────────────────────────────────────────

function PopoverRadioItem({
  label, selected, onSelect,
}: {
  label: string; selected: boolean; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-left transition-colors duration-100 ${
        selected ? 'text-lx-ink bg-lx-parchment/60' : 'text-lx-stone hover:text-lx-ink hover:bg-lx-cream/60'
      }`}
    >
      <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
        selected ? 'border-lx-ink' : 'border-lx-line'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-lx-ink" />}
      </span>
      {label}
    </button>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PropertySearchProps {
  totalCount?: number
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PropertySearch({ totalCount }: PropertySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Popovers abiertos
  const [openPopover, setOpenPopover] = useState<
    'type' | 'rooms' | 'price' | 'order' | null
  >(null)

  // Refs para cada popover (click-outside)
  const typeRef = useRef<HTMLDivElement>(null!)
  const roomsRef = useRef<HTMLDivElement>(null!)
  const priceRef = useRef<HTMLDivElement>(null!)
  const orderRef = useRef<HTMLDivElement>(null!)

  // Estado actual desde URL
  const current = {
    operation: searchParams.get('operation') ?? '',
    type: searchParams.get('type') ?? '',
    location: searchParams.get('location') ?? '',
    locationName: searchParams.get('location_name') ?? '',
    minRooms: searchParams.get('minRooms') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    currency: searchParams.get('currency') ?? 'USD',
    orderBy: searchParams.get('orderBy') ?? 'newest',
  }

  // Drafts del popover precio
  const [draftMin, setDraftMin] = useState(current.minPrice)
  const [draftMax, setDraftMax] = useState(current.maxPrice)
  const [draftCur, setDraftCur] = useState(current.currency)

  // Sync drafts cuando cambia la URL
  useEffect(() => {
    setDraftMin(searchParams.get('minPrice') ?? '')
    setDraftMax(searchParams.get('maxPrice') ?? '')
    setDraftCur(searchParams.get('currency') ?? 'USD')
  }, [searchParams])

  // Bloquear scroll con drawer abierto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const activeCount = countActive(current)
  const hasPriceFilter = !!(current.minPrice || current.maxPrice)
  const priceLabel = formatPriceLabel(current.minPrice, current.maxPrice, current.currency)

  // ── URL helpers ────────────────────────────────────────────────────────────

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, val] of Object.entries(updates)) {
        if (val) params.set(key, val)
        else params.delete(key)
      }
      params.delete('offset')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  const clearAll = useCallback(() => {
    startTransition(() => { router.push(pathname, { scroll: false }) })
    setDrawerOpen(false)
    setOpenPopover(null)
  }, [router, pathname])

  const togglePopover = (name: typeof openPopover) => {
    setOpenPopover((prev) => (prev === name ? null : name))
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const orderLabel = ORDER_OPTIONS.find((o) => o.value === current.orderBy)?.label ?? 'Ordenar'

  return (
    <>
      {/* ================================================================
          DESKTOP BAR (md+)
          ================================================================ */}
      <div className="hidden md:block bg-white border-b border-lx-line sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">

            {/* Operación — pills */}
            <div className="flex gap-1">
              {OPERATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateParams({ operation: opt.value })}
                  className={`px-3.5 py-2 text-[10.5px] font-bold tracking-[0.14em] uppercase transition-all duration-150 ${
                    current.operation === opt.value
                      ? 'bg-lx-ink text-white'
                      : 'text-lx-stone border border-lx-line hover:border-lx-ink hover:text-lx-ink bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-lx-line shrink-0" />

            {/* Tipo */}
            <div ref={typeRef} className="relative">
              <FilterButton
                label={current.type ? (TYPE_LABEL[current.type] ?? 'Tipo') : 'Tipo de propiedad'}
                active={!!current.type}
                open={openPopover === 'type'}
                onClick={() => togglePopover('type')}
              />
              <Popover open={openPopover === 'type'} anchorRef={typeRef} onClose={() => setOpenPopover(null)}>
                <div className="py-2">
                  <p className="px-4 pb-2 pt-1 text-[9.5px] font-bold tracking-[0.18em] uppercase text-lx-stone/60">
                    Tipo de propiedad
                  </p>
                  {PROPERTY_TYPES.map((t) => (
                    <PopoverCheckItem
                      key={t.value}
                      label={t.label}
                      checked={current.type === t.value}
                      onToggle={() => {
                        updateParams({ type: current.type === t.value ? '' : t.value })
                        setOpenPopover(null)
                      }}
                    />
                  ))}
                  {current.type && (
                    <div className="px-4 pt-3 pb-2 border-t border-lx-line mt-1">
                      <button
                        type="button"
                        onClick={() => { updateParams({ type: '' }); setOpenPopover(null) }}
                        className="text-[10px] text-lx-stone hover:text-lx-ink underline transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>
              </Popover>
            </div>

            {/* Barrio */}
            <div className="w-48 lg:w-56">
              <LocationAutocomplete
                value={current.location}
                displayName={current.locationName}
                onChange={(id, name) => {
                  updateParams({ location: id, location_name: name })
                  setOpenPopover(null)
                }}
                placeholder="Barrio..."
                theme="light"
              />
            </div>

            {/* Ambientes */}
            <div ref={roomsRef} className="relative">
              <FilterButton
                label={current.minRooms ? `${current.minRooms}+ amb.` : 'Ambientes'}
                active={!!current.minRooms}
                open={openPopover === 'rooms'}
                onClick={() => togglePopover('rooms')}
              />
              <Popover open={openPopover === 'rooms'} anchorRef={roomsRef} onClose={() => setOpenPopover(null)}>
                <div className="py-2">
                  <p className="px-4 pb-2 pt-1 text-[9.5px] font-bold tracking-[0.18em] uppercase text-lx-stone/60">
                    Mínimo de ambientes
                  </p>
                  <PopoverRadioItem
                    label="Sin filtro"
                    selected={!current.minRooms}
                    onSelect={() => { updateParams({ minRooms: '' }); setOpenPopover(null) }}
                  />
                  {ROOMS_OPTIONS.map((r) => (
                    <PopoverRadioItem
                      key={r.value}
                      label={r.label}
                      selected={current.minRooms === r.value}
                      onSelect={() => { updateParams({ minRooms: r.value }); setOpenPopover(null) }}
                    />
                  ))}
                </div>
              </Popover>
            </div>

            {/* Precio */}
            <div ref={priceRef} className="relative">
              <FilterButton
                label={hasPriceFilter ? priceLabel : 'Precio'}
                active={hasPriceFilter}
                open={openPopover === 'price'}
                onClick={() => togglePopover('price')}
              />
              <Popover open={openPopover === 'price'} anchorRef={priceRef} onClose={() => setOpenPopover(null)}>
                <div className="p-4 w-64">
                  <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-lx-stone/60 mb-3">
                    Rango de precio
                  </p>
                  {/* Moneda */}
                  <div className="flex gap-2 mb-4">
                    {['USD', 'ARS'].map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setDraftCur(cur)}
                        className={`flex-1 py-2 text-[10.5px] font-bold tracking-[0.12em] uppercase border transition-colors ${
                          draftCur === cur
                            ? 'bg-lx-ink text-white border-lx-ink'
                            : 'border-lx-line text-lx-stone hover:border-lx-stone hover:text-lx-ink'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                  {/* Rangos */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
                      <input
                        type="number"
                        placeholder="Sin mínimo"
                        value={draftMin}
                        onChange={(e) => setDraftMin(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateParams({ minPrice: draftMin, maxPrice: draftMax, currency: draftCur })
                            setOpenPopover(null)
                          }
                        }}
                        className="w-full border border-lx-line px-3 py-2 text-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/40"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
                      <input
                        type="number"
                        placeholder="Sin máximo"
                        value={draftMax}
                        onChange={(e) => setDraftMax(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateParams({ minPrice: draftMin, maxPrice: draftMax, currency: draftCur })
                            setOpenPopover(null)
                          }
                        }}
                        className="w-full border border-lx-line px-3 py-2 text-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/40"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftMin(''); setDraftMax(''); setDraftCur('USD')
                        updateParams({ minPrice: '', maxPrice: '', currency: '' })
                        setOpenPopover(null)
                      }}
                      className="flex-1 py-2 text-[10.5px] font-bold tracking-[0.10em] uppercase border border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink transition-colors"
                    >
                      Limpiar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateParams({ minPrice: draftMin, maxPrice: draftMax, currency: draftCur })
                        setOpenPopover(null)
                      }}
                      className="flex-1 py-2 text-[10.5px] font-bold tracking-[0.10em] uppercase bg-lx-ink text-white hover:bg-lx-accent transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </Popover>
            </div>

            <div className="w-px h-5 bg-lx-line shrink-0" />

            {/* Ordenar */}
            <div ref={orderRef} className="relative">
              <FilterButton
                label={orderLabel}
                open={openPopover === 'order'}
                onClick={() => togglePopover('order')}
              />
              <Popover open={openPopover === 'order'} anchorRef={orderRef} onClose={() => setOpenPopover(null)} align="right">
                <div className="py-2 min-w-[200px]">
                  <p className="px-4 pb-2 pt-1 text-[9.5px] font-bold tracking-[0.18em] uppercase text-lx-stone/60">
                    Ordenar por
                  </p>
                  {ORDER_OPTIONS.map((o) => (
                    <PopoverRadioItem
                      key={o.value}
                      label={o.label}
                      selected={current.orderBy === o.value}
                      onSelect={() => { updateParams({ orderBy: o.value }); setOpenPopover(null) }}
                    />
                  ))}
                </div>
              </Popover>
            </div>

            <div className="flex-1" />

            {/* Estado */}
            {isPending && (
              <span className="text-[9.5px] font-medium tracking-[0.12em] uppercase text-lx-accent animate-pulse shrink-0">
                Buscando…
              </span>
            )}

            {/* Contador */}
            {totalCount !== undefined && (
              <span className={`text-[10.5px] text-lx-stone shrink-0 tabular-nums transition-opacity ${isPending ? 'opacity-30' : ''}`}>
                {totalCount} {totalCount === 1 ? 'propiedad' : 'propiedades'}
              </span>
            )}

            {activeCount > 0 && (
              <>
                <div className="w-px h-4 bg-lx-line shrink-0" />
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[10px] font-medium text-lx-stone/70 hover:text-lx-ink underline underline-offset-2 transition-colors shrink-0 whitespace-nowrap"
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================
          MOBILE BAR (< md)
          ================================================================ */}
      <div className="md:hidden bg-white border-b border-lx-line sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1 flex-1 min-w-0 overflow-x-auto">
            {OPERATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateParams({ operation: opt.value })}
                className={`shrink-0 px-2.5 py-1.5 text-[9.5px] font-bold tracking-[0.12em] uppercase transition-colors ${
                  current.operation === opt.value
                    ? 'bg-lx-ink text-white'
                    : 'text-lx-stone border border-lx-line bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-lx-line text-lx-stone hover:text-lx-ink hover:border-lx-ink transition-colors bg-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span className="text-[9.5px] font-bold tracking-[0.12em] uppercase">
              Filtros
              {activeCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 bg-lx-accent text-white text-[8px] font-bold px-0.5">
                  {activeCount}
                </span>
              )}
            </span>
          </button>

          {totalCount !== undefined && (
            <span className={`shrink-0 text-[9.5px] text-lx-stone tabular-nums ${isPending ? 'opacity-30' : ''}`}>
              {isPending ? '...' : totalCount}
            </span>
          )}
        </div>

        {/* Badges filtros activos */}
        {activeCount > 0 && (
          <div className="px-4 pb-2.5 flex items-center gap-1.5 flex-wrap">
            {current.operation && (
              <ActiveBadge label={OP_LABEL[current.operation]} onRemove={() => updateParams({ operation: '' })} />
            )}
            {current.type && (
              <ActiveBadge label={TYPE_LABEL[current.type] ?? current.type} onRemove={() => updateParams({ type: '' })} />
            )}
            {current.locationName && (
              <ActiveBadge label={current.locationName} onRemove={() => updateParams({ location: '', location_name: '' })} />
            )}
            {current.minRooms && (
              <ActiveBadge label={`${current.minRooms}+ amb.`} onRemove={() => updateParams({ minRooms: '' })} />
            )}
            {hasPriceFilter && (
              <ActiveBadge label={priceLabel} onRemove={() => updateParams({ minPrice: '', maxPrice: '', currency: '' })} />
            )}
            <button type="button" onClick={clearAll} className="text-[9.5px] text-lx-stone/60 hover:text-lx-ink underline transition-colors">
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* ================================================================
          MOBILE DRAWER
          ================================================================ */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white flex flex-col max-h-[90svh] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de búsqueda"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-lx-line rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-lx-line shrink-0">
          <h2 className="text-[12px] font-bold tracking-[0.10em] uppercase text-lx-ink">
            Filtros
            {activeCount > 0 && <span className="ml-1.5 text-lx-accent">({activeCount})</span>}
          </h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="p-1.5 text-lx-stone hover:text-lx-ink transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          <DrawerGroup label="Tipo de propiedad">
            <div className="grid grid-cols-2 gap-1.5">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateParams({ type: current.type === t.value ? '' : t.value })}
                  className={`py-2.5 px-3 text-[11.5px] font-medium border text-left transition-colors ${
                    current.type === t.value
                      ? 'border-lx-ink bg-lx-ink text-white'
                      : 'border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </DrawerGroup>

          <DrawerGroup label="Barrio o zona">
            <LocationAutocomplete
              value={current.location}
              displayName={current.locationName}
              onChange={(id, name) => updateParams({ location: id, location_name: name })}
              placeholder="Buscar barrio..."
              theme="light"
            />
          </DrawerGroup>

          <DrawerGroup label="Ambientes mínimos">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => updateParams({ minRooms: '' })}
                className={`flex-1 py-2.5 text-[11px] font-bold border transition-colors ${
                  !current.minRooms ? 'bg-lx-ink text-white border-lx-ink' : 'border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink'
                }`}
              >
                Todos
              </button>
              {ROOMS_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => updateParams({ minRooms: r.value })}
                  className={`flex-1 py-2.5 text-[11px] font-bold border transition-colors ${
                    current.minRooms === r.value
                      ? 'bg-lx-accent text-white border-lx-accent'
                      : 'border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink'
                  }`}
                >
                  {r.value}+
                </button>
              ))}
            </div>
          </DrawerGroup>

          <DrawerGroup label="Precio">
            <div className="flex gap-2 mb-3">
              {['USD', 'ARS'].map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setDraftCur(cur)}
                  className={`flex-1 py-2.5 text-[11px] font-bold tracking-[0.10em] uppercase border transition-colors ${
                    draftCur === cur
                      ? 'bg-lx-ink text-white border-lx-ink'
                      : 'border-lx-line text-lx-stone hover:border-lx-stone'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
                <input
                  type="number"
                  placeholder="Sin mínimo"
                  value={draftMin}
                  onChange={(e) => setDraftMin(e.target.value)}
                  className="w-full border border-lx-line px-3 py-3 text-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/40"
                />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
                <input
                  type="number"
                  placeholder="Sin máximo"
                  value={draftMax}
                  onChange={(e) => setDraftMax(e.target.value)}
                  className="w-full border border-lx-line px-3 py-3 text-sm outline-none focus:border-lx-ink placeholder:text-lx-stone/40"
                />
              </div>
            </div>
          </DrawerGroup>

          <DrawerGroup label="Ordenar por">
            <div className="space-y-1">
              {ORDER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => updateParams({ orderBy: o.value })}
                  className={`w-full text-left py-2.5 px-3 text-[12.5px] border transition-colors ${
                    current.orderBy === o.value
                      ? 'border-lx-ink text-lx-ink bg-lx-parchment/60'
                      : 'border-lx-line text-lx-stone hover:border-lx-ink hover:text-lx-ink'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </DrawerGroup>

        </div>

        <div className="shrink-0 px-5 py-4 border-t border-lx-line bg-white">
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="text-[11px] text-lx-stone hover:text-lx-ink underline transition-colors whitespace-nowrap">
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (draftMin !== current.minPrice || draftMax !== current.maxPrice || draftCur !== current.currency) {
                  updateParams({ minPrice: draftMin, maxPrice: draftMax, currency: draftCur })
                }
                setDrawerOpen(false)
              }}
              className="flex-1 bg-lx-ink text-white text-[11px] font-bold tracking-[0.16em] uppercase py-4 hover:bg-lx-accent transition-colors duration-200"
            >
              {totalCount !== undefined && !isPending
                ? `Ver ${totalCount} ${totalCount === 1 ? 'propiedad' : 'propiedades'}`
                : 'Ver resultados'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Auxiliares ───────────────────────────────────────────────────────────────

function DrawerGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-2.5">{label}</p>
      {children}
    </div>
  )
}

function ActiveBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-lx-parchment border border-lx-line text-[9.5px] font-medium text-lx-ink rounded-sm">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-lx-stone hover:text-lx-ink transition-colors ml-0.5"
        aria-label={`Quitar filtro ${label}`}
      >
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}
