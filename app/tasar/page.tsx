/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 * Framer Motion + PageHero + premium visuals
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Tasar Propiedades en Buenos Aires | Lexinton Propiedades',
  description: 'Tasación profesional y gratuita de propiedades en Palermo, Belgrano y zona norte.',
  alternates: { canonical: 'https://lexinton.com.ar/tasar' },
}

const diferenciadores = [
  { titulo: 'Valor real de mercado', descripcion: 'No inflamos ni subestimamos. Trabajamos con comparables reales de nuestra base de operaciones cerradas en la zona.' },
  { titulo: 'Broker especializado por zona', descripcion: 'El tasador que te atiene conoce el barrio de primera mano. No es una fórmula genérica online.' },
  { titulo: 'Sin compromiso de exclusividad', descripcion: 'La tasación es gratuita. Podés contratarnos o no. Te damos el informe igual.' },
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
      <AnimatedSection className="bg-white py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">Nuestra Metodología</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">¿Por qué elegirnos?</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {diferenciadores.map((d) => (
              <AnimatedItem key={d.titulo}>
                <div className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-px bg-lx-accent mb-6" />
                  <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink mb-4">{d.titulo}</h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{d.descripcion}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── QUÉ INCLUYE ──────────────────────────────── */}
      <AnimatedSection className="bg-lx-parchment py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">El Informe</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-8">¿Qué incluye la tasación?</h2>
              <ul className="space-y-4">
                {queIncluye.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-lx-stone leading-relaxed">
                    <span className="mt-0.5 text-lx-accent shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedItem>
            <AnimatedItem>
              <div className="border border-lx-line bg-white rounded-xl p-8 shadow-sm">
                <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent mb-2">100% gratuita</p>
                <p className="font-serif text-3xl text-lx-ink mb-4">Sin costo ni compromiso</p>
                <p className="text-sm text-lx-stone leading-relaxed">
                  La tasación no te obliga a publicar con nosotros. Pero más del 80% de los propietarios que tasaron con Lexinton nos eligen para vender.
                </p>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <AnimatedSection className="bg-lx-cream py-20 sm:py-28" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3 text-center">Tasación Gratuita</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-3 text-center">Solicitá tu tasación</h2>
              <p className="text-sm text-lx-stone text-center mb-10 leading-relaxed">
                Completá el formulario y un broker de tu zona te contactará en menos de 24hs hábiles.
              </p>
            </AnimatedItem>
            <AnimatedItem>
              <div className="bg-white rounded-xl border border-lx-line p-6 sm:p-8 shadow-sm">
                <LeadForm tipo="Tasación" showTipoPropiedad showBarrio theme="light" messagePlaceholder="¿Qué querés tasar? Indicanos dirección o barrio, m² y características." />
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
