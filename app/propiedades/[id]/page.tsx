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
import PropertyDetailClient from '@/components/properties/PropertyDetailClient'

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

  /* Stats — 6 campos exactos */
  const stats: { label: string; value: string | number }[] = [
    { label: 'Sup. total',       value: property.total_surface   ? formatArea(property.total_surface)   : 0 },
    { label: 'Sup. cubierta',    value: property.roofed_surface  ? formatArea(property.roofed_surface)  : 0 },
    { label: 'Sup. descubierta', value: (property.semiroofed_surface ?? property.unroofed_surface) ? formatArea((property.semiroofed_surface ?? property.unroofed_surface)!) : 0 },
    { label: 'Ambientes',        value: property.room_amount   ?? 0 },
    { label: 'Dormitorios',      value: property.suite_amount  ?? 0 },
    { label: 'Baños',            value: property.bathroom_amount ?? 0 },
  ].filter(f => f.value !== 0 && f.value !== '' && f.value !== null)

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
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 sm:py-6">
            <PropertyGallery photos={photos} title={property.address} />
          </div>
        </section>
      )}

      {/* ── CONTENIDO ──────────────────────────────────── */}
      <PropertyDetailClient
        property={property}
        stats={stats}
        description={description}
        tags={tags}
        operationLabel={operationLabel}
        priceLabel={priceLabel}
        neighborhood={neighborhood}
        propertyType={propertyType}
        coordinates={coordinates}
        isRent={isRent}
        similarProperties={similarProperties}
      />

    </main>
  )
}
