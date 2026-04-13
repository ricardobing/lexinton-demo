'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isAlquiler = property.operation === 'Alquiler' || property.operation === 'Alquiler Temporal'

  return (
    <article className="bg-white border border-lx-border flex flex-col cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        {/* Operation badge */}
        <span
          className={cn(
            'absolute top-3 left-3 text-[10px] font-medium tracking-[0.12em] uppercase px-2.5 py-1',
            isAlquiler
              ? 'bg-lx-dark text-white'
              : 'bg-lx-red text-white',
          )}
        >
          {property.operation}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-lx-mid text-[11px] uppercase tracking-[0.1em] mb-2">
          <LocationIcon />
          <span>
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Address / Title */}
        <h3 className="text-[14px] font-medium text-lx-dark leading-snug mb-3">
          {property.address}
        </h3>

        {/* Price */}
        <p className="text-[19px] font-medium text-lx-dark tracking-tight mb-4">
          {property.priceLabel}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-3 border-t border-lx-border text-lx-mid text-[12px]">
          {typeof property.bedrooms === 'number' && (
            <span className="flex items-center gap-1.5">
              <BedIcon />
              {property.bedrooms} dorm.
            </span>
          )}
          {typeof property.bathrooms === 'number' && (
            <span className="flex items-center gap-1.5">
              <BathIcon />
              {property.bathrooms} baño{property.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.garage && (
            <span className="flex items-center gap-1.5">
              <GarageIcon />
              Cochera
            </span>
          )}
          <span className="flex items-center gap-1.5 ml-auto">
            <AreaIcon />
            {property.surface} m²
          </span>
        </div>
      </div>
    </article>
  )
}

function LocationIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" />
      <path d="M22 8H2" />
      <path d="M22 20V8l-2-4H4L2 8" />
      <path d="M6 8v4" />
      <path d="M2 16h20" />
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
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}
