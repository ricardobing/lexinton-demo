/**
 * FeaturedProperties — Server Component
 *
 * Lee propiedades reales de Tokko API directamente.
 * Al ser Server Component, la API key nunca llega al bundle del cliente.
 */

import { Suspense } from 'react'
import PropertyCard, { PropertyCardSkeleton } from '@/components/PropertyCard'
import { getFeaturedProperties } from '@/lib/tokko/queries'

async function PropertiesGrid() {
  const properties = await getFeaturedProperties(6)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {properties.map((property, i) => (
        <div key={property.id} className="flex flex-col h-full">
          <PropertyCard property={property} priority={i < 3} />
        </div>
      ))}
    </div>
  )
}

function PropertiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function FeaturedProperties() {
  return (
    <section id="seleccion" className="bg-lx-parchment py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-6 h-px bg-lx-accent" />
              <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent">
                Selección
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-lx-ink leading-[1.12] tracking-[-0.01em]">
              Propiedades<br />
              <em className="italic text-lx-stone">con criterio propio.</em>
            </h2>
          </div>
          <a
            href="/propiedades"
            className="hidden sm:inline-flex items-center gap-3 text-[11.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors duration-200 group shrink-0"
          >
            Ver todas
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Grid con Suspense para streaming */}
        <Suspense fallback={<PropertiesGridSkeleton />}>
          <PropertiesGrid />
        </Suspense>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-10 text-center">
          <a
            href="/propiedades"
            className="inline-flex items-center gap-3 text-[11.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors"
          >
            Ver todas las propiedades
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
