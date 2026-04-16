/**
 * /propiedades — Listado completo con filtros y paginación
 *
 * Server Component: lee las propiedades de Tokko en el servidor.
 * Los filtros se leen de searchParams (URL) → permite compartir búsquedas y SEO correcto.
 *
 * URL ejemplo: /propiedades?operation=Sale&minRooms=2&orderBy=price_asc
 */

import { Suspense } from 'react'
import type { Metadata } from 'next'
import PropertyCard, { PropertyCardSkeleton } from '@/components/PropertyCard'
import PropertySearch from '@/components/properties/PropertySearch'
import { getProperties } from '@/lib/tokko/queries'
import type { PropertyFilters } from '@/lib/tokko/types'

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const hasFilters = !!(searchParams.operation || searchParams.minRooms || searchParams.type || searchParams.location)
  const opLabel = searchParams.operation === 'Sale' ? 'en Venta'
    : searchParams.operation === 'Rent' ? 'en Alquiler'
    : 'en Venta y Alquiler'
  return {
    title: `Propiedades ${opLabel} | Lexinton Propiedades`,
    description: 'Encontrá tu próxima propiedad en Lexinton. Departamentos, casas, PHs y locales en Palermo, Belgrano, Villa Urquiza, Coghlan y toda Capital Federal.',
    alternates: { canonical: 'https://lexinton.com.ar/propiedades' },
    robots: hasFilters
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}


interface PageProps {
  searchParams: {
    operation?: string
    type?: string
    location?: string
    minRooms?: string
    maxRooms?: string
    minPrice?: string
    maxPrice?: string
    currency?: string
    limit?: string
    offset?: string
    orderBy?: string
  }
}

const ITEMS_PER_PAGE = 24

async function PropertyList({ searchParams }: PageProps) {
  const filters: PropertyFilters = {
    limit: ITEMS_PER_PAGE,
    offset: searchParams.offset ? parseInt(searchParams.offset, 10) : 0,
  }

  const op = searchParams.operation
  if (op === 'Sale' || op === 'Rent' || op === 'Temporary Rent') {
    filters.operation = op
  }

  if (searchParams.type) filters.propertyType = parseInt(searchParams.type, 10)
  if (searchParams.location) filters.locationId = parseInt(searchParams.location, 10)
  if (searchParams.minRooms) filters.minRooms = parseInt(searchParams.minRooms, 10)
  if (searchParams.maxRooms) filters.maxRooms = parseInt(searchParams.maxRooms, 10)
  if (searchParams.minPrice) filters.minPrice = parseInt(searchParams.minPrice, 10)
  if (searchParams.maxPrice) filters.maxPrice = parseInt(searchParams.maxPrice, 10)

  const cur = searchParams.currency
  if (cur === 'USD' || cur === 'ARS') filters.currency = cur

  const ord = searchParams.orderBy
  if (ord === 'price_asc' || ord === 'price_desc' || ord === 'newest' || ord === 'oldest') {
    filters.orderBy = ord
  }

  const { properties, total } = await getProperties(filters)

  const currentOffset = filters.offset ?? 0
  const hasMore = currentOffset + ITEMS_PER_PAGE < total
  const hasPrev = currentOffset > 0

  if (properties.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-2xl text-lx-stone mb-4">
          No encontramos propiedades con esos filtros.
        </p>
        <a href="/propiedades" className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-accent hover:underline">
          Ver todas las propiedades
        </a>
      </div>
    )
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-lx-line">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Paginación */}
      {(hasPrev || hasMore) && (
        <div className="flex items-center justify-center gap-4 mt-12">
          {hasPrev && (
            <a
              href={buildPageUrl(searchParams, Math.max(0, currentOffset - ITEMS_PER_PAGE))}
              className="px-5 py-2.5 text-[10.5px] font-bold tracking-[0.14em] uppercase border border-lx-line text-lx-stone hover:text-lx-ink hover:border-lx-stone transition-colors"
            >
              ← Anterior
            </a>
          )}
          <span className="text-[11px] text-lx-stone">
            {currentOffset + 1}–{Math.min(currentOffset + ITEMS_PER_PAGE, total)} de {total}
          </span>
          {hasMore && (
            <a
              href={buildPageUrl(searchParams, currentOffset + ITEMS_PER_PAGE)}
              className="px-5 py-2.5 text-[10.5px] font-bold tracking-[0.14em] uppercase border border-lx-line text-lx-stone hover:text-lx-ink hover:border-lx-stone transition-colors"
            >
              Siguiente →
            </a>
          )}
        </div>
      )}
    </>
  )
}

function buildPageUrl(params: PageProps['searchParams'], offset: number): string {
  const p = new URLSearchParams()
  if (params.operation) p.set('operation', params.operation)
  if (params.type) p.set('type', params.type)
  if (params.location) p.set('location', params.location)
  if (params.minRooms) p.set('minRooms', params.minRooms)
  if (params.orderBy) p.set('orderBy', params.orderBy)
  if (offset > 0) p.set('offset', String(offset))
  return `/propiedades?${p.toString()}`
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-lx-line">
      {Array.from({ length: 12 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function PropiedadesPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-lx-parchment">
      {/* Header de página */}
      <div className="bg-lx-ink text-white pt-[calc(68px+4rem)] pb-16 sm:pt-[calc(68px+5rem)] sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent/80 mb-4">
            Lexinton Propiedades
          </p>
          <h1 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.1] tracking-[-0.01em]">
            {searchParams.operation === 'Sale' ? 'Propiedades en Venta' :
             searchParams.operation === 'Rent' ? 'Propiedades en Alquiler' :
             'Todas las Propiedades'}
          </h1>
        </div>
      </div>

      {/* Buscador sticky */}
      <Suspense>
        <PropertySearch />
      </Suspense>

      {/* Listado */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <Suspense fallback={<GridSkeleton />}>
          <PropertyList searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}
