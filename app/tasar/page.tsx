/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 * Design system: SectionHeader, FeatureCard, NumberedSteps
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import DifusionTotalSection from '@/components/tasar/DifusionTotalSection'

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

export default function TasarPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        label="Lexinton Propiedades · Tasaciones"
        title="La venta de tu propiedad"
        titleEmphasis="comienza acá."
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

      {/* ── DIFUSIÓN TOTAL ───────────────────────────── */}
      <DifusionTotalSection />

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
