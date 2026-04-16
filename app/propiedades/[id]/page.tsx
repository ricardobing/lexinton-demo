/**
 * /propiedades/[id] — Detalle de una propiedad
 *
 * ISR: revalidate = 300 (5 min). generateStaticParams pre-renderiza las primeras 100.
 * Secciones: gallery → header → stats → description → amenities → map → contact → similares
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPropertyById, getSimilarProperties, getAllPropertyIds } from '@/lib/tokko/queries'
import {
  getCoverPhoto, getSortedPhotos, getOperationLabel, getPropertyPriceLabel,
  getNeighborhood, getPropertyTypeLabel, formatArea, formatExpenses,
  makePropertySlug, parseSlugId, cleanDescription, getDisplayTags,
  getCoordinates, TAG_LABELS, CONDITION_LABELS,
} from '@/lib/tokko/utils'
import PropertyCard from '@/components/PropertyCard'
import PropertyContact from '@/components/properties/PropertyContact'
import { PropertyGallery } from '@/components/properties/PropertyGallery'

export const revalidate = 300

interface PageProps {
  params: { id: string }
}

/* ─────────────────────────── Static params ──────────────────────────── */

export async function generateStaticParams() {
  const ids = await getAllPropertyIds()
  return ids.map((id) => ({ id: String(id) }))
}

/* ─────────────────────────── Metadata ───────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const numericId = parseSlugId(params.id)
  if (!numericId) return { title: 'Propiedad | Lexinton' }

  const property = await getPropertyById(numericId)
  if (!property) return { title: 'Propiedad no encontrada | Lexinton' }

  const coverPhoto = getCoverPhoto(property)
  const description = cleanDescription(property.description ?? '').slice(0, 155)
  const operationLabel = getOperationLabel(property)
  const priceLabel = getPropertyPriceLabel(property)

  const slug = makePropertySlug(property.id, property.address)
  const canonical = `https://lexinton.com.ar/propiedades/${slug}`
  const metaDesc = description ||
    `${getPropertyTypeLabel(property)} de ${property.room_amount ? property.room_amount + ' ambientes' : ''} en ${operationLabel.toLowerCase()} en ${getNeighborhood(property)}. ${priceLabel}.`.trim()

  return {
    title: `${property.address} · ${operationLabel} ${priceLabel} | Lexinton`,
    description: metaDesc,
    alternates: {
      canonical,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${property.address} — Lexinton Propiedades`,
      description: metaDesc,
      url: canonical,
      images: coverPhoto ? [{ url: coverPhoto, alt: `${getPropertyTypeLabel(property)} en ${getNeighborhood(property)} — ${property.address}` }] : [],
      type: 'website',
    },
  }
}

/* ─────────────────────────── Page ───────────────────────────────────── */

