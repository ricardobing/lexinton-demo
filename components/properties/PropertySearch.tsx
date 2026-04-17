'use client'

/**
 * PropertySearch — Barra de filtros avanzada para /propiedades
 *
 * Desktop (md+): sticky bar con todos los filtros inline.
 *   Operación · Tipo · Barrio · Ambientes · Precio ▾ · Ordenar
 *   El botón "Precio" abre un popover con min/max y moneda.
 *
 * Mobile:  barra compacta (operación + botón Filtros) +
 *          bottom drawer con todos los filtros.
 *
 * URL params: operation, type, location, location_name,
 *             minRooms, minPrice, maxPrice, currency, orderBy, offset
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition, useEffect, useRef } from 'react'
import LocationAutocomplete from '@/components/search/LocationAutocomplete'

// ─── Constantes ───────────────────────────────────────────────────────────────

const OPERATION_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'Sale', label: 'Venta' },
  { value: 'Rent', label: 'Alquiler' },
  { value: 'Temporary Rent', label: 'Temporal' },
]

const PROPERTY_TYPES = [
  { value: '', label: 'Tipo' },
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
  { value: '', label: 'Amb.' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
]

const ORDER_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio ↑' },
  { value: 'price_desc', label: 'Precio ↓' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formatea precio para el badge: "USD 50k–200k" */
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
  if (a) return `${cur} +${a}`
  if (b) return `${cur} hasta ${b}`
  return ''
}

