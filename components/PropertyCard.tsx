'use client'

/**
 * PropertyCard — Tarjeta de propiedad para grids
 *
 * Muestra datos reales de Tokko API. Compatible con SSR y Client rendering.
 * Usado en: FeaturedProperties (home), PropertyGrid (listado /propiedades)
 */

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TokkoProperty } from '@/lib/tokko/types'
import {
  getCoverPhoto,
  getOperationLabel,
  getPropertyPriceLabel,
  getNeighborhood,
  getPropertyTypeLabel,
  formatArea,
  formatExpenses,
  makePropertySlug,
} from '@/lib/tokko/utils'

interface PropertyCardProps {
  property: TokkoProperty
  featured?: boolean
  priority?: boolean
}

export default function PropertyCard({ property, featured = false, priority = false }: PropertyCardProps) {
  const slug = makePropertySlug(property.id, property.address)
  const href = `/propiedades/${slug}`
  const coverPhoto = getCoverPhoto(property)
  const operationLabel = getOperationLabel(property)
  const priceLabel = getPropertyPriceLabel(property)
  const neighborhood = getNeighborhood(property)
  const typeLabel = getPropertyTypeLabel(property)
  const expenses = formatExpenses(property.expenses)

  const isAlquiler = operationLabel.toLowerCase().includes('alquiler')
  const surface = property.total_surface || property.roofed_surface || property.surface || 0
  const rooms = property.room_amount
  const bathrooms = property.bathroom_amount
  const parking = (property.parking_lot_amount ?? 0) > 0 || (property.covered_parking_lot ?? 0) > 0

  return (
    <Link href={href} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-lx-accent">
      <article className="bg-lx-cream border border-lx-line flex flex-col h-full cursor-pointer overflow-hidden">
        {/* Imagen */}
        <div className={cn('relative w-full overflow-hidden', featured ? 'aspect-[3/2]' : 'aspect-[16/10]')}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={coverPhoto}
              alt={property.fake_address || property.address}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={priority}
            />
          </motion.div>

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-lx-ink/0 group-hover:bg-lx-ink/20 transition-colors duration-500 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-white text-[10px] font-bold tracking-[0.2em] uppercase bg-lx-ink/80 px-4 py-2 backdrop-blur-sm">
              Ver propiedad →
            </span>
          </div>

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className={cn(
              'text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1',
              isAlquiler ? 'bg-lx-ink/85 text-white backdrop-blur-sm' : 'bg-lx-accent/90 text-white backdrop-blur-sm'
            )}>
              {operationLabel}
            </span>
            {neighborhood && (
              <span className="text-[9px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 bg-black/50 text-white backdrop-blur-sm">
                {neighborhood}
              </span>
            )}
          </div>

          {/* Tipo bottom-right */}
          {typeLabel && (
            <span className="absolute bottom-3 right-3 text-[9px] font-medium tracking-[0.12em] uppercase px-2 py-0.5 bg-white/90 text-lx-ink backdrop-blur-sm">
              {typeLabel}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[14px] font-medium text-lx-ink leading-snug mb-3 line-clamp-2">
            {property.fake_address || property.address}
          </h3>

          <p className="font-serif text-[1.6rem] font-normal text-lx-ink tracking-tight leading-none mb-1">
            {priceLabel}
          </p>

          {expenses && (
            <p className="text-[11px] text-lx-stone mb-3">Expensas: {expenses}</p>
          )}

          {featured && property.description && (
            <p className="text-[12px] text-lx-stone leading-relaxed mb-3 line-clamp-2">
              {property.description.split('Consulta por esta propiedad')[0].trim().slice(0, 120)}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-4 border-t border-lx-line text-lx-stone text-[11px]">
            {typeof rooms === 'number' && rooms > 0 && (
              <span className="flex items-center gap-1.5"><RoomsIcon />{rooms} amb.</span>
            )}
            {typeof bathrooms === 'number' && bathrooms > 0 && (
              <span className="flex items-center gap-1.5"><BathIcon />{bathrooms} baño{bathrooms !== 1 ? 's' : ''}</span>
            )}
            {parking && (
              <span className="flex items-center gap-1.5"><GarageIcon />Cochera</span>
            )}
            {surface > 0 && (
              <span className="flex items-center gap-1.5 ml-auto"><AreaIcon />{formatArea(surface)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export function PropertyCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="animate-pulse bg-lx-cream border border-lx-line flex flex-col">
      <div className={cn('bg-gray-200', featured ? 'aspect-[3/2]' : 'aspect-[16/10]')} />
      <div className="p-5 space-y-3">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-7 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4 pt-4 border-t border-lx-line">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-14 ml-auto" />
        </div>
      </div>
    </div>
  )
}

function RoomsIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function BathIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  )
}
function GarageIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v3h-7V8Z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
function AreaIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  )
}
