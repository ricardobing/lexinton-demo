/**
 * /emprendimientos — Proyectos inmobiliarios seleccionados por Lexinton
 * URL idéntica a la del sitio actual para preservar indexación.
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getDevelopments } from '@/lib/tokko/queries'
import { getCoverPhoto } from '@/lib/tokko/utils'
import Image from 'next/image'
import Link from 'next/link'
import { LeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Emprendimientos Inmobiliarios en Palermo | Lexinton Propiedades',
  description: 'Invertí en los mejores emprendimientos inmobiliarios de Palermo y zona norte. Unidades en pozo, desarrollos premium y oportunidades de inversión en CABA y GBA.',
  alternates: { canonical: 'https://lexinton.com.ar/emprendimientos' },
}

const diferenciadores = [
  {
    titulo: 'Menor precio de entrada',
    descripcion: 'Comprar en pozo o en construcción siempre es más económico que a estrenar. Accedés al precio más bajo del ciclo del proyecto.',
    icono: '◈',
  },
  {
    titulo: 'Valorización durante la construcción',
    descripcion: 'A medida que avanza la obra, el valor de la unidad sube. Es habitual ver incrementos del 20–40% entre pozo y escritura.',
    icono: '◈',
  },
  {
    titulo: 'Asesoramiento en cada etapa',
    descripcion: 'Desde la selección del proyecto hasta la escritura final, te acompañamos con criterio y sin presiones. Solo recomendamos lo que recomendaríamos para nosotros mismos.',
    icono: '◈',
  },
]

async function DevelopmentsGrid() {
  const allDevs = await getDevelopments()

  // Filtramos entradas promocionales que el cliente carga en Tokko
  // (ej: "TASACIONES VIRTUALES" con QR, que no son emprendimientos reales)
  const devs = allDevs.filter((d) => {
    const name = (d.name ?? '').toLowerCase()
    const addr = (d.address ?? '').toLowerCase()
    return !name.includes('tasacion') && !addr.includes('whatsapp') && !addr.includes('online por')
  })

  if (!devs.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-lx-stone text-lg mb-6">
          Los emprendimientos disponibles se actualizan constantemente.
        </p>
        <p className="text-lx-stone/70 text-sm">
          Consultanos para conocer los proyectos actuales.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-lx-line border border-lx-line">
      {devs.map((dev) => {
        const photos = Array.isArray(dev.photos) ? dev.photos : []
        const coverPhoto = photos[0]?.image ?? null
        const location = dev.location?.name ?? ''

        return (
          <article key={dev.id} className="bg-white group">
            {/* Imagen */}
            <div className="relative aspect-[4/3] overflow-hidden bg-lx-parchment">
              {coverPhoto ? (
                <Image
                  src={coverPhoto}
                  alt={dev.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-lx-parchment">
                  <span className="text-lx-stone/30 text-4xl font-serif">{dev.name[0]}</span>
                </div>
              )}
              {dev.is_starred_on_web && (
                <div className="absolute top-4 left-4">
                  <span className="bg-lx-ink text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1">
                    Destacado
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              {location && (
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-accent mb-2">
                  {location}
                </p>
              )}
              <h3 className="font-serif text-xl text-lx-ink mb-2 leading-tight">{dev.name}</h3>
              {dev.address && (
                <p className="text-sm text-lx-stone mb-4">{dev.address}</p>
              )}
              <a
                href={`/contacto?consulta=emprendimiento-${dev.id}`}
                className="inline-block text-[10.5px] font-bold tracking-[0.14em] uppercase text-lx-accent border-b border-lx-accent/40 hover:border-lx-accent transition-colors pb-0.5"
              >
                Consultar →
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function DevelopmentsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-lx-line border border-lx-line">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white">
          <div className="aspect-[4/3] bg-lx-parchment animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-24 bg-lx-line rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-lx-line rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function EmprendimientosPage() {
  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-lx-ink text-white pt-[calc(68px+4rem)] pb-20 sm:pt-[calc(68px+6rem)] sm:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent/80 mb-5">
            Lexinton Propiedades · Emprendimientos
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-6 max-w-2xl">
            Emprendimientos con visión de futuro
          </h1>
          <p className="text-[16px] text-white/60 leading-[1.85] max-w-xl">
            Accedé a proyectos seleccionados en las zonas de mayor valorización de Buenos Aires.
            Asesoramiento experto desde la preventa hasta la escritura.
          </p>
        </div>
      </section>

      {/* ── DIFERENCIADORES ──────────────────────────── */}
      <section className="bg-lx-parchment border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-lx-line border border-lx-line">
            {diferenciadores.map((d) => (
              <div key={d.titulo} className="bg-lx-parchment px-8 py-10">
                <p className="text-lx-accent text-lg mb-4 font-serif">{d.icono}</p>
                <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink mb-3">
                  {d.titulo}
                </h3>
                <p className="text-sm text-lx-stone leading-relaxed">{d.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID DE EMPRENDIMIENTOS ───────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
                Proyectos Activos
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink">
                Proyectos disponibles
              </h2>
            </div>
            <Link
              href="/propiedades"
              className="hidden sm:block text-[10.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors"
            >
              Ver todas las propiedades →
            </Link>
          </div>
          <Suspense fallback={<DevelopmentsSkeleton />}>
            <DevelopmentsGrid />
          </Suspense>
        </div>
      </section>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <section className="bg-lx-ink py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/40 mb-5">
                Inversión · Emprendimientos
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white leading-[1.1] mb-6">
                ¿Querés invertir<br />
                <em className="italic text-white/50">en un emprendimiento?</em>
              </h2>
              <p className="text-[15px] text-white/55 leading-[1.85]">
                Contanos tu situación y te asesoramos sobre los proyectos que mejor se
                adaptan a tu presupuesto y objetivos de inversión.
              </p>
            </div>
            <LeadForm tipo="Emprendimientos" showPresupuesto theme="dark" />
          </div>
        </div>
      </section>

    </main>
  )
}