export default async function PropiedadDetallePage({ params }: PageProps) {
  const numericId = parseSlugId(params.id)
  if (!numericId) notFound()

  const property = await getPropertyById(numericId)
  if (!property) notFound()

  const photos = getSortedPhotos(property)
  const similarProperties = await getSimilarProperties(property, 3)
  const coordinates = getCoordinates(property)
  const description = cleanDescription(property.description ?? '')
  const tags = getDisplayTags(property.tags ?? [], 12)
  const operationLabel = getOperationLabel(property)
  const operationValue = property.operations?.[0]?.operation_type ?? ''
  const priceLabel = getPropertyPriceLabel(property)
  const neighborhood = getNeighborhood(property)
  const propertyType = getPropertyTypeLabel(property)
  const condition = CONDITION_LABELS[property.property_condition ?? ''] ?? property.property_condition

  const isRent = operationValue === 'Rent' || operationValue === 'Temporary Rent'

  /* Stats */
  const stats: { label: string; value: string | number }[] = []
  if (property.total_surface) stats.push({ label: 'Sup. total', value: formatArea(property.total_surface) })
  if (property.roofed_surface) stats.push({ label: 'Sup. cubierta', value: formatArea(property.roofed_surface) })
  if (property.unroofed_surface) stats.push({ label: 'Sup. descubierta', value: formatArea(property.unroofed_surface) })
  if (property.room_amount) stats.push({ label: 'Ambientes', value: property.room_amount })
  if (property.suite_amount) stats.push({ label: 'Dormitorios', value: property.suite_amount })
  if (property.bathroom_amount) stats.push({ label: 'Baños', value: property.bathroom_amount })
  if (property.toilet_amount) stats.push({ label: 'Toilettes', value: property.toilet_amount })
  if (property.parking_lot_amount) stats.push({ label: 'Cocheras', value: property.parking_lot_amount })
  if (property.floors_amount != null && property.floors_amount > 0) stats.push({ label: 'Piso', value: property.floors_amount })
  if (property.age) stats.push({ label: 'Antigüedad', value: property.age === 0 ? 'A estrenar' : `${property.age} años` })
  if (condition) stats.push({ label: 'Estado', value: condition })

  return (
    <main className="min-h-screen bg-white">

      {/* ── BREADCRUMB ─────────────────────────────────── */}
      <div className="bg-lx-parchment border-b border-lx-line pt-[68px]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 text-[10.5px] text-lx-stone">
          <Link href="/" className="hover:text-lx-ink transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/propiedades" className="hover:text-lx-ink transition-colors">Propiedades</Link>
          <span>/</span>
          <span className="text-lx-ink truncate max-w-[220px]">{property.address}</span>
        </div>
      </div>

      {/* ── GALLERY ────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="bg-lx-ink">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 sm:py-6">
            <PropertyGallery photos={photos} title={property.address} />
          </div>
        </section>
      )}

      {/* ── CONTENIDO ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">

          {/* Columna izquierda */}
          <div className="min-w-0">

            {/* Header */}
            <header className="mb-8 pb-8 border-b border-lx-line">
              <div className="flex flex-wrap items-center gap-2 mb-4">
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
                    <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5">
                      Apto Crédito
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.15] tracking-[-0.01em] text-lx-ink mb-2">
                {property.address}
              </h1>
              {property.location?.name && property.location.name !== property.address && (
                <p className="text-sm text-lx-stone mb-6">{property.location.name}</p>
              )}

              {/* Precio */}
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
            </header>

            {/* Stats */}
            {stats.length > 0 && (
              <section className="mb-10">
                <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                  Características
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-lx-line border border-lx-line">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-lx-parchment px-5 py-4">
                      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-lx-stone mb-1">
                        {stat.label}
                      </p>
                      <p className="font-serif text-xl text-lx-ink">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Descripción */}
            {description && (
              <section className="mb-10 pb-10 border-b border-lx-line">
                <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                  Descripción
                </h2>
                <div className="prose prose-sm max-w-none text-lx-stone leading-relaxed">
                  {description.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Amenidades */}
            {tags.length > 0 && (
              <section className="mb-10 pb-10 border-b border-lx-line">
                <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                  Comodidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[10.5px] font-medium tracking-[0.08em] uppercase text-lx-stone border border-lx-line px-3 py-1.5 bg-lx-parchment"
                    >
                      {TAG_LABELS[tag.name] ?? tag.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Mapa */}
            {coordinates && (
              <section className="mb-10 pb-10 border-b border-lx-line">
                <h2 className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-lx-stone mb-5">
                  Ubicación
                </h2>
                <div className="w-full aspect-[16/9] overflow-hidden border border-lx-line">
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
              </section>
            )}

            {/* ID de propiedad */}
            <p className="text-[10px] text-lx-stone/60 tracking-[0.1em]">
              Ref. #{property.id}
            </p>
          </div>

          {/* Columna derecha — STICKY contact */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PropertyContact
              propertyId={property.id}
              propertyAddress={property.address}
              agentName={property.producer?.name}
              agentPhoto={property.producer?.picture ?? undefined}
            />
          </aside>
        </div>

        {/* ── PROPIEDADES SIMILARES ─────────────────────── */}
        {similarProperties.length > 0 && (
          <section className="mt-16 pt-12 border-t border-lx-line">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-lx-line border border-lx-line">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
