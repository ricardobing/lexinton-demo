/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import SectionHeader from '@/components/ui/SectionHeader'
import TasarHero from '@/components/tasar/TasarHero'
import ValorPropuesta from '@/components/tasar/ValorPropuesta'
import { ProcessSteps } from '@/components/tasar/ProcessSteps'
import { WhyUs } from '@/components/tasar/WhyUs'
import DifusionTotalSection from '@/components/tasar/DifusionTotalSection'
import { StatHighlight } from '@/components/tasar/StatHighlight'
import SEOBarrios from '@/components/tasar/SEOBarrios'

export const metadata: Metadata = {
  title: 'Tasación Gratuita de Propiedades en Palermo y Zona Norte CABA | Lexinton',
  description:
    'Tasación profesional y gratuita en Palermo, Belgrano, Núñez, Recoleta, Saavedra y Villa Urquiza. Corredores matriculados con 20 años en zona norte. Sin compromiso.',
  keywords:
    'tasación gratuita Palermo, tasar departamento Belgrano, tasación inmuebles zona norte CABA, precio m2 Palermo 2025, tasar propiedad Buenos Aires',
  alternates: { canonical: 'https://lexinton.com.ar/tasar' },
}

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
      <WhyUs />

      {/* ── 5. DIFUSIÓN TOTAL ────────────────────────── */}
      <DifusionTotalSection />

      {/* ── 6. STAT 83% ──────────────────────────────── */}
      <StatHighlight />

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
