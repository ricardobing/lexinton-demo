/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 * Design system: SectionHeader, FeatureCard, NumberedSteps
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Tasar Propiedades en Buenos Aires | Lexinton Propiedades',
  description: 'Tasación profesional y gratuita de propiedades en Palermo, Belgrano y zona norte.',
  alternates: { canonical: 'https://lexinton.com.ar/tasar' },
}

const diferenciadores = [
  { title: 'Valor real de mercado', description: 'No inflamos ni subestimamos. Trabajamos con comparables reales de nuestra base de operaciones cerradas en la zona.' },
  { title: 'Broker especializado por zona', description: 'El tasador que te atiende conoce el barrio de primera mano. No es una fórmula genérica online.' },
  { title: 'Sin compromiso de exclusividad', description: 'La tasación es gratuita. Podés contratarnos o no. Te damos el informe igual.' },
]

const queIncluye = [
  'Análisis comparativo de mercado (ACM) con propiedades similares',
  'Valuación de m² cubierto y semicubierto por zona y piso',
  'Estado de conservación y potencial de mejora',
  'Estimación de tiempo de venta al precio sugerido',
  'Recomendaciones para maximizar el valor antes de publicar',
]

export default function TasarPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        label="Lexinton Propiedades · Tasaciones"
        title="Sabé cuánto vale"
        titleEmphasis="tu propiedad hoy"
        description="Tasación gratuita por un broker especialista en tu zona. Sin sorpresas, sin números inflados. El valor real que te permite vender."
      />

      {/* ── POR QUÉ ELEGIRNOS ────────────────────────── */}
      <section className="bg-white py-20 sm:py-24 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader label="Nuestra Metodología" title="¿Por qué elegirnos?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {diferenciadores.map((d) => (
              <FeatureCard key={d.title} title={d.title} description={d.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ──────────────────────────────── */}
      <section className="bg-lx-parchment py-20 sm:py-24 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection>
              <SectionHeader label="El Informe" title="¿Qué incluye la tasación?" />
              <ul className="space-y-4">
                {queIncluye.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-lx-stone leading-relaxed">
                    <span className="mt-0.5 text-lx-accent shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection>
              <div className="border border-lx-line bg-white rounded-xl p-8 shadow-sm">
                <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent mb-2">100% gratuita</p>
                <p className="font-serif text-3xl text-lx-ink mb-4">Sin costo ni compromiso</p>
                <p className="text-sm text-lx-stone leading-relaxed">
                  La tasación no te obliga a publicar con nosotros. Pero más del 80% de los propietarios que tasaron con Lexinton nos eligen para vender.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <section className="bg-lx-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            <SectionHeader
              label="Tasación Gratuita"
              title="Solicitá tu tasación"
              description="Completá el formulario y un broker de tu zona te contactará en menos de 24hs hábiles."
              center
            />
            <div className="bg-white rounded-xl border border-lx-line p-6 sm:p-8 shadow-sm">
              <LeadForm tipo="Tasación" showTipoPropiedad showBarrio theme="light" messagePlaceholder="¿Qué querés tasar? Indicanos dirección o barrio, m² y características." />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
