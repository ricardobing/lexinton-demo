/**
 * /emprendimientos/[id] — Detalle de emprendimiento
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getDevelopmentById, getDevelopments } from '@/lib/tokko/queries'
import { LeadForm } from '@/components/LeadForm'
import AnimatedSection from '@/components/AnimatedSection'

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const devs = await getDevelopments()
  return devs.map((d) => ({ id: String(d.id) }))
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const dev = await getDevelopmentById(Number(id))
  if (!dev) return { title: 'Emprendimiento | Lexinton Propiedades' }

  const title = dev.publication_title || dev.name
  return {
    title: `${title} | Lexinton Propiedades`,
    description: dev.description
      ? dev.description.slice(0, 160)
      : `Emprendimiento ${title} en ${dev.location?.name ?? 'Buenos Aires'}.`,
  }
}

// ─── Construction status label ────────────────────────────────────────────────

const CONSTRUCTION_STATUS: Record<number, string> = {
  0: 'En pozo',
  1: 'En construcción',
  2: 'Terminado',
  3: 'Entrega inmediata',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dev = await getDevelopmentById(Number(id))
  if (!dev) notFound()

  const photos = Array.isArray(dev.photos) ? dev.photos : []
  const cover = photos[0]?.image ?? null
  const rest = photos.slice(1, 5)
  const statusLabel = CONSTRUCTION_STATUS[dev.construction_status] ?? null
  const title = dev.publication_title || dev.name

  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO IMAGE ──────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] max-h-[600px] bg-lx-ink">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover opacity-85"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-lx-ink to-lx-stone/40" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-lx-ink/70 via-transparent to-transparent" />

        {/* Breadcrumb */}
        <nav className="absolute top-[68px] left-0 right-0 px-5 sm:px-8 pt-6">
          <Link
            href="/emprendimientos"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Emprendimientos
          </Link>
        </nav>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-10 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-0">
              {dev.type?.name && (
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/60 mb-2">
                  {dev.type.name}
                </p>
              )}
              <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-normal text-white leading-tight">
                {title}
              </h1>
              {dev.address && (
                <p className="text-white/70 text-sm mt-1.5">{dev.address}</p>
              )}
            </div>
            {statusLabel && (
              <span className="shrink-0 text-[10px] font-bold tracking-[0.18em] uppercase bg-lx-red text-white px-3.5 py-1.5 rounded-full">
                {statusLabel}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ─────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="bg-lx-ink border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex gap-2 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {rest.map((p, i) => (
                <div key={i} className="shrink-0 w-[140px] sm:w-[180px] h-[90px] sm:h-[110px] rounded-lg overflow-hidden relative">
                  <Image
                    src={p.image}
                    alt={`${title} — foto ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14">

            {/* Left — description */}
            <AnimatedSection>
              <div>
                {dev.location?.name && (
                  <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-lx-red mb-4">
                    {dev.location.name}
                  </p>
                )}
                {dev.description ? (
                  <div
                    className="prose prose-sm max-w-none text-lx-stone leading-relaxed [&>p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: dev.description }}
                  />
                ) : (
                  <p className="text-lx-stone leading-relaxed">
                    Proyecto inmobiliario seleccionado por Lexinton en {dev.location?.name ?? 'Buenos Aires'}.
                    Consultanos para recibir toda la información disponible.
                  </p>
                )}
              </div>
            </AnimatedSection>

            {/* Right — lead form */}
            <AnimatedSection>
              <div className="bg-lx-parchment rounded-2xl p-7 border border-lx-line sticky top-[88px]">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-lx-stone/60 mb-1">
                  Consulta
                </p>
                <h2 className="font-serif text-xl text-lx-ink mb-5">
                  ¿Te interesa este proyecto?
                </h2>
                <LeadForm tipo="Emprendimientos" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── BACK CTA ────────────────────────────────────────────────── */}
      <section className="bg-lx-parchment border-t border-lx-line py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-lx-stone text-sm text-center sm:text-left">
            Explorá todos nuestros proyectos inmobiliarios en Buenos Aires
          </p>
          <Link
            href="/emprendimientos"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink border border-lx-ink rounded-full px-6 py-3 hover:bg-lx-ink hover:text-white transition-colors"
          >
            Ver todos los emprendimientos
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
