/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import TasarHero from '@/components/tasar/TasarHero'
import ValorPropuesta from '@/components/tasar/ValorPropuesta'
import ProcessSteps from '@/components/tasar/ProcessSteps'
import DifusionTotalSection from '@/components/tasar/DifusionTotalSection'
import SEOBarrios from '@/components/tasar/SEOBarrios'

export const metadata: Metadata = {
  title: 'Tasación Gratuita de Propiedades en Palermo y Zona Norte CABA | Lexinton',
  description:
    'Tasación profesional y gratuita en Palermo, Belgrano, Núñez, Recoleta, Saavedra y Villa Urquiza. Corredores matriculados con 20 años en zona norte. Sin compromiso.',
  keywords:
    'tasación gratuita Palermo, tasar departamento Belgrano, tasación inmuebles zona norte CABA, precio m2 Palermo 2025, tasar propiedad Buenos Aires',
  alternates: { canonical: 'https://lexinton.com.ar/tasar' },
}

const diferenciadores = [
  {
    title: '20 años en la misma zona',
    description:
      'Operamos exclusivamente en zona norte CABA desde 2004. Conocemos cada barrio, cada edificio y cada ciclo de mercado de Palermo a Saavedra.',
  },
  {
    title: 'Corredores matriculados, no ejecutivos de ventas',
    description:
      'El corredor que te atiende tiene matrícula habilitante y trabaja en tu barrio de forma permanente. No es un call center.',
  },
  {
    title: 'La tasación es tuya, hagas lo que hagas',
    description:
      'El informe no tiene letra chica. Podés publicar con nosotros o no. El 80% elige quedarse — pero esa decisión es tuya, tomada con información real.',
  },
]

export default function TasarPage() {
  return (
    <main className="min-h-screen">

      {/* ── 1. HERO con parallax ─────────────────────── */}
      <TasarHero />

      {/* ── 2. PROPUESTA DE VALOR ────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <ValorPropuesta />

      {/* ── 3. PROCESO EN PASOS ──────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <ProcessSteps />

      {/* ── 4. POR QUÉ ELEGIRNOS ─────────────────────── */}
      <section className="bg-white py-20 sm:py-24 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader label="Nuestra Metodología" title="¿Por qué elegirnos?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {diferenciadores.map((d, i) => (
              <FeatureCard
                key={d.title}
                title={d.title}
                description={d.description}
                icon={
                  <span className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[#C41230]/20 font-serif select-none">
                    {['I', 'II', 'III'][i]}
                  </span>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5+6. DIFUSIÓN TOTAL + STAT 80% ───────────── */}
      <DifusionTotalSection />

      {/* ── 7. FORMULARIO ────────────────────────────── */}
      <section className="bg-lx-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            {/* CTA contextual F-2 */}
            <p className="text-sm text-lx-stone italic text-center mb-6">
              El mercado de zona norte está activo. Si estás pensando en vender, este es el momento
              de saber qué tenés.
            </p>
            <SectionHeader
              label="Tasación Gratuita"
              title="Solicitá tu tasación"
              description="Completá el formulario y un broker de tu zona te contactará en menos de 24hs hábiles."
              center
            />
            <div className="bg-white rounded-xl border border-lx-line p-6 sm:p-8 shadow-sm">
              <LeadForm
                tipo="Tasación"
                showTipoPropiedad
                showBarrio
                theme="light"
                messagePlaceholder="¿Qué querés tasar? Indicanos dirección o barrio, m² y características."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. SEO POR BARRIOS ───────────────────────── */}
      <SEOBarrios />

    </main>
  )
}
