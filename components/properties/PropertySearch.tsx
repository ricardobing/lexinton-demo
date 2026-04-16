'use client'

/**
 * PropertySearch — Buscador con filtros
 *
 * Actualiza la URL con searchParams al cambiar cualquier filtro.
 * Al ser Client Component, lee los params actuales del router.
 * El resultado se muestra en el Server Component padre (page.tsx).
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface FilterOption {
  value: string
  label: string
}

const OPERATION_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todas' },
  { value: 'Sale', label: 'Venta' },
  { value: 'Rent', label: 'Alquiler' },
  { value: 'Temporary Rent', label: 'Alquiler Temporal' },
]

const ROOMS_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todos' },
  { value: '1', label: '1 amb.' },
  { value: '2', label: '2 amb.' },
  { value: '3', label: '3 amb.' },
  { value: '4', label: '4+ amb.' },
]

const ORDER_OPTIONS: FilterOption[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

interface PropertySearchProps {
  totalCount?: number
}

export default function PropertySearch({ totalCount }: PropertySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Resetear offset al cambiar filtros
      if (key !== 'offset') params.delete('offset')

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  const current = {
    operation: searchParams.get('operation') ?? '',
    rooms: searchParams.get('minRooms') ?? '',
    orderBy: searchParams.get('orderBy') ?? 'newest',
  }

  const hasFilters = current.operation || current.rooms

  return (
    <div className="bg-lx-cream border-b border-lx-line sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

          {/* Operación */}
          <div className="flex gap-1.5 flex-wrap">
            {OPERATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParam('operation', opt.value)}
                className={`px-3.5 py-1.5 text-[10.5px] font-bold tracking-[0.14em] uppercase transition-colors duration-150 ${
                  current.operation === opt.value
                    ? 'bg-lx-ink text-white'
                    : 'bg-transparent text-lx-stone hover:text-lx-ink border border-lx-line hover:border-lx-stone'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="hidden sm:block w-px h-6 bg-lx-line shrink-0" />

          {/* Ambientes */}
          <div className="flex gap-1.5 flex-wrap">
            {ROOMS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParam('minRooms', opt.value)}
                className={`px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] uppercase transition-colors duration-150 ${
                  current.rooms === opt.value
                    ? 'bg-lx-accent text-white'
                    : 'bg-transparent text-lx-stone hover:text-lx-ink border border-lx-line hover:border-lx-stone'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="hidden sm:block w-px h-6 bg-lx-line shrink-0" />

          {/* Ordenar */}
          <select
            value={current.orderBy}
            onChange={(e) => updateParam('orderBy', e.target.value)}
            className="text-[10.5px] font-bold tracking-[0.12em] uppercase text-lx-stone bg-transparent border border-lx-line px-3 py-1.5 hover:border-lx-stone cursor-pointer outline-none focus:border-lx-accent sm:ml-auto"
          >
            {ORDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Limpiar filtros */}
          {hasFilters && (
            <button
              onClick={() => {
                startTransition(() => {
                  router.push(pathname, { scroll: false })
                })
              }}
              className="text-[10px] font-medium text-lx-stone/70 hover:text-lx-ink underline underline-offset-2 transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          {/* Contador */}
          {totalCount !== undefined && (
            <span className={`text-[10.5px] text-lx-stone shrink-0 ${isPending ? 'opacity-40' : ''}`}>
              {totalCount} {totalCount === 1 ? 'propiedad' : 'propiedades'}
            </span>
          )}

          {/* Loading indicator */}
          {isPending && (
            <span className="text-[10px] text-lx-accent uppercase tracking-wider">
              Buscando…
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