function countActiveFilters(p: {
  operation: string; type: string; location: string
  minRooms: string; minPrice: string; maxPrice: string
}) {
  return [p.operation, p.type, p.location, p.minRooms, p.minPrice || p.maxPrice].filter(Boolean).length
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PropertySearchProps {
  totalCount?: number
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PropertySearch({ totalCount }: PropertySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const priceRef = useRef<HTMLDivElement>(null)

  // ── Estado local del popover de precio (se aplica al hacer click) ──────────
  const [draftMin, setDraftMin] = useState(searchParams.get('minPrice') ?? '')
  const [draftMax, setDraftMax] = useState(searchParams.get('maxPrice') ?? '')
  const [draftCur, setDraftCur] = useState(searchParams.get('currency') ?? 'USD')

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

  const activeCount = countActiveFilters(current)
  const priceLabel = formatPriceLabel(current.minPrice, current.maxPrice, current.currency)
  const hasPriceFilter = !!(current.minPrice || current.maxPrice)

  // Sync drafts when URL changes (e.g. limpiar)
  useEffect(() => {
    setDraftMin(searchParams.get('minPrice') ?? '')
    setDraftMax(searchParams.get('maxPrice') ?? '')
    setDraftCur(searchParams.get('currency') ?? 'USD')
  }, [searchParams])

  // Cerrar popover precio al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!priceRef.current?.contains(e.target as Node)) setPriceOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Bloquear scroll cuando drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

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

  const applyPrice = () => {
    updateParams({ minPrice: draftMin, maxPrice: draftMax, currency: draftCur })
    setPriceOpen(false)
  }

  const clearPrice = () => {
    setDraftMin(''); setDraftMax(''); setDraftCur('USD')
    updateParams({ minPrice: '', maxPrice: '', currency: '' })
    setPriceOpen(false)
  }

  const clearAll = useCallback(() => {
    startTransition(() => { router.push(pathname, { scroll: false }) })
    setDrawerOpen(false)
  }, [router, pathname])

  // ── Sub-componentes ────────────────────────────────────────────────────────

  const OperationPills = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
    <div className="flex gap-1 flex-wrap">
      {OPERATION_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => { updateParams({ operation: opt.value }); setDrawerOpen(false) }}
          className={`font-bold tracking-[0.13em] uppercase transition-colors duration-150 ${
            size === 'md' ? 'px-4 py-2.5 text-[11px]' : 'px-3 py-1.5 text-[10px]'
          } ${
            current.operation === opt.value
              ? 'bg-lx-ink text-white border border-lx-ink'
              : 'text-lx-stone hover:text-lx-ink border border-lx-line hover:border-lx-stone'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  const TypeSelect = ({ full = false }: { full?: boolean }) => (
    <div className="relative">
      <select
        value={current.type}
        onChange={(e) => updateParams({ type: e.target.value })}
        className={`cursor-pointer outline-none bg-transparent border border-lx-line hover:border-lx-stone focus:border-lx-accent transition-colors appearance-none pr-7 ${
          full
            ? 'w-full py-3 px-3 text-[13px] text-lx-ink'
            : 'px-3 py-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase text-lx-stone'
        }`}
      >
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {full && !t.value ? 'Todos los tipos' : t.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-lx-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
      </svg>
    </div>
  )

  const RoomsPills = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
    <div className="flex gap-1">
      {ROOMS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => updateParams({ minRooms: opt.value })}
          className={`font-bold tracking-[0.13em] uppercase transition-colors duration-150 ${
            size === 'md' ? 'py-2.5 px-4 text-[11px]' : 'px-3 py-1.5 text-[10px]'
          } ${
            current.minRooms === opt.value
              ? 'bg-lx-accent text-white border border-lx-accent'
              : 'text-lx-stone hover:text-lx-ink border border-lx-line hover:border-lx-stone'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  const OrderSelect = ({ full = false }: { full?: boolean }) => (
    <div className="relative">
      <select
        value={current.orderBy}
        onChange={(e) => updateParams({ orderBy: e.target.value })}
        className={`cursor-pointer outline-none bg-transparent border border-lx-line hover:border-lx-stone focus:border-lx-accent transition-colors appearance-none pr-7 ${
          full
            ? 'w-full py-3 px-3 text-[13px] text-lx-ink'
            : 'px-3 py-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase text-lx-stone'
        }`}
      >
        {ORDER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-lx-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
      </svg>
    </div>
  )

  /** Popover de precio — desktop */
  const PriceDropdown = () => (
    <div ref={priceRef} className="relative">
      <button
        type="button"
        onClick={() => setPriceOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase border transition-colors duration-150 ${
          hasPriceFilter
            ? 'border-lx-accent text-lx-accent bg-lx-accent/5'
            : 'border-lx-line text-lx-stone hover:border-lx-stone hover:text-lx-ink'
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
        </svg>
        {hasPriceFilter ? priceLabel : 'Precio'}
        <svg className={`w-2.5 h-2.5 transition-transform ${priceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {priceOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-lx-line shadow-lg w-64 p-4">
          {/* Moneda */}
          <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-2">Moneda</p>
          <div className="flex gap-1.5 mb-4">
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

          {/* Rango */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
              <input
                type="number"
                placeholder="Sin mínimo"
                value={draftMin}
                onChange={(e) => setDraftMin(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyPrice() }}
                className="w-full border border-lx-line px-3 py-2 text-sm text-lx-ink outline-none focus:border-lx-accent placeholder:text-lx-stone/40"
              />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
              <input
                type="number"
                placeholder="Sin máximo"
                value={draftMax}
                onChange={(e) => setDraftMax(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyPrice() }}
                className="w-full border border-lx-line px-3 py-2 text-sm text-lx-ink outline-none focus:border-lx-accent placeholder:text-lx-stone/40"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearPrice}
              className="flex-1 py-2 text-[10.5px] font-bold tracking-[0.12em] uppercase border border-lx-line text-lx-stone hover:text-lx-ink hover:border-lx-stone transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={applyPrice}
              className="flex-1 py-2 text-[10.5px] font-bold tracking-[0.12em] uppercase bg-lx-ink text-white hover:bg-lx-accent transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ============================================================
          DESKTOP BAR (md+)
          ============================================================ */}
      <div className="hidden md:block bg-lx-cream border-b border-lx-line sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2.5 lg:gap-3 flex-wrap py-3">

            <OperationPills />
            <Divider />

            <TypeSelect />
            <Divider />

            {/* Barrio */}
            <div className="w-48 lg:w-56">
              <LocationAutocomplete
                value={current.location}
                displayName={current.locationName}
                onChange={(id, name) => updateParams({ location: id, location_name: name })}
                placeholder="Barrio..."
                theme="light"
              />
            </div>
            <Divider />

            <RoomsPills />
            <Divider />

            <PriceDropdown />
            <Divider />

            <OrderSelect />

            <div className="flex-1 min-w-0" />

            {/* Estado carga */}
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

      {/* ============================================================
          MOBILE BAR (< md)
          ============================================================ */}
      <div className="md:hidden bg-lx-cream border-b border-lx-line sticky top-0 z-30 shadow-sm">
        {/* Fila operación + filtros */}
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
                    : 'text-lx-stone border border-lx-line'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-lx-line text-lx-stone hover:text-lx-ink hover:border-lx-stone transition-colors"
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
            <span className={`shrink-0 text-[9.5px] text-lx-stone tabular-nums transition-opacity ${isPending ? 'opacity-30' : ''}`}>
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

      {/* ============================================================
          MOBILE DRAWER — bottom sheet
          ============================================================ */}

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
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-lx-line rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-lx-line shrink-0">
          <h2 className="text-[12px] font-bold tracking-[0.10em] uppercase text-lx-ink">
            Filtros
            {activeCount > 0 && <span className="ml-1.5 text-lx-accent">({activeCount})</span>}
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 text-lx-stone hover:text-lx-ink transition-colors"
            aria-label="Cerrar filtros"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          <DrawerGroup label="Tipo de propiedad">
            <TypeSelect full />
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
            <RoomsPills size="md" />
          </DrawerGroup>

          {/* Precio en drawer */}
          <DrawerGroup label="Precio">
            {/* Moneda */}
            <div className="flex gap-2 mb-3">
              {['USD', 'ARS'].map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setDraftCur(cur)}
                  className={`flex-1 py-2.5 text-[11px] font-bold tracking-[0.12em] uppercase border transition-colors ${
                    draftCur === cur
                      ? 'bg-lx-ink text-white border-lx-ink'
                      : 'border-lx-line text-lx-stone hover:border-lx-stone'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
            {/* Rangos */}
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Desde</p>
                <input
                  type="number"
                  placeholder="Sin mínimo"
                  value={draftMin}
                  onChange={(e) => setDraftMin(e.target.value)}
                  className="w-full border border-lx-line px-3 py-3 text-sm text-lx-ink outline-none focus:border-lx-accent placeholder:text-lx-stone/40"
                />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1.5">Hasta</p>
                <input
                  type="number"
                  placeholder="Sin máximo"
                  value={draftMax}
                  onChange={(e) => setDraftMax(e.target.value)}
                  className="w-full border border-lx-line px-3 py-3 text-sm text-lx-ink outline-none focus:border-lx-accent placeholder:text-lx-stone/40"
                />
              </div>
            </div>
          </DrawerGroup>

          <DrawerGroup label="Ordenar por">
            <OrderSelect full />
          </DrawerGroup>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-lx-line bg-white">
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-lx-stone hover:text-lx-ink underline transition-colors whitespace-nowrap"
              >
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                // Si hay precio pendiente, aplicar antes de cerrar
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

function Divider() {
  return <div className="w-px h-5 bg-lx-line shrink-0" />
}

function DrawerGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-2.5">{label}</p>
      {children}
    </div>
  )
}

function ActiveBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-lx-parchment border border-lx-line text-[9.5px] font-medium text-lx-ink">
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
