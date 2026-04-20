'use client'

/**
 * PropertyDetailClient — Client wrapper for property detail with Framer Motion animations
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import PropertyCard from '@/components/PropertyCard'
import PropertyContact from '@/components/properties/PropertyContact'
import type { TokkoProperty, TokkoTag } from '@/lib/tokko/types'
import ShareButton from '@/components/properties/ShareButton'
import { formatExpenses, TAG_LABELS } from '@/lib/tokko/utils'

const ease = [0.22, 1, 0.36, 1] as const

interface Props {
  property: TokkoProperty
  stats: { label: string; value: string | number }[]
  description: string
  tags: TokkoTag[]
  operationLabel: string
  priceLabel: string
  neighborhood: string
  propertyType: string
  coordinates: { lat: number; lng: number } | null
  isRent: boolean
  similarProperties: TokkoProperty[]
}

export default function PropertyDetailClient({
  property, stats, description, tags, operationLabel, priceLabel,
  neighborhood, propertyType, coordinates, isRent, similarProperties,
}: Props) {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">

        {/* Columna izquierda */}
        <div className="min-w-0">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8 pb-8 border-b border-lx-line"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-stone">
                {propertyType}
              </span>
              {neighborhood && (
                <>
                  <span className="text-lx-line">·</span>
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-accent">
                    {neighborhood}
                  </span>
                </>
              )}
              {property.credit_eligible === 'Eligible' && (
                <>
                  <span className="text-lx-line">·</span>
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Apto Crédito
                  </span>
                </>
              )}
              </div>
              <ShareButton property={property} priceLabel={priceLabel} />
            </div>

            <h1 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.15] tracking-[-0.01em] text-lx-ink mb-2">
              {property.address}
            </h1>
            {property.location?.name && property.location.name !== property.address && (
              <p className="text-sm text-lx-stone mb-6">{property.location.name}</p>
            )}

            <div>
              <p className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink">
                {priceLabel}
              </p>
              {property.expenses != null && property.expenses > 0 && (
                <p className="text-sm text-lx-stone mt-1">
                  + Expensas {formatExpenses(property.expenses)}
                </p>
              )}
            </div>
          </motion.header>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="mb-10"
            >
              <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                Características
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-lx-parchment rounded-lg px-5 py-4 border border-lx-line">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1">
                      {stat.label}
                    </p>
                    <p className="font-serif text-xl text-lx-ink">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Descripción */}
          {description && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.15 }}
              className="mb-10 pb-10 border-b border-lx-line"
            >
              <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                Descripción
              </h2>
              <div className="prose prose-sm max-w-none text-lx-stone leading-relaxed">
                {description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            </motion.section>
          )}

          {/* Amenidades */}
          {tags.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.2 }}
              className="mb-10 pb-10 border-b border-lx-line"
            >
              <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                Comodidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10.5px] font-medium tracking-[0.08em] uppercase text-lx-stone border border-lx-line px-3 py-1.5 bg-lx-parchment rounded-full"
                  >
                    {TAG_LABELS[tag.name] ?? tag.name}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Mapa */}
          {coordinates && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.25 }}
              className="mb-10 pb-10 border-b border-lx-line"
            >
              <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                Ubicación
              </h2>
              <div className="w-full aspect-[16/9] overflow-hidden border border-lx-line rounded-xl">
                <iframe
                  title="Mapa de ubicación"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=16&output=embed&language=es`}
                  className="border-0"
                />
              </div>
              <p className="text-[10.5px] text-lx-stone mt-2">
                * La ubicación mostrada es aproximada para proteger la privacidad.
              </p>
            </motion.section>
          )}

          <p className="text-[10px] text-lx-stone/60 tracking-[0.1em]">
            Ref. #{property.id}
          </p>
        </div>

        {/* Columna derecha — STICKY contact */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="rounded-xl overflow-hidden border border-lx-line shadow-sm">
            <PropertyContact
              propertyId={property.id}
              propertyAddress={property.address}
              agentName={property.producer?.name}
              agentPhoto={property.producer?.picture ?? undefined}
            />
          </div>
        </motion.aside>
      </div>

      {/* ── PROPIEDADES SIMILARES ─────────────────────── */}
      {similarProperties.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="mt-16 pt-12 border-t border-lx-line"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-2">
                También en {neighborhood}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-lx-ink">
                Propiedades Similares
              </h2>
            </div>
            <Link
              href={`/propiedades${neighborhood ? `?location=${encodeURIComponent(neighborhood)}` : ''}`}
              className="hidden sm:block text-[10.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors"
            >
              Ver más →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
