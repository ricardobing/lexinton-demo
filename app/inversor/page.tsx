/**
 * /inversor — Inversión inmobiliaria en Palermo
 * Framer Motion + PageHero + premium visuals
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Inversión Inmobiliaria en Palermo | Lexinton Propiedades',
  description: 'Asesoramiento en inversión inmobiliaria en Palermo, Belgrano y zona norte. Rentabilidad, seguridad y 20 años de experiencia.',
  alternates: { canonical: 'https://lexinton.com.ar/inversor' },
}

const razonesParaInvertir = [
  { titulo: 'Dolarización natural', descripcion: 'Los inmuebles en CABA se transan en USD. Tu capital queda protegido de la devaluación en pesos.' },
  { titulo: 'Renta en alquiler', descripcion: 'Rentabilidad promedio del 4–6% anual en dólares para zonas premium como Palermo y Belgrano.' },
  { titulo: 'Valorización sostenida', descripcion: 'El m² en barrios consolidados crece históricamente por encima de la inflación en USD.' },
]

const tiposInversion = [
  { titulo: 'Compra para alquilar', descripcion: 'Renta mensual en pesos o USD. Estrategia de largo plazo con bajo riesgo.' },
  { titulo: 'Compra en pozo', descripcion: 'Precio mínimo garantizado. Valorización del 20–40% durante la construcción.' },
  { titulo: 'Operación simultánea', descripcion: 'Vendés lo que tenés y comprás algo mejor. Todo coordinado el mismo día.' },
  { titulo: 'Cocheras y locales', descripcion: 'Alta renta y baja vacancia. Perfectos para inversores con menor capital.' },
]

const proceso = [
  { paso: '01', titulo: 'Consulta inicial', descripcion: 'Entendemos tu presupuesto y objetivos de inversión.' },
  { paso: '02', titulo: 'Análisis de opciones', descripcion: 'Seleccionamos las mejores oportunidades del mercado para tu perfil.' },
  { paso: '03', titulo: 'Visitas y evaluación', descripcion: 'Te acompañamos a ver las propiedades y analizamos cada una.' },
  { paso: '04', titulo: 'Oferta y negociación', descripcion: 'Manejamos la negociación para que comprés al mejor precio.' },
  { paso: '05', titulo: 'Escritura y entrega', descripcion: 'Coordinamos escribanos y gestionamos todo el cierre.' },
]

export default function InversorPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        label="Lexinton Propiedades · Inversores"
        title="Tu capital, protegido"
        titleEmphasis="en ladrillos"
        description="El mercado inmobiliario porteño es históricamente uno de los más estables de Argentina. Te ayudamos a invertir con criterio y rentabilidad real."
      />

      {/* ── POR QUÉ INVERTIR HOY ─────────────────────── */}
      <AnimatedSection className="bg-white py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">El Mercado Hoy</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">¿Por qué invertir hoy?</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {razonesParaInvertir.map((r) => (
              <AnimatedItem key={r.titulo}>
                <div className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-px bg-lx-accent mb-6" />
                  <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink mb-4">{r.titulo}</h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{r.descripcion}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── TIPOS DE INVERSIÓN ───────────────────────── */}
      <AnimatedSection className="bg-lx-parchment py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">Estrategias</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">Tipos de inversión</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tiposInversion.map((t) => (
              <AnimatedItem key={t.titulo}>
                <div className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-serif text-xl text-lx-ink mb-3">{t.titulo}</h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{t.descripcion}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── PROCESO ──────────────────────────────────── */}
      <AnimatedSection className="bg-white py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">Cómo Trabajamos</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">El proceso con Lexinton</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {proceso.map((p, i) => (
              <AnimatedItem key={p.paso}>
                <div className="relative">
                  {i < proceso.length - 1 && (
                    <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-lx-line -translate-x-4" />
                  )}
                  <span className="font-serif text-4xl text-lx-accent/30 leading-none block mb-4">{p.paso}</span>
                  <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-ink mb-2">{p.titulo}</h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{p.descripcion}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── STATS ────────────────────────────────────── */}
      <AnimatedSection className="bg-lx-parchment border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { valor: '20', unidad: 'años', label: 'en el mercado' },
              { valor: '+5.000', unidad: '', label: 'operaciones cerradas' },
              { valor: '#1', unidad: '', label: 'en simultáneas Palermo' },
            ].map((s) => (
              <AnimatedItem key={s.label}>
                <p className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-lx-ink leading-none">
                  {s.valor}<span className="text-lx-stone/50 text-xl ml-1">{s.unidad}</span>
                </p>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-stone mt-2">{s.label}</p>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <AnimatedSection className="bg-lx-ink py-20 sm:py-28" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/40 mb-5">Inversión Inmobiliaria</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white leading-[1.1] mb-6">
                Hablemos de<br /><em className="italic text-white/50">tu inversión</em>
              </h2>
              <p className="text-[15px] text-white/55 leading-[1.85]">
                Contanos con qué presupuesto contás y qué objetivos tenés. Te presentamos las mejores opciones del mercado actual.
              </p>
            </AnimatedItem>
            <AnimatedItem>
              <LeadForm tipo="Inversores" showPresupuesto showTipoPropiedad theme="dark" messagePlaceholder="Contanos sobre tu búsqueda (zona, tipo, plazo...)" />
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
