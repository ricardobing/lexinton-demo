/**
 * /emprendimientos — Proyectos inmobiliarios seleccionados por Lexinton
 * Design system: SectionHeader, FeatureCard
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getDevelopments } from '@/lib/tokko/queries'
import Image from 'next/image'
import Link from 'next/link'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Emprendimientos Inmobiliarios en Palermo | Lexinton Propiedades',
  description: 'Invertí en los mejores emprendimientos inmobiliarios de Palermo y zona norte.',
  alternates: { canonical: 'https://lexinton.com.ar/emprendimientos' },
}

const diferenciadores = [
  { title: 'Menor precio de entrada', description: 'Comprar en pozo o en construcción siempre es más económico que a estrenar. Accedés al precio más bajo del ciclo del proyecto.', icon: '◈' },
  { title: 'Valorización durante la construcción', description: 'A medida que avanza la obra, el valor de la unidad sube. Es habitual ver incrementos del 20–40% entre pozo y escritura.', icon: '◈' },
  { title: 'Asesoramiento en cada etapa', description: 'Desde la selección del proyecto hasta la escritura final, te acompañamos con criterio y sin presiones.', icon: '◈' },
]

async function DevelopmentsGrid() {
  const allDevs = await getDevelopments()
  const devs = allDevs.filter((d) => {
    const name = (d.name ?? '').toLowerCase()
    const addr = (d.address ?? '').toLowerCase()
    return !name.includes('tasacion') && !addr.includes('whatsapp') && !addr.includes('online por')
  })

  if (!devs.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-lx-stone text-lg mb-6">Los emprendimientos disponibles se actualizan constantemente.</p>
        <p className="text-lx-stone/70 text-sm">Consultanos para conocer los proyectos actuales.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {devs.map((dev) => {
        const photos = Array.isArray(dev.photos) ? dev.photos : []
        const coverPhoto = photos[0]?.image ?? null
        const location = dev.location?.name ?? ''

        return (
          <article key={dev.id} className="bg-white rounded-xl border border-lx-line overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
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
                  <span className="bg-lx-ink text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">Destacado</span>
                </div>
              )}
            </div>
            <div className="p-6">
              {location && <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-lx-accent mb-2">{location}</p>}
              <h3 className="font-serif text-xl text-lx-ink mb-2 leading-tight">{dev.name}</h3>
              {dev.address && <p className="text-sm text-lx-stone mb-4">{dev.address}</p>}
              <Link href={`/emprendimientos/${dev.id}`} className="inline-block text-[10.5px] font-bold tracking-[0.14em] uppercase text-lx-accent border-b border-lx-accent/40 hover:border-lx-accent transition-colors pb-0.5">
                Ver proyecto →
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function DevelopmentsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-lx-line overflow-hidden">
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
      <PageHero
        label="Lexinton Propiedades · Emprendimientos"
        title="Emprendimientos con visión"
        titleEmphasis="de futuro"
        description="Accedé a proyectos seleccionados en las zonas de mayor valorización de Buenos Aires. Asesoramiento experto desde la preventa hasta la escritura."
      />

      {/* ── DIFERENCIADORES ──────────────────────────── */}
      <section className="bg-lx-parchment py-20 sm:py-24 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {diferenciadores.map((d) => (
              <FeatureCard key={d.title} title={d.title} description={d.description} icon={d.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID DE EMPRENDIMIENTOS ───────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-14">
            <SectionHeader label="Proyectos Activos" title="Proyectos disponibles" />
            <Link href="/propiedades" className="hidden sm:block text-[10.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors mb-16">
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
            <AnimatedSection>
              <SectionHeader
                label="Inversión · Emprendimientos"
                title="¿Querés invertir"
                titleEmphasis="en un emprendimiento?"
                description="Contanos tu situación y te asesoramos sobre los proyectos que mejor se adaptan a tu presupuesto y objetivos de inversión."
                labelColor="white"
              />
            </AnimatedSection>
            <AnimatedSection>
              <LeadForm tipo="Emprendimientos" showPresupuesto theme="dark" />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  )
}
